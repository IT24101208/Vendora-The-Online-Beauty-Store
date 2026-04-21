package com.vendora.controller;

import com.vendora.dto.SupplierRegistrationDto;
import com.vendora.service.SupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/supplier")
@RequiredArgsConstructor
public class SupplierAuthController {
    private final SupplierService supplierService;

    @GetMapping("/register")
    public String showRegisterForm(Model model) {
        model.addAttribute("registration", new SupplierRegistrationDto());
        return "supplier/register";
    }

    @PostMapping("/register")
    public String registerSupplier(@ModelAttribute SupplierRegistrationDto dto, Model model) {
        try {
            supplierService.registerSupplier(dto);
            model.addAttribute("success", "Registration submitted. You will receive an email once approved.");
        } catch (Exception e) {
            model.addAttribute("error", e.getMessage());
        }
        return "supplier/register";
    }
}