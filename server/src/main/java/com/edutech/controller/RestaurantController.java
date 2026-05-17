package com.edutech.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutech.model.Restaurant;
import com.edutech.service.RestaurantService;
import com.edutech.service.UserService;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

   @Autowired
   private RestaurantService restaurantService;

   private UserService userService;

   public RestaurantController(UserService userService) {
      this.userService = userService;
   }

   @PostMapping
   public ResponseEntity<Restaurant> createRestaurant(@RequestBody Restaurant restaurant) {
      return new ResponseEntity<>(restaurantService.createRestaurant(restaurant), HttpStatus.CREATED);
   }

   @GetMapping
   public ResponseEntity<List<Restaurant>> getAllRestaurants() {
      return new ResponseEntity<>(restaurantService.getAllRestaurants(), HttpStatus.OK);
   }

   // ✅ Keep this before /{id}
   @GetMapping("/users")
   public ResponseEntity<?> getUsers() {
      return new ResponseEntity<>(userService.getUserRolesDetails(), HttpStatus.OK);
   }

   // ✅ Only numeric ids allowed now
   @GetMapping("/{id:\\d+}")
   public ResponseEntity<Optional<Restaurant>> getRestaurantById(@PathVariable Long id) {
      return new ResponseEntity<>(restaurantService.getRestaurantById(id), HttpStatus.OK);
   }

   @PutMapping("/{id}")
   public ResponseEntity<Restaurant> updateRestaurant(@PathVariable long id, @RequestBody Restaurant restaurant) {
      return new ResponseEntity<>(restaurantService.updateRestaurant(id, restaurant), HttpStatus.OK);
   }

   @DeleteMapping("/{id}")
   public ResponseEntity<?> deleteRestaurant(@PathVariable long id) {
      restaurantService.deleteRestaurant(id);
      return new ResponseEntity<>(HttpStatus.OK);
   }
}
