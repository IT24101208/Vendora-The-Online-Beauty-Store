package com.vendora.dto;
import lombok.Data;

@Data
public class CreateDeliveryDTO {
    private String orderId;
    private String customerId;
    private String trackingNumber;
    private String deliveryAddress;
    private String notes;
    private String createdBy;
}
