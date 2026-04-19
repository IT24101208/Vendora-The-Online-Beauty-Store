package com.vendora.dto;

import lombok.Data;

@Data
public class ReturnRequestCreateDTO {
    private String customerId;
    private String reasonCode;
    private String description;
}
