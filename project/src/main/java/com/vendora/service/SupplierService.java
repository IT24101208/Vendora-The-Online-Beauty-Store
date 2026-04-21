package com.vendora.service;

import com.vendora.dto.SupplierRegistrationDto;
import com.vendora.model.Role;
import com.vendora.model.Supplier;
import com.vendora.model.User;
import com.vendora.repository.SupplierRepository;
import com.vendora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierService {
    private final SupplierRepository supplierRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Transactional
    public void registerSupplier(SupplierRegistrationDto dto) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        User user = new User();
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getEmail())); // default password = email
        user.setFullName(dto.getCompanyName());
        user.setRole(Role.SUPPLIER);
        user.setEnabled(false);
        userRepository.save(user);

        Supplier supplier = new Supplier();
        supplier.setCompanyName(dto.getCompanyName());
        supplier.setContactPerson(dto.getContactPerson());
        supplier.setEmail(dto.getEmail());
        supplier.setPhone(dto.getPhone());
        supplier.setAddress(dto.getAddress());
        supplier.setStatus("PENDING");
        supplier.setUser(user);
        supplierRepository.save(supplier);
    }

    @Transactional
    public void approveSupplier(Long supplierId) {
        Supplier supplier = supplierRepository.findById(supplierId).orElseThrow();
        supplier.setStatus("ACTIVE");
        User user = supplier.getUser();
        user.setEnabled(true);
        userRepository.save(user);
        supplierRepository.save(supplier);
        emailService.sendApprovalEmail(supplier.getEmail(), supplier.getCompanyName(), user.getEmail(), user.getEmail());
    }

    @Transactional
    public void rejectSupplier(Long supplierId) {
        Supplier supplier = supplierRepository.findById(supplierId).orElseThrow();
        emailService.sendRejectionEmail(supplier.getEmail(), supplier.getCompanyName());
        supplierRepository.delete(supplier);
        // also delete associated user (optional)
        userRepository.delete(supplier.getUser());
    }

    public List<Supplier> getPendingSuppliers() {
        return supplierRepository.findByStatus("PENDING");
    }

    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    public Supplier getSupplierByUser(Long userId) {
        return supplierRepository.findByUser_Id(userId).orElseThrow();
    }
}