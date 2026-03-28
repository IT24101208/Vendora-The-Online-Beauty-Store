package com.vendora.controller;


import com.vendora.dto.AddNoteDTO;
import com.vendora.dto.DeliveryDTO;
import com.vendora.service.DeliveryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "*")
public class UserController {

    private final DeliveryService deliveryService;

    public UserController(DeliveryService deliveryService) {
        this.deliveryService = deliveryService;
    }

    /**
     * customerId comes from the JWT — the main Vendora auth module embeds
     * the user_id as a request attribute after token validation. We accept
     * it as a @RequestAttribute here to avoid re-querying the User table
     * in this module.
     *
     * If your JWT filter sets it differently (e.g. a custom header or
     * SecurityContext detail), adjust the attribute name to match.
     */
    @GetMapping("/deliveries")
    public ResponseEntity<List<DeliveryDTO>> getMyDeliveries(
            @RequestAttribute("userId") Long customerId) {
        return ResponseEntity.ok(deliveryService.getMyDeliveries(customerId));
    }

    @PostMapping("/deliveries/{id}/return")
    public ResponseEntity<DeliveryDTO> requestReturn(
            @PathVariable Long id,
            @RequestAttribute("userId") Long customerId,
            @RequestBody AddNoteDTO dto) {
        return ResponseEntity.ok(deliveryService.requestReturn(id, customerId, dto));
    }
}
