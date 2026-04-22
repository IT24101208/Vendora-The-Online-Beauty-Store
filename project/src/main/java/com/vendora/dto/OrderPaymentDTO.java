package com.vendora.dto;

import lombok.Data;

/**
 * Sent by the Order module when an order payment is confirmed.
 * Triggers automatic delivery record creation in this module.
 */
@Data
public class OrderPaymentDTO {
    private Long orderId;
    private String orderCode;
    private Long customerId;
    private String customerDistrict;
    private String deliveryAddress;
    private String notes;
}
