package com.vendora.model;

import com.vendora.common.UserRole;
import jakarta.persistence.*;

@Entity
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private UserRole name;

    public UserRole getName() {
        return name;
    }

    public void setName(UserRole name) {
        this.name = name;
    }
}