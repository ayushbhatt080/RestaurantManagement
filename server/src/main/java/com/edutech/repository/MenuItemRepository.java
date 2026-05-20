package com.edutech.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.edutech.model.MenuItem;

public interface MenuItemRepository extends JpaRepository<MenuItem,Long> {

    List<MenuItem> findByRestaurantId(Long restaurantId);
	
	
 @Modifying
    @Query(
        value = "DELETE FROM order_items WHERE menu_item_id = ?1",
        nativeQuery = true
    )
    void deleteFromOrderItems(Long menuItemId);
    
@Modifying
@Query(
    value = "DELETE FROM menu_item WHERE restaurant_id = ?1",
    nativeQuery = true
)
void deleteMenuItemsByRestaurantId(Long restaurantId);

@Modifying @Query(
    value = "DELETE FROM order_items WHERE menu_item_id IN " +
            "(SELECT id FROM menu_item WHERE restaurant_id = ?1)",
    nativeQuery = true
)
void deleteOrderItemsByRestaurantId(Long restaurantId);

List<MenuItem> findByRestaurant_IdIn(List<Long> restaurantIds);

void deleteByRestaurant_Id(Long id);


    
}

