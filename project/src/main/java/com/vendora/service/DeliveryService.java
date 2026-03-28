package com.vendora.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.vendora.dto.*;
import com.vendora.model.Delivery;
import com.vendora.model.DeliveryPerson;
import com.vendora.model.DeliveryStatus;
import com.vendora.repository.DeliveryPersonRepository;
import com.vendora.repository.DeliveryRepository;

@Service
@Transactional
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final DeliveryPersonRepository deliveryPersonRepository;
    private final PasswordEncoder passwordEncoder;

    public DeliveryService(DeliveryRepository deliveryRepository,
                           DeliveryPersonRepository deliveryPersonRepository,
                           PasswordEncoder passwordEncoder) {
        this.deliveryRepository = deliveryRepository;
        this.deliveryPersonRepository = deliveryPersonRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private Delivery resolveDelivery(Long id) {
        return deliveryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Delivery not found: " + id));
    }

    private DeliveryPerson resolveAgent(String email) {
        return deliveryPersonRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Agent not found: " + email));
    }

    private void requireStatus(Delivery delivery, DeliveryStatus... allowed) {
        for (DeliveryStatus s : allowed) {
            if (delivery.getStatus() == s) return;
        }
        throw new ResponseStatusException(HttpStatus.CONFLICT,
                "Action not allowed in current status: " + delivery.getStatus());
    }

    private void requireAgentOwnership(Delivery delivery, String agentEmail) {
        DeliveryPerson agent = resolveAgent(agentEmail);
        if (delivery.getAgent() == null
                || !delivery.getAgent().getId().equals(agent.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "This delivery is not assigned to you.");
        }
    }

    // ── Admin: agent management ───────────────────────────────────────────────

    public DeliveryPersonDTO createAgent(CreateDeliveryPersonDTO dto) {
        if (deliveryPersonRepository.existsByEmail(dto.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "An agent with this email already exists.");
        }

        DeliveryPerson agent = new DeliveryPerson();
        // Generate a unique user_code — prefix + short UUID segment
        agent.setUserCode("DP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        agent.setName(dto.getName());
        agent.setEmail(dto.getEmail());
        agent.setPassword(passwordEncoder.encode(dto.getPassword()));
        agent.setPhone(dto.getPhone());
        agent.setAddress(dto.getAddress());
        agent.setProvince(dto.getProvince());
        agent.setDistrict(dto.getDistrict());
        agent.setVehicleType(dto.getVehicleType());
        agent.setVehicleModel(dto.getVehicleModel());
        agent.setLicensePlate(dto.getLicensePlate());
        agent.setEmergencyContactName(dto.getEmergencyContactName());
        agent.setEmergencyContactPhone(dto.getEmergencyContactPhone());
        agent.setDrivingLicenseUrl(dto.getDrivingLicenseUrl());
        agent.setVehicleRegistrationUrl(dto.getVehicleRegistrationUrl());
        agent.setProfileImageUrl(dto.getProfileImageUrl());

        return DeliveryPersonDTO.from(deliveryPersonRepository.save(agent));
    }

    public List<DeliveryPersonDTO> getAllAgents() {
        return deliveryPersonRepository.findAll()
                .stream().map(DeliveryPersonDTO::from).collect(Collectors.toList());
    }

    public DeliveryPersonDTO getAgent(Long id) {
        return deliveryPersonRepository.findById(id)
                .map(DeliveryPersonDTO::from)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Agent not found: " + id));
    }

    // ── Admin: delivery management ────────────────────────────────────────────

    public List<DeliveryDTO> getAllDeliveries() {
        return deliveryRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(DeliveryDTO::from).collect(Collectors.toList());
    }

    public List<DeliveryDTO> getDeliveriesByStatus(DeliveryStatus status) {
        return deliveryRepository.findByStatusOrderByCreatedAtDesc(status)
                .stream().map(DeliveryDTO::from).collect(Collectors.toList());
    }

    public DeliveryDTO assignAgent(Long deliveryId, AssignAgentDTO dto) {
        Delivery delivery = resolveDelivery(deliveryId);
        requireStatus(delivery,
                DeliveryStatus.PENDING,
                DeliveryStatus.REJECTED,
                DeliveryStatus.FAILED);

        DeliveryPerson agent = deliveryPersonRepository.findById(dto.getAgentId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Agent not found: " + dto.getAgentId()));

        delivery.setAgent(agent);
        delivery.setStatus(DeliveryStatus.ASSIGNED);
        return DeliveryDTO.from(deliveryRepository.save(delivery));
    }

    // ── Customer ──────────────────────────────────────────────────────────────

    public List<DeliveryDTO> getMyDeliveries(Long customerId) {
        return deliveryRepository.findByCustomerIdOrderByCreatedAtDesc(customerId)
                .stream().map(DeliveryDTO::from).collect(Collectors.toList());
    }

    public DeliveryDTO requestReturn(Long deliveryId, Long customerId, AddNoteDTO dto) {
        Delivery delivery = resolveDelivery(deliveryId);

        if (!delivery.getCustomerId().equals(customerId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "You do not own this delivery.");
        }
        requireStatus(delivery, DeliveryStatus.DELIVERED);

        delivery.setStatus(DeliveryStatus.RETURN_REQUESTED);
        delivery.setFailureReason(dto.getNote());
        return DeliveryDTO.from(deliveryRepository.save(delivery));
    }

    // ── Delivery Agent ────────────────────────────────────────────────────────

    public List<DeliveryDTO> getMyAssignedDeliveries(String agentEmail) {
        DeliveryPerson agent = resolveAgent(agentEmail);
        return deliveryRepository.findByAgentOrderByUpdatedAtDesc(agent)
                .stream().map(DeliveryDTO::from).collect(Collectors.toList());
    }

    public DeliveryDTO accept(Long id, String agentEmail) {
        Delivery delivery = resolveDelivery(id);
        requireAgentOwnership(delivery, agentEmail);
        requireStatus(delivery, DeliveryStatus.ASSIGNED);
        delivery.setStatus(DeliveryStatus.ACCEPTED);
        return DeliveryDTO.from(deliveryRepository.save(delivery));
    }

    public DeliveryDTO reject(Long id, String agentEmail, AddNoteDTO dto) {
        Delivery delivery = resolveDelivery(id);
        requireAgentOwnership(delivery, agentEmail);
        requireStatus(delivery, DeliveryStatus.ASSIGNED);
        delivery.setStatus(DeliveryStatus.REJECTED);
        delivery.setFailureReason(dto.getNote());
        delivery.setAgent(null);    // unlink so admin can reassign
        return DeliveryDTO.from(deliveryRepository.save(delivery));
    }

    public DeliveryDTO pickup(Long id, String agentEmail) {
        Delivery delivery = resolveDelivery(id);
        requireAgentOwnership(delivery, agentEmail);
        requireStatus(delivery, DeliveryStatus.ACCEPTED);
        delivery.setStatus(DeliveryStatus.IN_TRANSIT);
        return DeliveryDTO.from(deliveryRepository.save(delivery));
    }

    public DeliveryDTO complete(Long id, String agentEmail) {
        Delivery delivery = resolveDelivery(id);
        requireAgentOwnership(delivery, agentEmail);
        requireStatus(delivery, DeliveryStatus.IN_TRANSIT);
        delivery.setStatus(DeliveryStatus.DELIVERED);
        return DeliveryDTO.from(deliveryRepository.save(delivery));
    }

    public DeliveryDTO fail(Long id, String agentEmail, AddNoteDTO dto) {
        Delivery delivery = resolveDelivery(id);
        requireAgentOwnership(delivery, agentEmail);
        requireStatus(delivery, DeliveryStatus.IN_TRANSIT);
        delivery.setStatus(DeliveryStatus.FAILED);
        delivery.setFailureReason(dto.getNote());
        return DeliveryDTO.from(deliveryRepository.save(delivery));
    }

    public DeliveryDTO pickupReturn(Long id, String agentEmail) {
        Delivery delivery = resolveDelivery(id);
        requireAgentOwnership(delivery, agentEmail);
        requireStatus(delivery, DeliveryStatus.RETURN_REQUESTED);
        delivery.setStatus(DeliveryStatus.RETURN_IN_TRANSIT);
        return DeliveryDTO.from(deliveryRepository.save(delivery));
    }

    public DeliveryDTO completeReturn(Long id, String agentEmail) {
        Delivery delivery = resolveDelivery(id);
        requireAgentOwnership(delivery, agentEmail);
        requireStatus(delivery, DeliveryStatus.RETURN_IN_TRANSIT);
        delivery.setStatus(DeliveryStatus.RETURNED);
        return DeliveryDTO.from(deliveryRepository.save(delivery));
    }
}
