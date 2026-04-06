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
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @PostMapping("/add")
    public Order addOrder(@RequestBody Order order) {
        if (order.getStatus() == null) order.setStatus("Pending");
        if (order.getPaymentStatus() == null) order.setPaymentStatus("PENDING");
        return orderRepository.save(order);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Long id) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isEmpty()) return ResponseEntity.notFound().build();

        Order order = orderOpt.get();
        if ("PAID".equalsIgnoreCase(order.getPaymentStatus())) {
            order.setStatus("Refund Requested");
            orderRepository.save(order);
            return ResponseEntity.ok("Refund Request Submitted.");
        }

        order.setStatus("Cancelled");
        orderRepository.save(order);
        return ResponseEntity.ok("Order Cancelled.");
    }


    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable Long id, @RequestBody String status) {
        return orderRepository.findById(id).map(order -> {

            String cleanStatus = status.replace("\"", "");
            order.setStatus(cleanStatus);
            return ResponseEntity.ok(orderRepository.save(order));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/pay-confirm")
    @Transactional
    public ResponseEntity<?> confirmPayment(@PathVariable Long id) {
        return orderRepository.findById(id).map(order -> {
            order.setPaymentStatus("PAID");
            orderRepository.save(order);
            List<Payment> payments = paymentRepository.findByOrderId(id);
            if (payments != null) {
                for (Payment p : payments) {
                    p.setStatus("PAID");
                    paymentRepository.save(p);
                }
            }
            return ResponseEntity.ok(order);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        return orderRepository.findById(id).map(order -> {
            orderRepository.delete(order);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getOrderStats() {
        Map<String, Object> stats = new HashMap<>();
        long totalOrders = orderRepository.count();
        long pendingOrders = orderRepository.countByStatus("Pending");
        Double revenue = orderRepository.getTotalRevenue();
        Double avgValue = orderRepository.getAverageOrderValue();

        stats.put("totalRevenue", revenue != null ? String.format("%.2f", revenue) : "0.00");
        stats.put("totalOrders", totalOrders);
        stats.put("pendingOrders", pendingOrders);
        stats.put("avgOrderValue", avgValue != null ? String.format("%.2f", avgValue) : "0.00");
        return ResponseEntity.ok(stats);
    }
}