package com.vendora.controller;

import com.vendora.dto.*;
import com.vendora.model.DeliveryStatus;
import com.vendora.service.DeliveryService;
import org.springframework.http.HttpStatus;
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

    // ── Agent management ──────────────────────────────────────────────────────

    @PostMapping("/agents")
    public ResponseEntity<DeliveryPersonDTO> createAgent(
            @RequestBody CreateDeliveryPersonDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(deliveryService.createAgent(dto));
    }

    @GetMapping("/agents")
    public ResponseEntity<List<DeliveryPersonDTO>> getAgents() {
        return ResponseEntity.ok(deliveryService.getAllAgents());
    }

    @GetMapping("/agents/{id}")
    public ResponseEntity<DeliveryPersonDTO> getAgent(@PathVariable Long id) {
        return ResponseEntity.ok(deliveryService.getAgent(id));
    }

    // ── Delivery management ───────────────────────────────────────────────────

    @GetMapping("/deliveries")
    public ResponseEntity<List<DeliveryDTO>> getAll() {
        return ResponseEntity.ok(deliveryService.getAllDeliveries());
    }

    @GetMapping("/deliveries/pending")
    public ResponseEntity<List<DeliveryDTO>> getPending() {
        return ResponseEntity.ok(deliveryService.getDeliveriesByStatus(DeliveryStatus.PENDING));
    }

    @GetMapping("/deliveries/status/{status}")
    public ResponseEntity<List<DeliveryDTO>> getByStatus(@PathVariable DeliveryStatus status) {
        return ResponseEntity.ok(deliveryService.getDeliveriesByStatus(status));
    }

    @PostMapping("/deliveries/{id}/assign")
    public ResponseEntity<DeliveryDTO> assign(
            @PathVariable Long id,
            @RequestBody AssignAgentDTO dto) {
        return ResponseEntity.ok(deliveryService.assignAgent(id, dto));
    }

    @PostMapping("/deliveries/{id}/reassign")
    public ResponseEntity<DeliveryDTO> reassign(
            @PathVariable Long id,
            @RequestBody AssignAgentDTO dto) {
        return ResponseEntity.ok(deliveryService.assignAgent(id, dto));
    }
}