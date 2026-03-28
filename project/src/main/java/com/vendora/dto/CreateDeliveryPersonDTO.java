package com.vendora.dto;


import lombok.Data;

@Data
public class CreateDeliveryPersonDTO {

    // Required fields
    private String name;
    private String email;
    private String password;          // will be BCrypt-hashed before saving

    // Contact
    private String phone;
    private String address;

    // Location
    private String province;
    private String district;

    // Vehicle
    private String vehicleType;
    private String vehicleModel;
    private String licensePlate;

    // Emergency contact
    private String emergencyContactName;
    private String emergencyContactPhone;

    // Document URLs (uploaded separately by the frontend, stored as URLs)
    private String drivingLicenseUrl;
    private String vehicleRegistrationUrl;
    private String profileImageUrl;
}
