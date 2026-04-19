package com.vendora.repository;

import com.vendora.model.DeliveryStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DeliveryStatusHistoryRepository extends JpaRepository<DeliveryStatusHistory, String> {
    List<DeliveryStatusHistory> findByDeliveryIdOrderByChangedAtAsc(String deliveryId);
}
