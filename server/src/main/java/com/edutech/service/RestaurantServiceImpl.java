package com.edutech.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.exception.ResourceNotFoundException;
import com.edutech.model.MenuItem;
import com.edutech.model.Restaurant;
import com.edutech.model.RestaurantManagerAssignment;
import com.edutech.model.User;
import com.edutech.repository.MenuItemRepository;
import com.edutech.repository.OrderRepository;
import com.edutech.repository.RestaurantManagerAssignmentRepository;
import com.edutech.repository.RestaurantRepository;
import com.edutech.repository.UserRepository;

// import exception.ResourceNotFoundException;

@Service
public class RestaurantServiceImpl implements RestaurantService {
	@Autowired
	private RestaurantRepository restaurantRepository;
	@Autowired
	private MenuItemRepository menuItemRepository;
	@Autowired
	private OrderRepository orderRepository;
	@Autowired
	private RestaurantManagerAssignmentRepository assignmentRepository;

	@Autowired
	private UserRepository userRepository;

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
		Restaurant r = restaurantRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
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
	@Transactional
	public void deleteRestaurant(long id) {

		Restaurant restaurant = restaurantRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

		// ✅ STEP 1: get all menu items
		List<MenuItem> items = menuItemRepository.findByRestaurantId(id);

		// ✅ STEP 2: clear order_items
		for (MenuItem item : items) {
			menuItemRepository.deleteFromOrderItems(item.getId());
		}

		// ✅ STEP 3: ✅ FIXED LINE
		assignmentRepository.deleteByRestaurant_Id(id);

		// ✅ STEP 4
		orderRepository.deleteByRestaurant_Id(id);

		// ✅ STEP 5
		menuItemRepository.deleteByRestaurant_Id(id);

		// ✅ STEP 6
		restaurantRepository.delete(restaurant);
	}
@Override
	public List<Restaurant> getRestaurantsForManager(String username) {

		// user nikal username se (JWT se aaya hoga)
		User user = userRepository.findByUsername(username)
				.orElseThrow(() -> new RuntimeException("User not found"));

		// assignments nikal
		List<RestaurantManagerAssignment> assignments = assignmentRepository.findByUser_Id(user.getId());

		// restaurants extract kar
		return assignments.stream()
        .map(RestaurantManagerAssignment::getRestaurant)
        .collect(Collectors.toList());
	}

}
