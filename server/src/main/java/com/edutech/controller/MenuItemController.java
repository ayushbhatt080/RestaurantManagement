package com.edutech.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutech.model.MenuItem;
import com.edutech.repository.RestaurantRepository;
import com.edutech.service.MenuItemService;

import java.util.List;

@RestController
@RequestMapping("/api/menuItems")
public class MenuItemController {

    @Autowired
    private MenuItemService service;
    @Autowired
    private RestaurantRepository restaurantRepository;

    @PostMapping
public ResponseEntity<?> createMenuItem(@RequestBody MenuItem item) {
    try {
        if (item.getRestaurant() == null || item.getRestaurant().getId() == null) {
            throw new RuntimeException("Restaurant ID is required");
        }

        Long restaurantId = item.getRestaurant().getId();

        item.setRestaurant(
                restaurantRepository.findById(restaurantId)
                        .orElseThrow(() -> new RuntimeException(
                                "Restaurant not found with id: " + restaurantId
                        ))
        );

        MenuItem savedItem = service.addMenuItem(item);

        return new ResponseEntity<>(savedItem, HttpStatus.CREATED);

    } catch (Exception e) {
        e.printStackTrace();

        return new ResponseEntity<>(
                java.util.Map.of("error", "Save failed: " + e.getMessage()),
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}

    @GetMapping
    public ResponseEntity<List<MenuItem>> getAllMenuItems() {
        List<MenuItem> items = service.getMenuItems();
        return new ResponseEntity<>(items, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuItem> getMenuItemById(@PathVariable Long id) {
        MenuItem item = service.getMenuItemById(id);
        return new ResponseEntity<>(item, HttpStatus.OK);
    }

@PutMapping("/{id}")
public ResponseEntity<?> updateMenuItem(
        @PathVariable Long id,
        @RequestBody MenuItem item) {

    try {

        if (item.getRestaurant() != null && item.getRestaurant().getId() != null) {

            Long restaurantId = item.getRestaurant().getId();

            item.setRestaurant(
                    restaurantRepository.findById(restaurantId)
                            .orElseThrow(() -> new RuntimeException(
                                    "Restaurant not found with id: " + restaurantId
                            ))
            );
        }

        MenuItem updatedItem = service.updateMenuItem(id, item);

        return new ResponseEntity<>(updatedItem, HttpStatus.OK);

    } catch (Exception e) {
        e.printStackTrace();

        return new ResponseEntity<>(
                java.util.Map.of("error", "Update failed: " + e.getMessage()),
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<MenuItem>> getMenuItemsByRestaurant(@PathVariable Long restaurantId) {
        List<MenuItem> items = service.getMenuItemsByRestaurant(restaurantId);
        return new ResponseEntity<>(items, HttpStatus.OK);
    }

@DeleteMapping("/{id}")
public ResponseEntity<?> deleteMenuItem(@PathVariable Long id) {
    try {
        service.deleteMenuItem(id);

        return new ResponseEntity<>(
                java.util.Map.of("message", "Menu item deleted successfully"),
                HttpStatus.OK
        );

    } catch (Exception e) {
        e.printStackTrace();

        return new ResponseEntity<>(
                java.util.Map.of("error", "Delete failed: " + e.getMessage()),
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}
}
