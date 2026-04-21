package com.vendor.supplier.service;

import com.vendora.model.Role;
import com.vendora.model.User;
import com.vendora.repository.UserRepository;
import com.vendora.supplier.dto.SupplierRegistrationDto;
import com.vendora.supplier.model.Supplier;
import com.vendora.supplier.model.SupplierStatus;
import com.vendora.supplier.repository.SupplierRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Business logic for supplier registration / approval / rejection.
 */
@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public SupplierService(SupplierRepository supplierRepository,
                           UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           EmailService emailService) {
        this.supplierRepository = supplierRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @Transactional
    public Supplier register(SupplierRegistrationDto dto) {
        supplierRepository.findByEmail(dto.getEmail()).ifPresent(s -> {
            throw new IllegalStateException("A supplier with this email already exists.");
        });

        Supplier s = new Supplier();
        s.setCompanyName(dto.getCompanyName());
        s.setContactPerson(dto.getContactPerson());
        s.setEmail(dto.getEmail());
        s.setPhone(dto.getPhone());
        s.setAddress(dto.getAddress());
        s.setStatus(SupplierStatus.PENDING);
        return supplierRepository.save(s);
    }

    public List<Supplier> pending() {
        return supplierRepository.findByStatus(SupplierStatus.PENDING);
    }

    public List<Supplier> all() {
        return supplierRepository.findAll();
    }

    public List<Supplier> search(String q) {
        if (q == null || q.isBlank()) return all();
        return supplierRepository
                .findByCompanyNameContainingIgnoreCaseOrEmailContainingIgnoreCase(q, q);
    }

    public Supplier byId(Long id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Supplier not found: " + id));
    }

    public Supplier byUser(User user) {
        return supplierRepository.findByUser(user)
                .orElseThrow(() -> new IllegalStateException("No supplier profile linked to user"));
    }

    /**
     * Approve a supplier: create a User account with role SUPPLIER, default
     * password equal to the supplier's email, then email the credentials.
     */
    @Transactional
    public Supplier approve(Long supplierId) {
        Supplier s = byId(supplierId);
        if (s.getStatus() == SupplierStatus.APPROVED) {
            return s;
        }

        String tempPassword = s.getEmail();   // simple "password = email" rule

        User user = new User();
        user.setEmail(s.getEmail());
        user.setFullName(s.getContactPerson());
        user.setPassword(passwordEncoder.encode(tempPassword));
        user.setRole(Role.SUPPLIER);
        user.setEnabled(true);
        userRepository.save(user);

        s.setUser(user);
        s.setStatus(SupplierStatus.APPROVED);
        supplierRepository.save(s);

        emailService.sendApprovalEmail(s.getEmail(), s.getCompanyName(), tempPassword);
        return s;
    }

    /** Reject: remove the pending row and email the supplier. */
    @Transactional
    public void reject(Long supplierId) {
        Supplier s = byId(supplierId);
        emailService.sendRejectionEmail(s.getEmail(), s.getCompanyName());
        supplierRepository.delete(s);
    }

    @Transactional
    public void delete(Long supplierId) {
        Supplier s = byId(supplierId);
        // The team's User cascade will clean up products via Product.supplier.
        supplierRepository.delete(s);
    }
}
