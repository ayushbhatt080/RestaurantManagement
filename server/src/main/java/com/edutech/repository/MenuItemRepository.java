package com.edutech.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.edutech.model.MenuItem;

public interface MenuItemRepository extends JpaRepository<MenuItem,Long> {

    List<MenuItem> findByRestaurantId(Long restaurantId);
	
	//eee
 @Modifying
    @Query(
        value = "DELETE FROM order_items WHERE menu_item_id = ?1",
        nativeQuery = true
    )
    void deleteFromOrderItems(Long menuItemId);

    
}

