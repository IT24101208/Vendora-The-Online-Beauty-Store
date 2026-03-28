package com.vendora.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Persistence entity representing a financial transaction linked to an Order.
 * This class tracks the flow of funds and payment verification.
 */
@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;


    // Foreign key reference to the Order table.

    @Column(name = "order_id")
    private Long orderId;


    // Current state of this specific transaction (e.g., PENDING, PAID, FAILED).

    @Column(name = "status")
    private String status;


    // The payment channel used (e.g., "Online" or "COD").

    private String paymentMethod;

    private Double amount;


    // Timestamp of when the payment record was initialized.
    //Defaults to the current system time.

    private LocalDateTime paymentDate = LocalDateTime.now();


    // Unique identifier provided by the payment gateway or generated internally.

    private String transactionId;


    // Default constructor required for JPA entity instantiation.

    public Payment() {}

    // --- Getters and Setters ---

    public Long getPaymentId() { return paymentId; }
    public void setPaymentId(Long paymentId) { this.paymentId = paymentId; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public LocalDateTime getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDateTime paymentDate) { this.paymentDate = paymentDate; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
}