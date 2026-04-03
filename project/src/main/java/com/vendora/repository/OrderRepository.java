package com.vendora.repository;


import com.vendora.Model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    long count();


    long countByStatus(String status);

    @Query("SELECT SUM(o.amount) FROM Order o WHERE o.paymentStatus = 'PAID'")
    Double getTotalRevenue();

    @Query("SELECT AVG(o.amount) FROM Order o WHERE o.paymentStatus = 'PAID'")
    Double getAverageOrderValue();


}