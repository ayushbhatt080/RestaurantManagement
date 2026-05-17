package com.edutech.service;

import java.util.List;
import java.util.Optional;

import com.edutech.model.MenuItem;

public interface MenuItemService {
	public MenuItem addMenuItem(MenuItem item) ;
	public List<MenuItem> getMenuItems();
	public MenuItem getMenuItemById(Long id) ;
	public MenuItem updateMenuItem(Long id, MenuItem item);
	public void deleteMenuItem(Long id);
	List<MenuItem> getMenuItemsByRestaurant(Long restaurantId);
}
