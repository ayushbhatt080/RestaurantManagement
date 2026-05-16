package com.edutech.service;

import java.util.List;

import com.edutech.dto.RestaurantManagerAssignmentDTO;
import com.edutech.model.RestaurantManagerAssignment;

public interface RestaurantManagerAssignmentService {

	RestaurantManagerAssignmentDTO assignManager(Long restaurantId, Long managerId);

	List<RestaurantManagerAssignmentDTO> getAllAssignments();

	RestaurantManagerAssignmentDTO getAssignmentByRestaurantId(Long restaurantId);

}