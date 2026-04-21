package com.vendora.repository;

import com.vendora.model.Product;
import com.vendora.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findBySupplier(Supplier supplier);
    long countBySupplier(Supplier supplier);
}