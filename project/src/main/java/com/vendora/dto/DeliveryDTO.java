package com.vendora.dto;
import com.vendora.model.Delivery;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DeliveryDTO {

    private String id;
    private String orderId;
    private String customerId;
    private String trackingNumber;
    private String status;
    private String deliveryAddress;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime pickedUpAt;
    private LocalDateTime deliveredAt;

    public static DeliveryDTO from(Delivery d) {
        DeliveryDTO dto = new DeliveryDTO();
        dto.setId(d.getId());
        dto.setOrderId(d.getOrderId());
        dto.setCustomerId(d.getCustomerId());
        dto.setTrackingNumber(d.getTrackingNumber());
        dto.setStatus(d.getStatus().name());
        dto.setDeliveryAddress(d.getDeliveryAddress());
        dto.setNotes(d.getNotes());
        dto.setCreatedAt(d.getCreatedAt());
        dto.setPickedUpAt(d.getPickedUpAt());
        dto.setDeliveredAt(d.getDeliveredAt());
        return dto;
    }
}
