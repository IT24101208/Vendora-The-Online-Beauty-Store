package com.vendora.controller;

import com.vendora.dto.ProductDto;
import com.vendora.model.Product;
import com.vendora.model.Supplier;
import com.vendora.repository.ProductRepository;
import com.vendora.repository.SupplierRepository;
import com.vendora.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Controller
@RequestMapping("/supplier/dashboard")
@RequiredArgsConstructor
public class SupplierDashboardController {
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;
    private final FileUploadService fileUploadService;

    private Supplier getSupplier(UserDetails userDetails) {
        return supplierRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));
    }

    @GetMapping
    public String dashboard(@AuthenticationPrincipal UserDetails userDetails, Model model) {
        Supplier supplier = getSupplier(userDetails);
        model.addAttribute("supplier", supplier);
        model.addAttribute("products", productRepository.findBySupplier(supplier));
        model.addAttribute("productCount", productRepository.countBySupplier(supplier));
        // pending orders can be added later via OrderRepository
        return "supplier/dashboard";
    }

    @GetMapping("/products/new")
    public String newProductForm(Model model) {
        model.addAttribute("product", new ProductDto());
        return "supplier/product-form";
    }

    @PostMapping("/products")
    public String addProduct(@AuthenticationPrincipal UserDetails userDetails,
                             @ModelAttribute ProductDto dto,
                             @RequestParam("imageFile") MultipartFile imageFile) throws IOException {
        Supplier supplier = getSupplier(userDetails);
        Product product = new Product();
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStockQuantity(dto.getStockQuantity());
        product.setCategory(dto.getCategory());
        product.setSupplier(supplier);
        if (imageFile != null && !imageFile.isEmpty()) {
            String imagePath = fileUploadService.saveImage(imageFile);
            product.setImagePath(imagePath);
        }
        productRepository.save(product);
        return "redirect:/supplier/dashboard";
    }

    @GetMapping("/products/edit/{id}")
    public String editProductForm(@PathVariable Long id,
                                  @AuthenticationPrincipal UserDetails userDetails,
                                  Model model) {
        Product product = productRepository.findById(id).orElseThrow();
        Supplier supplier = getSupplier(userDetails);
        if (!product.getSupplier().getId().equals(supplier.getId())) {
            return "redirect:/supplier/dashboard?error=unauthorized";
        }
        model.addAttribute("product", product);
        return "supplier/product-form";
    }

    @PostMapping("/products/update/{id}")
    public String updateProduct(@PathVariable Long id,
                                @ModelAttribute ProductDto dto,
                                @RequestParam(value = "imageFile", required = false) MultipartFile imageFile) throws IOException {
        Product product = productRepository.findById(id).orElseThrow();
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStockQuantity(dto.getStockQuantity());
        product.setCategory(dto.getCategory());
        if (imageFile != null && !imageFile.isEmpty()) {
            String imagePath = fileUploadService.saveImage(imageFile);
            product.setImagePath(imagePath);
        }
        productRepository.save(product);
        return "redirect:/supplier/dashboard";
    }

    @PostMapping("/products/delete/{id}")
    public String deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
        return "redirect:/supplier/dashboard";
    }
}