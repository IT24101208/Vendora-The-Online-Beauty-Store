package com.vendora.model;

import jakarta.persistence.*;
import org.hibernate.annotations.DynamicUpdate;


// Persistence entity representing a customer Order in the Vendora system.
//Uses @DynamicUpdate to ensure only modified columns are included in SQL UPDATE statements,
//improving performance for large tables.

@Entity
@Table(name = "orders")
@DynamicUpdate
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Customer Information
    private String firstName;
    private String lastName;

    // Order Details
    private String product;
    private double amount;

    // Fulfillment status of the order (e.g., Pending, Shipped, Delivered, Cancelled).

    private String status;

    //Financial status of the order (e.g., PENDING, PAID, Refund Requested).
    private String paymentStatus;

    // The method used for the transaction (e.g., Credit Card, PayPal).

    private String paymentMethod;


    // Default constructor required by JPA/Hibernate.

    public Order() {}


    //Overloaded constructor for manual object creation.
    public Order(Long id, String firstName, String lastName, String product, double amount, String status, String paymentStatus, String paymentMethod) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.product = product;
        this.amount = amount;
        this.status = status;
        this.paymentStatus = paymentStatus;
        this.paymentMethod = paymentMethod;
    }

    // --- Getters and Setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getProduct() { return product; }
    public void setProduct(String product) { this.product = product; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
}