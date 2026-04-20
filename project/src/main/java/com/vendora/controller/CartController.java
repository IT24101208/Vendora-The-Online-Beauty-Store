package com.vendora.controller;

import com.vendora.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping("/cart")
    public String showCart(Model model) {
        model.addAttribute("items", cartService.getAllCartItems());
        return "cart";
    }

    @PostMapping("/cart/remove/{id}")
    public String removeItem(@PathVariable Long id) {
        cartService.removeFromCart(id);
        return "redirect:/cart";
    }
}