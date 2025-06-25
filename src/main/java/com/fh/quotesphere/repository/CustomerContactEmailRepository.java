package com.fh.quotesphere.repository;

import com.fh.quotesphere.entity.CustomerContactEmail;
import com.fh.quotesphere.entity.CustomerContactEmailId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CustomerContactEmailRepository extends JpaRepository<CustomerContactEmail, CustomerContactEmailId> {
    List<CustomerContactEmail> findById_CustomerContactIDIn(List<UUID> customerContactIDs);
} 