package com.vendora.controller;

import com.vendora.model.Order;
import com.vendora.model.Payment;
import com.vendora.repository.OrderRepository;
import com.vendora.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;


// REST Controller for managing customer orders and payment state transitions.

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*") // Note: Consider narrowing this for production security
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PaymentRepository paymentRepository;


    // Retrieves all orders currently in the system.

    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }


    //Creates a new order.
    // Defaults status to 'Pending' and paymentStatus to 'PENDING' if not provided.

    @PostMapping("/add")
    public Order addOrder(@RequestBody Order order) {
        if (order.getStatus() == null) {
            order.setStatus("Pending");
        }
        if (order.getPaymentStatus() == null) {
            order.setPaymentStatus("PENDING");
        }
        return orderRepository.save(order);
    }


    //Cancels an order based on its current state.
    // If PAID: Initiates a refund request.
    // If Shipped/Delivered: Prevents cancellation.
    // Otherwise: Marks the order as Cancelled.

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Long id) {
        Optional<Order> orderOpt = orderRepository.findById(id);

        if (orderOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Order order = orderOpt.get();

        // Handle refund logic for prepaid orders
        if ("PAID".equalsIgnoreCase(order.getPaymentStatus())) {
            order.setStatus("Refund Requested");
            orderRepository.save(order);
            return ResponseEntity.ok("Refund Request Submitted. Admin will process your refund soon.");
        }

        // Prevent cancellation of items already in transit
        if ("Shipped".equalsIgnoreCase(order.getStatus()) || "Delivered".equalsIgnoreCase(order.getStatus())) {
            return ResponseEntity.badRequest().body("Cannot cancel order as it is already shipped/delivered.");
        }

        order.setStatus("Cancelled");
        orderRepository.save(order);
        return ResponseEntity.ok("Order Cancelled Successfully.");
    }


    // Updates the fulfillment status (e.g., Shipped, Delivered) of a specific order.

    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable Long id, @RequestBody String status) {
        return orderRepository.findById(id).map(order -> {
            // Remove extra quotes if status is passed as a raw JSON string
            String cleanStatus = status.replace("\"", "");
            order.setStatus(cleanStatus);
            return ResponseEntity.ok(orderRepository.save(order));
        }).orElse(ResponseEntity.notFound().build());
    }


    //Confirms payment for an order.
    // Synchronizes the 'PAID' status across the Order and all associated Payment records.

    @PutMapping("/{id}/pay-confirm")
    @Transactional
    public ResponseEntity<?> confirmPayment(@PathVariable Long id) {
        return orderRepository.findById(id).map(order -> {
            order.setPaymentStatus("PAID");
            orderRepository.save(order);

            // Cascade the payment status to all linked payment transactions
            List<Payment> payments = paymentRepository.findByOrderId(id);
            if (payments != null && !payments.isEmpty()) {
                for (Payment payment : payments) {
                    payment.setStatus("PAID");
                    paymentRepository.save(payment);
                }
            }
            return ResponseEntity.ok(order);
        }).orElse(ResponseEntity.notFound().build());
    }


    // Hard deletes an order from the database.

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        return orderRepository.findById(id).map(order -> {
            orderRepository.delete(order);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}