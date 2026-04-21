package com.vendora.cart.repository;

import com.vendora.cart.model.Cart;
import com.vendora.cart.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByCart(Cart cart);
    void deleteByCart(Cart cart);
}
