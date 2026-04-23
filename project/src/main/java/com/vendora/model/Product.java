package com.cosmetic.app.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Product name is required")
    @Column(nullable = false, length = 200)
    private String name;

    @NotBlank(message = "Brand is required")
    @Column(nullable = false, length = 100)
    private String brand;

    @Column(unique = true, length = 100)
    private String sku;

    @Column(unique = true, length = 50)
    private String barcode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String ingredients;

    @Column(columnDefinition = "TEXT")
    private String usageInstructions;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(precision = 10, scale = 2)
    private BigDecimal costPrice;

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock cannot be negative")
    @Column(nullable = false)
    private Integer stockQuantity;

    @NotNull(message = "Low stock threshold is required")
    @Min(value = 1)
    @Column(nullable = false)
    private Integer lowStockThreshold;

    @Column(length = 50)
    private String unit; // e.g. ml, g, oz, pcs

    @Column(length = 100)
    private String shade;

    @Column(length = 100)
    private String skinType; // e.g. Oily, Dry, Combination

    @Column(length = 100)
    private String volume; // e.g. 200ml, 50g

    // Supplier / Vendor Info
    @Column(length = 200)
    private String supplierName;

    @Column(length = 100)
    private String supplierContact;

    @Column(length = 200)
    private String supplierEmail;

    @Column(length = 200)
    private String supplierAddress;

    // Dates
    private LocalDate manufactureDate;
    private LocalDate expiryDate;

    // Image stored directly in MySQL as LONGBLOB
    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] image;

    @Column(length = 50)
    private String imageContentType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ProductStatus status = ProductStatus.ACTIVE;

    @Column(length = 100)
    private String countryOfOrigin;

    @Column(columnDefinition = "TEXT")
    private String tags; // comma separated

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Computed: is this product low on stock?
    @Transient
    public boolean isLowStock() {
        return stockQuantity != null && lowStockThreshold != null
               && stockQuantity <= lowStockThreshold;
    }

    public enum Category {
        SKINCARE, MAKEUP, HAIRCARE, FRAGRANCE, BODYCARE,
        NAILCARE, SUNCARE, MENCARE, BABYCARE, WELLNESS
    }

    public enum ProductStatus {
        ACTIVE, INACTIVE, DISCONTINUED
    }
}
