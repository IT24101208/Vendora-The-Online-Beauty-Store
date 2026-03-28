package com.vendora.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

import com.vendora.model.DeliveryPerson;


public interface DeliveryPersonRepository extends JpaRepository<DeliveryPerson, Long> {

    boolean existsByEmail(String email);

    Optional<DeliveryPerson> findByEmail(String email);
}
