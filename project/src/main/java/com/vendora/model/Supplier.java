package com.vendora.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "suppliers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Supplier {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String companyName;
    private String contactPerson;
    private String email;
    private String phone;
    private String address;
    private String status = "PENDING"; // PENDING, ACTIVE, INACTIVE

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "supplier", cascade = CascadeType.ALL)
    private List<Product> products = new ArrayList<>();
}