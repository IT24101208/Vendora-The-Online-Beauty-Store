package com.vendora.repository;

import com.vendora.model.Delivery;
import com.vendora.model.DeliveryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DeliveryRepository extends JpaRepository<Delivery, String> {
    List<Delivery> findByCustomerIdOrderByCreatedAtDesc(String customerId);
    List<Delivery> findByStatusOrderByCreatedAtDesc(DeliveryStatus status);
    List<Delivery> findAllByOrderByCreatedAtDesc();
}
