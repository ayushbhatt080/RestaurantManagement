package com.edutech.service;

import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.exception.ResourceNotFoundException;
import com.edutech.model.Restaurant;
import com.edutech.repository.MenuItemRepository;
import com.edutech.repository.OrderRepository;
import com.edutech.repository.RestaurantRepository;

// import exception.ResourceNotFoundException;

@Service
public class RestaurantServiceImpl implements RestaurantService {
	@Autowired
	private RestaurantRepository restaurantRepository;
	@Autowired
	private MenuItemRepository menuItemRepository;
	@Autowired
	private OrderRepository orderRepository;

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

	// @Override
	// public void deleteRestaurant(long id) {
	// restaurantRepository.deleteById(id);
	// }
	@Override
@Transactional
public void deleteRestaurant(long id) {

    Restaurant restaurant = restaurantRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

    // ✅ Step 1: delete order_items
    menuItemRepository.deleteOrderItemsByRestaurantId(id);

    // ✅ Step 2: delete feedback (if any)
    // menuItemRepository.deleteFeedbackByRestaurantId(id);

    // ✅ Step 3: delete orders (CRITICAL FIX 🚨)
    orderRepository.deleteOrdersByRestaurantId(id);

    // ✅ Step 4: delete menu items
    menuItemRepository.deleteMenuItemsByRestaurantId(id);

    // ✅ Step 5: delete restaurant
    restaurantRepository.delete(restaurant);
}

}
