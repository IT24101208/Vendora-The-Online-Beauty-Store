package com.vendora.service;

import com.vendora.cart.dto.CartItemDto;
import com.vendora.model.Cart;
import com.vendora.model.CartItem;
import com.vendora.model.Product;
import com.vendora.model.User;
import com.vendora.repository.CartItemRepository;
import com.vendora.repository.CartRepository;
import com.vendora.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Cart business logic. Wraps the team's Cart / CartItem / Product entities.
 *
 * NOTE: Adjust the imports above (com.vendora.model.*) to match the
 * package the team uses for the shared domain entities.
 */
@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
    }

    /** Get (or lazily create) the cart belonging to this user. */
    @Transactional
    public Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart c = new Cart();
                    c.setUser(user);
                    return cartRepository.save(c);
                });
    }

    /** Map cart items to DTOs the views and JSON endpoint can consume. */
    @Transactional(readOnly = true)
    public List<CartItemDto> listItems(User user) {
        Cart cart = getOrCreateCart(user);
        List<CartItemDto> result = new ArrayList<>();
        for (CartItem ci : cart.getItems()) {
            Product p = ci.getProduct();
            result.add(new CartItemDto(
                    ci.getId(),
                    p.getId(),
                    p.getName(),
                    p.getPrice(),
                    ci.getQuantity(),
                    p.getStockQuantity(),
                    p.getImagePath() != null ? p.getImagePath() : ""
            ));
        }
        return result;
    }

    @Transactional
    public void addToCart(User user, Long productId, int quantity) {
        Cart cart = getOrCreateCart(user);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        CartItem existing = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst()
                .orElse(null);

        if (existing != null) {
            int next = Math.min(existing.getQuantity() + quantity, product.getStockQuantity());
            existing.setQuantity(next);
            cartItemRepository.save(existing);
        } else {
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(Math.min(quantity, product.getStockQuantity()));
            cartItemRepository.save(item);
            cart.getItems().add(item);
        }
    }

    @Transactional
    public CartItemDto updateQuantity(User user, Long itemId, int newQuantity) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found"));

        if (!item.getCart().getUser().getId().equals(user.getId())) {
            throw new SecurityException("Not your cart item");
        }

        int stock = item.getProduct().getStockQuantity();
        int clamped = Math.max(1, Math.min(newQuantity, stock));
        item.setQuantity(clamped);
        cartItemRepository.save(item);

        Product p = item.getProduct();
        return new CartItemDto(
                item.getId(), p.getId(), p.getName(), p.getPrice(),
                item.getQuantity(), p.getStockQuantity(),
                p.getImagePath() != null ? p.getImagePath() : ""
        );
    }

    @Transactional
    public void removeItem(User user, Long itemId) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found"));
        if (!item.getCart().getUser().getId().equals(user.getId())) {
            throw new SecurityException("Not your cart item");
        }
        cartItemRepository.delete(item);
    }

    @Transactional
    public void removeItems(User user, List<Long> itemIds) {
        if (itemIds == null || itemIds.isEmpty()) return;
        for (Long id : itemIds) {
            removeItem(user, id);
        }
    }

    @Transactional(readOnly = true)
    public BigDecimal subtotalFor(User user, List<Long> itemIds) {
        return listItems(user).stream()
                .filter(i -> itemIds == null || itemIds.contains(i.getId()))
                .map(CartItemDto::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
