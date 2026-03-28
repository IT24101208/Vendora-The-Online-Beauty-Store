package com.vendora.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;


import jakarta.persistence.*;
import lombok.Data;


@Data
@Entity
@Table(name = "Delivery")
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "delivery_id")
    private Long id;

    @Column(name = "delivery_code", nullable = false, unique = true, length = 50)
    private String deliveryCode;

    /**
     * The customer who owns this delivery.
     * References User(user_id) — we store only the FK, no full User entity
     * needed in this module.
     */
    @Column(name = "user_id", nullable = false)
    private Long customerId;

    /**
     * The assigned delivery agent.
     *
     * ── Required schema change ───────────────────────────────────────────────
     * The production Delivery table has no agent FK. Run migration
     * V1__add_delivery_person_id.sql to add this column before starting the app.
     * ────────────────────────────────────────────────────────────────────────
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "delivery_person_id")
    private DeliveryPerson agent;

    @Column(name = "address", columnDefinition = "TEXT", nullable = false)
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private DeliveryStatus status = DeliveryStatus.PENDING;

    @Column(name = "tracking_number", length = 100)
    private String trackingNumber;

    @Column(name = "province", length = 50)
    private String province;

    @Column(name = "district", length = 50)
    private String district;

    @Column(name = "delivery_date")
    private LocalDate deliveryDate;

    /**
     * General-purpose notes column (failure reason, rejection note, return reason).
     * Maps to the single `failure_reason` TEXT column in the production schema.
     */
    @Column(name = "failure_reason", columnDefinition = "TEXT")
    private String failureReason;

    @Column(name = "created_at", updatable = false,
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    @Column(name = "updated_at",
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    private LocalDateTime updatedAt;

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
