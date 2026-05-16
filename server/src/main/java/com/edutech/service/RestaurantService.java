package com.edutech.service;

import java.util.List;
import java.util.Optional;

import com.edutech.model.Restaurant;

public interface RestaurantService{

    public Restaurant createRestaurant(Restaurant restaurant);
    public List<Restaurant> getAllRestaurants();
    public Optional<Restaurant> getRestaurantById(Long id);
    public Restaurant updateRestaurant(long id, Restaurant restaurant);
    public void deleteRestaurant(long id);
	
}
