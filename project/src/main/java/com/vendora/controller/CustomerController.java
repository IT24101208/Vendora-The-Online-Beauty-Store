package com.vendora.controller;

import com.vendora.dto.*;
import com.vendora.service.DeliveryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/customer")
@CrossOrigin(origins = "*")
public class CustomerController {

    private final DeliveryService deliveryService;

    public CustomerController(DeliveryService deliveryService) {
        this.deliveryService = deliveryService;
    }

    @GetMapping("/deliveries")
    public ResponseEntity<List<DeliveryDTO>> getMyDeliveries(@RequestParam Long customerId) {
        return ResponseEntity.ok(deliveryService.getCustomerDeliveries(customerId));
    }

    @GetMapping("/deliveries/{id}/history")
    public ResponseEntity<List<DeliveryStatusHistoryDTO>> getHistory(@PathVariable String id) {
        return ResponseEntity.ok(deliveryService.getStatusHistory(id));
    }

    @PostMapping("/deliveries/{id}/return-requests")
    public ResponseEntity<ReturnRequestDTO> requestReturn(
            @PathVariable String id,
            @RequestBody ReturnRequestCreateDTO dto) {
        return ResponseEntity.ok(deliveryService.createReturnRequest(id, dto));
    }

    @GetMapping("/return-requests")
    public ResponseEntity<List<ReturnRequestDTO>> getMyReturnRequests(@RequestParam Long customerId) {
        return ResponseEntity.ok(deliveryService.getCustomerReturnRequests(customerId));
    }
}
