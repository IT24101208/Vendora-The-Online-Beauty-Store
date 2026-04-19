package com.vendora.controller;

import com.vendora.dto.*;
import com.vendora.service.DeliveryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/deliveryagent")
@CrossOrigin(origins = "*")
public class DeliveryAgentController {

    private final DeliveryService deliveryService;

    public DeliveryAgentController(DeliveryService deliveryService) {
        this.deliveryService = deliveryService;
    }

    @GetMapping("/assignments")
    public ResponseEntity<List<DeliveryAssignmentDTO>> getAssignments(@RequestParam String agentId) {
        return ResponseEntity.ok(deliveryService.getAgentAssignments(agentId));
    }

    @PostMapping("/assignments/{id}/accept")
    public ResponseEntity<DeliveryAssignmentDTO> accept(
            @PathVariable String id,
            @RequestParam String agentId) {
        return ResponseEntity.ok(deliveryService.acceptAssignment(id, agentId));
    }

    @PostMapping("/assignments/{id}/reject")
    public ResponseEntity<DeliveryAssignmentDTO> reject(
            @PathVariable String id,
            @RequestParam String agentId,
            @RequestParam String reason) {
        return ResponseEntity.ok(deliveryService.rejectAssignment(id, agentId, reason));
    }

    @PostMapping("/deliveries/{id}/pickup")
    public ResponseEntity<DeliveryDTO> pickup(
            @PathVariable String id,
            @RequestParam String agentId) {
        return ResponseEntity.ok(deliveryService.pickupDelivery(id, agentId));
    }

    @PostMapping("/deliveries/{id}/complete")
    public ResponseEntity<DeliveryDTO> complete(
            @PathVariable String id,
            @RequestParam String agentId) {
        return ResponseEntity.ok(deliveryService.completeDelivery(id, agentId));
    }

    @PostMapping("/deliveries/{id}/fail")
    public ResponseEntity<DeliveryDTO> fail(
            @PathVariable String id,
            @RequestBody FailureLogRequestDTO dto) {
        return ResponseEntity.ok(deliveryService.failDelivery(id, dto));
    }

    @PostMapping("/deliveries/{id}/pickup-return")
    public ResponseEntity<DeliveryDTO> pickupReturn(
            @PathVariable String id,
            @RequestParam String agentId) {
        return ResponseEntity.ok(deliveryService.pickupReturn(id, agentId));
    }

    @PostMapping("/deliveries/{id}/complete-return")
    public ResponseEntity<DeliveryDTO> completeReturn(
            @PathVariable String id,
            @RequestParam String agentId) {
        return ResponseEntity.ok(deliveryService.completeReturn(id, agentId));
    }
}
