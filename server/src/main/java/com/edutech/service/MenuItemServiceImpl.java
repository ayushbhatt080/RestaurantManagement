package com.edutech.service;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.exception.ResourceNotFoundException;
import com.edutech.model.MenuItem;
import com.edutech.repository.MenuItemRepository;

@Service
public class MenuItemServiceImpl implements MenuItemService {

    @Autowired
    private MenuItemRepository repository;

    @Override
    public MenuItem addMenuItem(MenuItem item) {
        return repository.save(item);
    }

    @Override
    public List<MenuItem> getMenuItems() {
        return repository.findAll();
    }

    @Override
    public MenuItem getMenuItemById(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("MenuItem not found with id: " + id));
    }

    @Override
    public MenuItem updateMenuItem(Long id, MenuItem item) {
        MenuItem existingItem = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("MenuItem not found with id: " + id));
        existingItem.setMenuType(item.getMenuType());
        existingItem.setName(item.getName());
        existingItem.setPrice(item.getPrice());
        existingItem.setQuantity(item.getQuantity());

        return repository.save(existingItem);
    }

   @Override
@Transactional
public void deleteMenuItem(Long id) {

    MenuItem existingItem = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("MenuItem not found with id: " + id));

    // ✅ First delete menu item references from order_items
    repository.deleteFromOrderItems(id);

    // ✅ Then delete feedback linked to this menu item
    // repository.deleteFromFeedback(id);

    // ✅ Finally delete the menu item itself
    repository.delete(existingItem);
}
   
@Override
public List<MenuItem> getMenuItemsByRestaurant(Long restaurantId) {
    return repository.findByRestaurantId(restaurantId);
}

}

