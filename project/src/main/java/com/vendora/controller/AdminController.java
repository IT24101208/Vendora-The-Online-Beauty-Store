package com.vendora.controller;

import com.vendora.dto.*;
import com.vendora.model.DeliveryStatus;
import com.vendora.service.DeliveryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class AdminController {

    private final DeliveryService deliveryService;

    public AdminController(DeliveryService deliveryService) {
        this.deliveryService = deliveryService;
    }

    // ── Order integration ──────────────────────────────────────
    // Called by the Order module when payment is confirmed; auto-creates the delivery record.

    @PostMapping("/orders/payment-confirmed")
    public ResponseEntity<DeliveryDTO> createDeliveryFromOrder(@RequestBody OrderPaymentDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(deliveryService.createDeliveryFromOrder(dto));
    }

    // ── Admin delivery management ─────────────────────────────

    @PostMapping("/admin/deliveries")
    public ResponseEntity<DeliveryDTO> create(@RequestBody CreateDeliveryDTO dto) {
        return ResponseEntity.ok(deliveryService.createDelivery(dto));
    }

    @GetMapping("/admin/deliveries")
    public ResponseEntity<List<DeliveryDTO>> getAll() {
        return ResponseEntity.ok(deliveryService.getAllDeliveries());
    }

    @GetMapping("/admin/deliveries/{id}")
    public ResponseEntity<DeliveryDTO> getOne(@PathVariable String id) {
        return ResponseEntity.ok(deliveryService.getDelivery(id));
    }

    @GetMapping("/admin/deliveries/status/{status}")
    public ResponseEntity<List<DeliveryDTO>> getByStatus(@PathVariable DeliveryStatus status) {
        return ResponseEntity.ok(deliveryService.getDeliveriesByStatus(status));
    }

    /**
     * Assign an agent to a delivery.
     * The request body must include agentServiceDistrict so the service can
     * validate it matches the delivery's customerDistrict (sourced from the User module).
     */
    @PostMapping("/admin/deliveries/{id}/assign")
    public ResponseEntity<DeliveryAssignmentDTO> assign(
            @PathVariable String id,
            @RequestBody AssignAgentDTO dto) {
        return ResponseEntity.ok(deliveryService.assignAgent(id, dto));
    }

    @GetMapping("/admin/deliveries/{id}/history")
    public ResponseEntity<List<DeliveryStatusHistoryDTO>> getHistory(@PathVariable String id) {
        return ResponseEntity.ok(deliveryService.getStatusHistory(id));
    }

    // ── Agent lookup ──────────────────────────────────────────
    // Returns agent IDs sourced from assignment history in this module.

    @GetMapping("/admin/agents")
    public ResponseEntity<List<Long>> getAgents() {
        return ResponseEntity.ok(deliveryService.getAllAgentIds());
    }

    @GetMapping("/admin/agents/by-district/{district}")
    public ResponseEntity<List<Long>> getAgentsByDistrict(@PathVariable String district) {
        return ResponseEntity.ok(deliveryService.getAgentIdsByDistrict(district));
    }

    // ── Agent registration ────────────────────────────────────

    @PostMapping("/admin/agents/register")
    public ResponseEntity<AgentProfileDTO> registerAgent(@RequestBody RegisterAgentDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(deliveryService.registerAgent(dto));
    }

    @GetMapping("/admin/agents/profiles")
    public ResponseEntity<List<AgentProfileDTO>> getAllAgentProfiles() {
        return ResponseEntity.ok(deliveryService.getAllAgentProfiles());
    }

    @GetMapping("/admin/agents/profiles/district/{district}")
    public ResponseEntity<List<AgentProfileDTO>> getAgentProfilesByDistrict(@PathVariable String district) {
        return ResponseEntity.ok(deliveryService.getAgentProfilesByDistrict(district));
    }

    // ── Return requests ────────────────────────────────────────

    @GetMapping("/admin/return-requests")
    public ResponseEntity<List<ReturnRequestDTO>> getAllReturns() {
        return ResponseEntity.ok(deliveryService.getAllReturnRequests());
    }

    @PostMapping("/admin/return-requests/{id}/approve")
    public ResponseEntity<ReturnRequestDTO> approveReturn(
            @PathVariable String id,
            @RequestParam(required = false) Long agentId,
            @RequestParam Long adminId) {
        return ResponseEntity.ok(deliveryService.approveReturn(id, agentId, adminId));
    }

    @PostMapping("/admin/return-requests/{id}/reject")
    public ResponseEntity<ReturnRequestDTO> rejectReturn(@PathVariable String id) {
        return ResponseEntity.ok(deliveryService.rejectReturn(id));
    }
}
