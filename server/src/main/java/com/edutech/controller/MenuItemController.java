package com.edutech.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutech.model.MenuItem;
import com.edutech.service.MenuItemService;

import java.util.List;

@RestController
@RequestMapping("/api/menuItems")
public class MenuItemController {

    @Autowired
    private MenuItemService service;
    
    @PostMapping
    public ResponseEntity<MenuItem> createMenuItem(@RequestBody MenuItem item) {
        MenuItem savedItem = service.addMenuItem(item);
        return new ResponseEntity<>(savedItem, HttpStatus.CREATED);
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
    public ResponseEntity<MenuItem> updateMenuItem(
            @PathVariable Long id,
            @RequestBody MenuItem item) {

        MenuItem updatedItem = service.updateMenuItem(id, item);
        return new ResponseEntity<>(updatedItem, HttpStatus.OK);
    }
    
  @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<MenuItem>> getMenuItemsByRestaurant(@PathVariable Long restaurantId) {
        List<MenuItem> items = service.getMenuItemsByRestaurant(restaurantId);
        return new ResponseEntity<>(items, HttpStatus.OK);
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMenuItem(@PathVariable Long id) {
        service.deleteMenuItem(id);
        return new ResponseEntity<>("Menu item deleted successfully", HttpStatus.OK);
    }
}

