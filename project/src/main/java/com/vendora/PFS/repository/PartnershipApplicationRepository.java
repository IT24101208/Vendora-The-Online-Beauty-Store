package com.vendora.pfs.repository;

import com.vendora.epic1.model.User;
import com.vendora.pfs.model.PartnershipApplication;
import com.vendora.pfs.model.enums.ApplicationStatus;
import com.vendora.pfs.model.enums.ApplicationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PartnershipApplicationRepository extends JpaRepository<PartnershipApplication, Long> {

    Optional<PartnershipApplication> findByIdAndUser(Long id, User user);

    List<PartnershipApplication> findByUser(User user);

    List<PartnershipApplication> findByApplicationType(ApplicationType applicationType);

    List<PartnershipApplication> findByStatus(ApplicationStatus status);

    List<PartnershipApplication> findByUserAndStatus(User user, ApplicationStatus status);

    boolean existsByUserAndApplicationType(User user, ApplicationType applicationType);
}
