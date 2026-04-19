package com.vendora.repository;

import com.vendora.model.AssignmentStatus;
import com.vendora.model.DeliveryAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DeliveryAssignmentRepository extends JpaRepository<DeliveryAssignment, String> {
    List<DeliveryAssignment> findByAgentIdOrderByAssignedAtDesc(String agentId);
    List<DeliveryAssignment> findByDeliveryId(String deliveryId);
    Optional<DeliveryAssignment> findByDeliveryIdAndStatus(String deliveryId, AssignmentStatus status);
}
