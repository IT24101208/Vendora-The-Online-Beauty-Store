package com.vendora.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private BigDecimal price;      // in LKR
    private int stockQuantity;
    private String category;
    private String imagePath;      // e.g., "/uploads/product-123.jpg"

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;
}