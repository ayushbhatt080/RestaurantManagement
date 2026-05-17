package com.edutech.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.exception.ResourceNotFoundException;
import com.edutech.model.Restaurant;
import com.edutech.repository.RestaurantRepository;

// import exception.ResourceNotFoundException;

@Service
public class RestaurantServiceImpl implements RestaurantService{
	@Autowired
	private RestaurantRepository restaurantRepository;

	@Override
	public Restaurant createRestaurant(Restaurant restaurant) {
		return restaurantRepository.save(restaurant);
	}

	@Override
	public List<Restaurant> getAllRestaurants() {
		return restaurantRepository.findAll();
	}
	@Override
	public Optional<Restaurant> getRestaurantById(Long id) {
		return restaurantRepository.findById(id);
	}

	@Override
	public Restaurant updateRestaurant(long id, Restaurant restaurant) {
		Restaurant r = restaurantRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Restaurant not found"));
		r.setAddress(restaurant.getAddress());
		r.setEmail(restaurant.getEmail());
		r.setLocation(restaurant.getLocation());
		r.setManager(restaurant.getManager());
		r.setName(restaurant.getName());
		r.setPhoneNumber(restaurant.getPhoneNumber());
		r.setCusine(restaurant.getCusine());

		return restaurantRepository.save(r);

	}

	@Override
	public void deleteRestaurant(long id) {
		restaurantRepository.deleteById(id);
	}
	
	
}
