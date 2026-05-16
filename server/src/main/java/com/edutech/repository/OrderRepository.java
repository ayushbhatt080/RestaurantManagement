package com.edutech.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.edutech.model.Order;


public interface OrderRepository extends JpaRepository<Order,Long> {
     
 List<Order> findByUserId(Long userId);

}