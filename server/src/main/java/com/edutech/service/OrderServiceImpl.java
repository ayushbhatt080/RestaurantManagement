package com.edutech.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.dto.OrderRequest;
import com.edutech.model.MenuItem;
import com.edutech.model.Order;
import com.edutech.model.Restaurant;
import com.edutech.model.User;
import com.edutech.repository.MenuItemRepository;
import com.edutech.repository.OrderRepository;
import com.edutech.repository.RestaurantRepository;
import com.edutech.repository.UserRepository;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Override
    public Order createOrder(OrderRequest request) {

        if (request.getCustomerName() == null || request.getCustomerName().trim().isEmpty()) {
            throw new RuntimeException("Customer name is required");
        }

        if (request.getRestaurantId() == null) {
            throw new RuntimeException("Restaurant id is required");
        }

        if (request.getUserId() == null) {
            throw new RuntimeException("User id is required");
        }

        if (request.getItemIds() == null || request.getItemIds().isEmpty()) {
            throw new RuntimeException("At least one menu item is required");
        }

        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                .orElseThrow(() -> new RuntimeException(
                        "Restaurant not found with id: " + request.getRestaurantId()
                ));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException(
                        "User not found with id: " + request.getUserId()
                ));

        List<MenuItem> items = menuItemRepository.findAllById(request.getItemIds());

        if (items == null || items.isEmpty()) {
            throw new RuntimeException("No menu items found");
        }

        Double totalAmount = calculateTotal(items);

        Order order = new Order();

        order.setCustomerName(request.getCustomerName());
        order.setRestaurant(restaurant);
        order.setUser(user);
        order.setItems(items);
        order.setTotalAmount(totalAmount);
        order.setStatus("PLACED");

        return orderRepository.save(order);
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Order not found with id: " + id
                ));
    }

    @Override
    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Override
    public void cancelOrder(Long id) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Order not found with id: " + id
                ));

        if ("DELIVERED".equalsIgnoreCase(order.getStatus())) {
            throw new RuntimeException("Delivered order cannot be cancelled");
        }

        order.setStatus("CANCELLED");

        orderRepository.save(order);
    }

    @Override
    public Double calculateTotal(List<MenuItem> items) {
        if (items == null || items.isEmpty()) {
            return 0.0;
        }

        return items.stream()
                .mapToDouble(item -> item.getPrice() == null ? 0.0 : item.getPrice())
                .sum();
    }

    @Override
    public void updateOrderStatus(Long id, String status) {

        if (status == null || status.trim().isEmpty()) {
            throw new RuntimeException("Status is required");
        }

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Order not found with id: " + id
                ));

        String updatedStatus = status.trim().toUpperCase();

        if (!updatedStatus.equals("PLACED")
                && !updatedStatus.equals("PROCESSING")
                && !updatedStatus.equals("DELIVERED")
                && !updatedStatus.equals("CANCELLED")) {
            throw new RuntimeException("Invalid order status: " + status);
        }

        order.setStatus(updatedStatus);

        orderRepository.save(order);
    }
}
