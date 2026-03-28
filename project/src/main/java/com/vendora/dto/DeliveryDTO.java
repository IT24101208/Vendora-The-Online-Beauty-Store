package com.vendora.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;


import com.vendora.model.Delivery;
import lombok.Data;


@Data
public class DeliveryDTO {

    private Long id;
    private String deliveryCode;
    private Long customerId;
    private String agentName;
    private String status;
    private String address;
    private String province;
    private String district;
    private String trackingNumber;
    private String failureReason;
    private LocalDate deliveryDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static DeliveryDTO from(Delivery d) {
        DeliveryDTO dto = new DeliveryDTO();
        dto.setId(d.getId());
        dto.setDeliveryCode(d.getDeliveryCode());
        dto.setCustomerId(d.getCustomerId());
        dto.setAgentName(d.getAgent() != null ? d.getAgent().getName() : null);
        dto.setStatus(d.getStatus().name());
        dto.setAddress(d.getAddress());
        dto.setProvince(d.getProvince());
        dto.setDistrict(d.getDistrict());
        dto.setTrackingNumber(d.getTrackingNumber());
        dto.setFailureReason(d.getFailureReason());
        dto.setDeliveryDate(d.getDeliveryDate());
        dto.setCreatedAt(d.getCreatedAt());
        dto.setUpdatedAt(d.getUpdatedAt());
        return dto;
    }
}
