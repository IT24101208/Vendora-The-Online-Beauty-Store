package com.vendora.service;

import com.vendora.dto.*;
import com.vendora.model.*;
import com.vendora.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final DeliveryAssignmentRepository assignmentRepository;
    private final DeliveryStatusHistoryRepository historyRepository;
    private final FailureLogRepository failureLogRepository;
    private final ReturnRequestRepository returnRequestRepository;

    public DeliveryService(DeliveryRepository deliveryRepository,
                           DeliveryAssignmentRepository assignmentRepository,
                           DeliveryStatusHistoryRepository historyRepository,
                           FailureLogRepository failureLogRepository,
                           ReturnRequestRepository returnRequestRepository) {
        this.deliveryRepository     = deliveryRepository;
        this.assignmentRepository   = assignmentRepository;
        this.historyRepository      = historyRepository;
        this.failureLogRepository   = failureLogRepository;
        this.returnRequestRepository = returnRequestRepository;
    }

    // ── ADMIN ─────────────────────────────────────────────────

    public DeliveryDTO createDelivery(CreateDeliveryDTO dto) {
        Delivery delivery = new Delivery();
        delivery.setOrderId(dto.getOrderId());
        delivery.setCustomerId(dto.getCustomerId());
        delivery.setTrackingNumber(dto.getTrackingNumber());
        delivery.setDeliveryAddress(dto.getDeliveryAddress());
        delivery.setNotes(dto.getNotes());
        Delivery saved = deliveryRepository.save(delivery);
        recordHistory(saved.getId(), DeliveryStatus.PENDING, dto.getCreatedBy());
        return DeliveryDTO.from(saved);
    }

    public List<DeliveryDTO> getAllDeliveries() {
        return deliveryRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(DeliveryDTO::from).collect(Collectors.toList());
    }

    public DeliveryDTO getDelivery(String id) {
        return DeliveryDTO.from(findDelivery(id));
    }

    public List<DeliveryDTO> getDeliveriesByStatus(DeliveryStatus status) {
        return deliveryRepository.findByStatusOrderByCreatedAtDesc(status)
                .stream().map(DeliveryDTO::from).collect(Collectors.toList());
    }

    public DeliveryAssignmentDTO assignAgent(String deliveryId, AssignAgentDTO dto) {
        Delivery delivery = findDelivery(deliveryId);
        delivery.setStatus(DeliveryStatus.ASSIGNED);
        deliveryRepository.save(delivery);

        DeliveryAssignment assignment = new DeliveryAssignment();
        assignment.setDeliveryId(deliveryId);
        assignment.setAgentId(dto.getAgentId());
        DeliveryAssignment saved = assignmentRepository.save(assignment);

        recordHistory(deliveryId, DeliveryStatus.ASSIGNED, dto.getAssignedBy());
        return DeliveryAssignmentDTO.from(saved);
    }

    public List<DeliveryStatusHistoryDTO> getStatusHistory(String deliveryId) {
        return historyRepository.findByDeliveryIdOrderByChangedAtAsc(deliveryId)
                .stream().map(DeliveryStatusHistoryDTO::from).collect(Collectors.toList());
    }

    public List<ReturnRequestDTO> getAllReturnRequests() {
        return returnRequestRepository.findAllByOrderByRequestedAtDesc()
                .stream().map(ReturnRequestDTO::from).collect(Collectors.toList());
    }

    public ReturnRequestDTO approveReturn(String returnId, String agentId, String adminId) {
        ReturnRequest rr = findReturnRequest(returnId);
        rr.setAgentId(agentId);
        rr.setStatus(agentId != null ? ReturnRequestStatus.PICKUP_SCHEDULED : ReturnRequestStatus.APPROVED);
        return ReturnRequestDTO.from(returnRequestRepository.save(rr));
    }

    public ReturnRequestDTO rejectReturn(String returnId) {
        ReturnRequest rr = findReturnRequest(returnId);
        rr.setStatus(ReturnRequestStatus.REJECTED);
        return ReturnRequestDTO.from(returnRequestRepository.save(rr));
    }

    // ── AGENT ─────────────────────────────────────────────────

    public List<DeliveryAssignmentDTO> getAgentAssignments(String agentId) {
        return assignmentRepository.findByAgentIdOrderByAssignedAtDesc(agentId)
                .stream().map(DeliveryAssignmentDTO::from).collect(Collectors.toList());
    }

    public DeliveryAssignmentDTO acceptAssignment(String assignmentId, String agentId) {
        DeliveryAssignment assignment = findAssignment(assignmentId);
        assignment.setStatus(AssignmentStatus.ACCEPTED);
        assignment.setRespondedAt(LocalDateTime.now());
        return DeliveryAssignmentDTO.from(assignmentRepository.save(assignment));
    }

    public DeliveryAssignmentDTO rejectAssignment(String assignmentId, String agentId, String reason) {
        DeliveryAssignment assignment = findAssignment(assignmentId);
        assignment.setStatus(AssignmentStatus.REJECTED);
        assignment.setRejectionReason(reason);
        assignment.setRespondedAt(LocalDateTime.now());
        assignmentRepository.save(assignment);

        Delivery delivery = findDelivery(assignment.getDeliveryId());
        delivery.setStatus(DeliveryStatus.PENDING);
        deliveryRepository.save(delivery);

        recordHistory(delivery.getId(), DeliveryStatus.PENDING, agentId);
        return DeliveryAssignmentDTO.from(assignment);
    }

    public DeliveryDTO pickupDelivery(String deliveryId, String agentId) {
        Delivery delivery = findDelivery(deliveryId);
        delivery.setStatus(DeliveryStatus.OUT_FOR_DELIVERY);
        delivery.setPickedUpAt(LocalDateTime.now());
        deliveryRepository.save(delivery);
        recordHistory(deliveryId, DeliveryStatus.OUT_FOR_DELIVERY, agentId);
        return DeliveryDTO.from(delivery);
    }

    public DeliveryDTO completeDelivery(String deliveryId, String agentId) {
        Delivery delivery = findDelivery(deliveryId);
        delivery.setStatus(DeliveryStatus.DELIVERED);
        delivery.setDeliveredAt(LocalDateTime.now());
        deliveryRepository.save(delivery);
        recordHistory(deliveryId, DeliveryStatus.DELIVERED, agentId);
        return DeliveryDTO.from(delivery);
    }

    public DeliveryDTO failDelivery(String deliveryId, FailureLogRequestDTO dto) {
        Delivery delivery = findDelivery(deliveryId);
        delivery.setStatus(DeliveryStatus.FAILED);
        deliveryRepository.save(delivery);

        int attemptNumber = failureLogRepository.countByDeliveryId(deliveryId) + 1;
        FailureLog log = new FailureLog();
        log.setDeliveryId(deliveryId);
        log.setLoggedBy(dto.getLoggedBy());
        log.setReasonCode(dto.getReasonCode());
        log.setDescription(dto.getDescription());
        log.setAttemptNumber(attemptNumber);
        failureLogRepository.save(log);

        recordHistory(deliveryId, DeliveryStatus.FAILED, dto.getLoggedBy());
        return DeliveryDTO.from(delivery);
    }

    public DeliveryDTO pickupReturn(String deliveryId, String agentId) {
        ReturnRequest rr = returnRequestRepository.findByDeliveryId(deliveryId)
                .stream()
                .filter(r -> r.getStatus() == ReturnRequestStatus.PICKUP_SCHEDULED)
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No scheduled return for this delivery"));
        rr.setStatus(ReturnRequestStatus.PICKED_UP);
        returnRequestRepository.save(rr);
        return DeliveryDTO.from(findDelivery(deliveryId));
    }

    public DeliveryDTO completeReturn(String deliveryId, String agentId) {
        ReturnRequest rr = returnRequestRepository.findByDeliveryId(deliveryId)
                .stream()
                .filter(r -> r.getStatus() == ReturnRequestStatus.PICKED_UP)
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No picked-up return for this delivery"));
        rr.setStatus(ReturnRequestStatus.COMPLETED);
        rr.setCompletedAt(LocalDateTime.now());
        returnRequestRepository.save(rr);

        Delivery delivery = findDelivery(deliveryId);
        delivery.setStatus(DeliveryStatus.RETURNED);
        deliveryRepository.save(delivery);
        recordHistory(deliveryId, DeliveryStatus.RETURNED, agentId);
        return DeliveryDTO.from(delivery);
    }

    // ── CUSTOMER ─────────────────────────────────────────────

    public List<DeliveryDTO> getCustomerDeliveries(String customerId) {
        return deliveryRepository.findByCustomerIdOrderByCreatedAtDesc(customerId)
                .stream().map(DeliveryDTO::from).collect(Collectors.toList());
    }

    public ReturnRequestDTO createReturnRequest(String deliveryId, ReturnRequestCreateDTO dto) {
        ReturnRequest rr = new ReturnRequest();
        rr.setDeliveryId(deliveryId);
        rr.setCustomerId(dto.getCustomerId());
        rr.setReasonCode(dto.getReasonCode());
        rr.setDescription(dto.getDescription());
        return ReturnRequestDTO.from(returnRequestRepository.save(rr));
    }

    public List<ReturnRequestDTO> getCustomerReturnRequests(String customerId) {
        return returnRequestRepository.findByCustomerIdOrderByRequestedAtDesc(customerId)
                .stream().map(ReturnRequestDTO::from).collect(Collectors.toList());
    }

    // ── HELPERS ───────────────────────────────────────────────

    private Delivery findDelivery(String id) {
        return deliveryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Delivery not found"));
    }

    private DeliveryAssignment findAssignment(String id) {
        return assignmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Assignment not found"));
    }

    private ReturnRequest findReturnRequest(String id) {
        return returnRequestRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Return request not found"));
    }

    private void recordHistory(String deliveryId, DeliveryStatus status, String changedBy) {
        DeliveryStatusHistory history = new DeliveryStatusHistory();
        history.setDeliveryId(deliveryId);
        history.setStatus(status);
        history.setChangedBy(changedBy);
        historyRepository.save(history);
    }
}
