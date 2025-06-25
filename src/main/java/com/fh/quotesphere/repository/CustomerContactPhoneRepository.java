package com.fh.quotesphere.repository;

import com.fh.quotesphere.entity.CustomerContactPhone;
import com.fh.quotesphere.entity.CustomerContactPhoneId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CustomerContactPhoneRepository extends JpaRepository<CustomerContactPhone, CustomerContactPhoneId> {
    List<CustomerContactPhone> findById_CustomerContactIDIn(List<UUID> customerContactIDs);
} 