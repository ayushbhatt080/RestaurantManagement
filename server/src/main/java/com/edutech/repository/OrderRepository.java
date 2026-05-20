package com.edutech.repository;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.edutech.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserId(Long userId);

  
    @Modifying
    @Query(value = "DELETE FROM orders WHERE restaurant_id = ?1", nativeQuery = true)
    void deleteOrdersByRestaurantId(Long restaurantId);
    List<Order> findByRestaurant_IdIn(List<Long> restaurantIds);
    void deleteByRestaurant_Id(Long id);
    

}