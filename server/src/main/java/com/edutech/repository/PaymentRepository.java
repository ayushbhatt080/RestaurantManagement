package com.edutech.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.edutech.model.Payment;

public interface PaymentRepository extends JpaRepository<Payment,Long>{

    
} 
