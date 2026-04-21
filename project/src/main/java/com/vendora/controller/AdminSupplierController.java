package com.vendora.controller;

import com.vendora.service.SupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin/suppliers")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminSupplierController {
    private final SupplierService supplierService;

    @GetMapping
    public String listSuppliers(Model model) {
        model.addAttribute("suppliers", supplierService.getAllSuppliers());
        return "admin/supplier-list";
    }

    @GetMapping("/pending")
    public String pendingApprovals(Model model) {
        model.addAttribute("pendingList", supplierService.getPendingSuppliers());
        return "admin/supplier-approvals";
    }

    @PostMapping("/approve/{id}")
    public String approve(@PathVariable Long id) {
        supplierService.approveSupplier(id);
        return "redirect:/admin/suppliers/pending";
    }

    @PostMapping("/reject/{id}")
    public String reject(@PathVariable Long id) {
        supplierService.rejectSupplier(id);
        return "redirect:/admin/suppliers/pending";
    }

    @PostMapping("/delete/{id}")
    public String deleteSupplier(@PathVariable Long id) {
        supplierService.rejectSupplier(id); // or custom delete logic
        return "redirect:/admin/suppliers";
    }
}