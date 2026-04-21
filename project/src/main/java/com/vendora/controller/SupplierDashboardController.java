package com.vendora.controller;

import com.vendora.model.Order;
import com.vendora.model.Product;
import com.vendora.model.User;
import com.vendora.repository.OrderRepository;
import com.vendora.repository.ProductRepository;
import com.vendora.service.UserService;
import com.vendora.supplier.dto.ProductForm;
import com.vendora.supplier.model.Supplier;
import com.vendora.supplier.service.FileUploadService;
import com.vendora.supplier.service.SupplierService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/supplier")
@PreAuthorize("hasRole('SUPPLIER')")
public class SupplierDashboardController {

    private final SupplierService supplierService;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final UserService userService;
    private final FileUploadService fileUploadService;

    public SupplierDashboardController(SupplierService supplierService,
                                       ProductRepository productRepository,
                                       OrderRepository orderRepository,
                                       UserService userService,
                                       FileUploadService fileUploadService) {
        this.supplierService = supplierService;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.userService = userService;
        this.fileUploadService = fileUploadService;
    }

    // -------- Dashboard --------
    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        User user = userService.getCurrentUser();
        Supplier supplier = supplierService.byUser(user);

        List<Product> products = productRepository.findBySupplier(supplier);
        long pendingOrders = orderRepository.countPendingOrdersBySupplier(supplier.getId());

        model.addAttribute("supplier", supplier);
        model.addAttribute("products", products);
        model.addAttribute("productCount", products.size());
        model.addAttribute("pendingOrders", pendingOrders);
        return "supplier/dashboard";
    }

    // -------- Add product --------
    @GetMapping("/product/new")
    public String newProduct(Model model) {
        if (!model.containsAttribute("form")) {
            model.addAttribute("form", new ProductForm());
        }
        model.addAttribute("editing", false);
        return "supplier/product-form";
    }

    // -------- Edit product --------
    @GetMapping("/product/edit/{id}")
    public String editProduct(@PathVariable Long id, Model model) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        // Ensure ownership
        Supplier supplier = supplierService.byUser(userService.getCurrentUser());
        if (!p.getSupplier().getId().equals(supplier.getId())) {
            throw new SecurityException("Not your product");
        }

        ProductForm form = new ProductForm();
        form.setId(p.getId());
        form.setName(p.getName());
        form.setCategory(p.getCategory());
        form.setPrice(p.getPrice());
        form.setStockQuantity(p.getStockQuantity());
        form.setDescription(p.getDescription());
        form.setExistingImagePath(p.getImagePath());

        model.addAttribute("form", form);
        model.addAttribute("editing", true);
        return "supplier/product-form";
    }

    // -------- Save (create / update) --------
    @PostMapping("/product/save")
    public String saveProduct(@Valid @ModelAttribute("form") ProductForm form,
                              BindingResult br,
                              RedirectAttributes ra,
                              Model model) {
        if (br.hasErrors()) {
            model.addAttribute("editing", form.getId() != null);
            return "supplier/product-form";
        }

        Supplier supplier = supplierService.byUser(userService.getCurrentUser());

        Product p;
        if (form.getId() == null) {
            p = new Product();
            p.setSupplier(supplier);
        } else {
            p = productRepository.findById(form.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found"));
            if (!p.getSupplier().getId().equals(supplier.getId())) {
                throw new SecurityException("Not your product");
            }
        }

        p.setName(form.getName());
        p.setCategory(form.getCategory());
        p.setPrice(form.getPrice());
        p.setStockQuantity(form.getStockQuantity());
        p.setDescription(form.getDescription());

        if (form.getImage() != null && !form.getImage().isEmpty()) {
            String url = fileUploadService.store(form.getImage());
            p.setImagePath(url);
        } else if (form.getExistingImagePath() != null) {
            p.setImagePath(form.getExistingImagePath());
        }

        productRepository.save(p);

        ra.addFlashAttribute("toast",
                form.getId() == null ? "Product added" : "Product updated");
        return "redirect:/supplier/dashboard";
    }

    // -------- Delete --------
    @GetMapping("/product/delete/{id}")
    public String deleteProduct(@PathVariable Long id, RedirectAttributes ra) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        Supplier supplier = supplierService.byUser(userService.getCurrentUser());
        if (!p.getSupplier().getId().equals(supplier.getId())) {
            throw new SecurityException("Not your product");
        }
        productRepository.delete(p);
        ra.addFlashAttribute("toast", "Product removed");
        return "redirect:/supplier/dashboard";
    }

    // -------- Accept order (simplified) --------
    @PostMapping("/order/{id}/accept")
    public String acceptOrder(@PathVariable("id") Long orderId, RedirectAttributes ra) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        order.setStatus("ACCEPTED");
        // Stock decrement is assumed to be handled by OrderService at order time.
        orderRepository.save(order);
        ra.addFlashAttribute("toast", "Order #" + orderId + " accepted");
        return "redirect:/supplier/dashboard";
    }
}
