package com.edutech.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.dto.RestaurantManagerAssignmentDTO;
// import com.edutech.exception.DuplicateAssignmentException;
// import com.edutech.exception.ResourceNotFoundException;
import com.edutech.model.Restaurant;
import com.edutech.model.RestaurantManagerAssignment;
import com.edutech.model.Role;
import com.edutech.model.User;
import com.edutech.repository.RestaurantManagerAssignmentRepository;
import com.edutech.repository.RestaurantRepository;
import com.edutech.repository.UserRepository;

@Service
public class RestaurantManagerAssignmentServiceImpl implements RestaurantManagerAssignmentService {

	@Autowired
	private RestaurantManagerAssignmentRepository assignmentRepository;

	@Autowired
	private RestaurantRepository restaurantRepository;

	@Autowired
	private UserRepository userRepository;

	@Override
	public RestaurantManagerAssignmentDTO assignManager(Long restaurantId, Long managerId) {
		if (assignmentRepository.existsByRestaurantId(restaurantId)) {
			throw new RuntimeException("Restaurant already has an assigned manager");
		}

		Restaurant restaurant = restaurantRepository.findById(restaurantId)
				.orElseThrow(() -> new RuntimeException("Restaurant not found: " + restaurantId));
		User user = userRepository.findById(managerId)
				.orElseThrow(() -> new RuntimeException("User not found: " + managerId));

		if (user.getRole() != Role.MANAGER) {
			throw new IllegalArgumentException("User is not a manager");
		}

		RestaurantManagerAssignment assignment = new RestaurantManagerAssignment();
		assignment.setRestaurant(restaurant);
		assignment.setUser(user);
		assignment.setAssignedAt(LocalDateTime.now());

		RestaurantManagerAssignment saved = assignmentRepository.save(assignment);
		return toDto(saved);
	}

	@Override
	public List<RestaurantManagerAssignmentDTO> getAllAssignments() {
		return assignmentRepository.findAll().stream()
				.map(this::toDto)
				.collect(Collectors.toList());
	}

	@Override
	public RestaurantManagerAssignmentDTO getAssignmentByRestaurantId(Long restaurantId) {
		RestaurantManagerAssignment assignment = assignmentRepository.findByRestaurantId(restaurantId)
				.orElseThrow(() -> new RuntimeException(
						"Assignment not found for restaurant: " + restaurantId));
		return toDto(assignment);
	}

	private RestaurantManagerAssignmentDTO toDto(RestaurantManagerAssignment assignment) {
		return new RestaurantManagerAssignmentDTO(
				assignment.getId(),
				assignment.getRestaurant().getName(),
				assignment.getRestaurant().getLocation(),
				assignment.getUser().getUsername(),
				assignment.getUser().getEmail(),
				assignment.getAssignedAt());
	}
}