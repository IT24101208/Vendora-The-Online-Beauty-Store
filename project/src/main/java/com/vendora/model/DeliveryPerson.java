package com.vendora.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

import lombok.Data;


@Data
@Entity
@Table(name = "DeliveryPerson")
public class DeliveryPerson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(name = "user_code", nullable = false, unique = true, length = 50)
    private String userCode;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "phone", length = 20)
    private String phone;

    // role is always 'DELIVERY' — stored as a fixed string, not an enum,
    // since this module doesn't manage other roles
    @Column(name = "role", nullable = false)
    private String role = "DELIVERY";

    @Column(name = "status", nullable = false)
    private String status = "ACTIVE";

    @Column(name = "profile_image_url", length = 255)
    private String profileImageUrl;

    @Column(name = "emergency_contact_name", length = 100)
    private String emergencyContactName;

    @Column(name = "emergency_contact_phone", length = 20)
    private String emergencyContactPhone;

    @Column(name = "vehicle_type", length = 50)
    private String vehicleType;

    @Column(name = "vehicle_model", length = 50)
    private String vehicleModel;

    @Column(name = "license_plate", length = 20)
    private String licensePlate;

    @Column(name = "province", length = 50)
    private String province;

    @Column(name = "district", length = 50)
    private String district;

    @Column(name = "driving_license_url", length = 255)
    private String drivingLicenseUrl;

    @Column(name = "vehicle_registration_url", length = 255)
    private String vehicleRegistrationUrl;

    @Column(name = "created_at", updatable = false,
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;
}
