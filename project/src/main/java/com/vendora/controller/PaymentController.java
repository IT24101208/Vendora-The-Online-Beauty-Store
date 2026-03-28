package com.vendora.controller;

import com.vendora.model.Payment;
import com.vendora.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


// REST Controller for handling payment transactions and history.

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;


    //Records a new payment transaction.
    //Generates a unique transaction ID if one is not provided in the request.
    // @param payment The payment details from the request body
    //@return The saved Payment entity

    @PostMapping("/process")
    public Payment processPayment(@RequestBody Payment payment) {
        // Fallback for missing Transaction IDs to ensure data integrity
        if (payment.getTransactionId() == null || payment.getTransactionId().isEmpty()) {
            payment.setTransactionId("TXN-" + System.currentTimeMillis());
        }
        return paymentRepository.save(payment);
    }


    // Retrieves the complete history of all payments.

    @GetMapping("/history")
    public List<Payment> getPaymentHistory() {
        return paymentRepository.findAll();
    }


    //Alternative endpoint to retrieve all payments.
    // Note: This currently serves the same data as /history.

    @GetMapping("/all")
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }
}