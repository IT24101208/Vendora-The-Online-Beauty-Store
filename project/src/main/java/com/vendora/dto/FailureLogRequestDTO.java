package com.vendora.dto;

import lombok.Data;

@Data
public class FailureLogRequestDTO {
    private Long loggedBy;
    private String reasonCode;
    private String description;
}
