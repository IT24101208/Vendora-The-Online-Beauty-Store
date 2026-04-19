package com.vendora.dto;

import lombok.Data;

@Data
public class FailureLogRequestDTO {
    private String loggedBy;
    private String reasonCode;
    private String description;
}
