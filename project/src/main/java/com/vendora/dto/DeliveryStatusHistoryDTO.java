package com.vendora.dto;

import com.vendora.model.DeliveryStatusHistory;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DeliveryStatusHistoryDTO {

    private String id;
    private String deliveryId;
    private String status;
    private String changedBy;
    private LocalDateTime changedAt;

    public static DeliveryStatusHistoryDTO from(DeliveryStatusHistory h) {
        DeliveryStatusHistoryDTO dto = new DeliveryStatusHistoryDTO();
        dto.setId(h.getId());
        dto.setDeliveryId(h.getDeliveryId());
        dto.setStatus(h.getStatus().name());
        dto.setChangedBy(h.getChangedBy());
        dto.setChangedAt(h.getChangedAt());
        return dto;
    }
}
