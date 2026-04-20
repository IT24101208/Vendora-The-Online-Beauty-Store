package com.vendora.service;

import com.vendora.model.CartItem;
import com.vendora.repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    public List<CartItem> getAllCartItems() {
        return cartItemRepository.findAll();
    }

    public void removeFromCart(Long id) {
        cartItemRepository.deleteById(id);
    }
}