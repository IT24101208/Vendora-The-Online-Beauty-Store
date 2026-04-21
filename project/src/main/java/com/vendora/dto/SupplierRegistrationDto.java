package com.vendora.dto;

import lombok.Data;

@Data
public class SupplierRegistrationDto {
    private String companyName;
    private String contactPerson;
    private String email;
    private String phone;
    private String address;
    private String password; // will be set as email initially
}