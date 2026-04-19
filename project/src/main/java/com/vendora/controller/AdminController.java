package com.vendora.controller;

import com.vendora.dto.*;
import com.vendora.model.DeliveryStatus;
import com.vendora.service.DeliveryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final DeliveryService deliveryService;

    public AdminController(DeliveryService deliveryService) {
        this.deliveryService = deliveryService;
    }

    @PostMapping("/deliveries")
    public ResponseEntity<DeliveryDTO> create(@RequestBody CreateDeliveryDTO dto) {
        return ResponseEntity.ok(deliveryService.createDelivery(dto));
    }

    @GetMapping("/deliveries")
    public ResponseEntity<List<DeliveryDTO>> getAll() {
        return ResponseEntity.ok(deliveryService.getAllDeliveries());
    }

    @GetMapping("/deliveries/{id}")
    public ResponseEntity<DeliveryDTO> getOne(@PathVariable String id) {
        return ResponseEntity.ok(deliveryService.getDelivery(id));
    }

    @GetMapping("/deliveries/status/{status}")
    public ResponseEntity<List<DeliveryDTO>> getByStatus(@PathVariable DeliveryStatus status) {
        return ResponseEntity.ok(deliveryService.getDeliveriesByStatus(status));
    }

    @PostMapping("/deliveries/{id}/assign")
    public ResponseEntity<DeliveryAssignmentDTO> assign(
            @PathVariable String id,
            @RequestBody AssignAgentDTO dto) {
        return ResponseEntity.ok(deliveryService.assignAgent(id, dto));
    }

    @GetMapping("/deliveries/{id}/history")
    public ResponseEntity<List<DeliveryStatusHistoryDTO>> getHistory(@PathVariable String id) {
        return ResponseEntity.ok(deliveryService.getStatusHistory(id));
    }

    @GetMapping("/return-requests")
    public ResponseEntity<List<ReturnRequestDTO>> getAllReturns() {
        return ResponseEntity.ok(deliveryService.getAllReturnRequests());
    }

    @PostMapping("/return-requests/{id}/approve")
    public ResponseEntity<ReturnRequestDTO> approveReturn(
            @PathVariable String id,
            @RequestParam(required = false) String agentId,
            @RequestParam String adminId) {
        return ResponseEntity.ok(deliveryService.approveReturn(id, agentId, adminId));
    }

    @PostMapping("/return-requests/{id}/reject")
    public ResponseEntity<ReturnRequestDTO> rejectReturn(@PathVariable String id) {
        return ResponseEntity.ok(deliveryService.rejectReturn(id));
    }
}
