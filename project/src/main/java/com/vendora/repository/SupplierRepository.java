package com.vendora.repository;

import com.vendora.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    Optional<Supplier> findByEmail(String email);
    Optional<Supplier> findByUser_Id(Long userId);
    List<Supplier> findByStatus(String status);
}