package com.vendora.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;



import com.vendora.model.Delivery;
import com.vendora.model.DeliveryPerson;
import com.vendora.model.DeliveryStatus;


public interface DeliveryRepository extends JpaRepository<Delivery, Long> {

    List<Delivery> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    List<Delivery> findByAgentOrderByUpdatedAtDesc(DeliveryPerson agent);

    List<Delivery> findByStatusOrderByCreatedAtDesc(DeliveryStatus status);

    List<Delivery> findAllByOrderByCreatedAtDesc();
}
