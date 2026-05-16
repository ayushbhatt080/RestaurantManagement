package com.edutech.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

// import com.edutech.exception.ResourceNotFoundException;
import com.edutech.model.MenuItem;
import com.edutech.model.Order;
import com.edutech.repository.OrderRepository;


@Service
public class OrderServiceImpl implements OrderService{

    @Autowired
    OrderRepository orderRepository;

    @Override
    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElseThrow(()->new RuntimeException("Order not found"));
    }

    @Override
    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Override
    public void cancelOrder(Long id) {
        
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        order.setStatus("CANCELLED");

        orderRepository.save(order);

    }
    @Override
    public Double calculateTotal(List<MenuItem> items) {
        if (items == null || items.isEmpty()) return 0.0;
        return items.stream().mapToDouble(MenuItem::getPrice).sum();
    }

    }
	
