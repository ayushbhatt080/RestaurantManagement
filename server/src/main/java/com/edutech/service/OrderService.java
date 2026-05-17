package com.edutech.service;

import java.util.List;
import java.util.Optional;

import com.edutech.dto.OrderRequest;
import com.edutech.model.MenuItem;
import com.edutech.model.Order;

public interface OrderService {
	public Order createOrder(OrderRequest order);
	public List<Order> getAllOrders();
	public Order getOrderById(Long id);
	public List<Order> getOrdersByUser(Long userId);
	public void cancelOrder(Long id);
	public Double calculateTotal(List<MenuItem> items);
	public void updateOrderStatus(Long id, String status);

}