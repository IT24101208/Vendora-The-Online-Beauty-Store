package com.vendora.dto;

import lombok.Data;

@Data
public class ReturnRequestCreateDTO {
    private Long customerId;
    private String reasonCode;
    private String description;
}
