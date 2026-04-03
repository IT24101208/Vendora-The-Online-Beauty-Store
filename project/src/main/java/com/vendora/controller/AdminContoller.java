package com.vendora.controller;

import com.vendora.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/stats")
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();


        Double totalRevenue = orderRepository.getTotalRevenue();
        double revenue = (totalRevenue != null) ? totalRevenue : 0.0;

        long totalOrders = orderRepository.count();

        long pendingOrders = orderRepository.countByStatus("Pending");

        Double averageValue = orderRepository.getAverageOrderValue();
        double avgValue = (averageValue != null) ? averageValue : 0.0;

        stats.put("totalRevenue", String.format("%.2f", revenue));
        stats.put("totalOrders", totalOrders);
        stats.put("pendingOrders", pendingOrders);
        stats.put("avgOrderValue", String.format("%.2f", avgValue));

        return stats;
    }
}