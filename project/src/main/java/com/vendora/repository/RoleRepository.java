package com.vendora.repository;

import com.vendora.common.UserRole;
import com.vendora.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository
        extends JpaRepository<Role, Long> {

    Optional<Role> findByName(UserRole name);
}