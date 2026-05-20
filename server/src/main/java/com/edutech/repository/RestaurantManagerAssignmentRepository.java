package com.edutech.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.edutech.model.RestaurantManagerAssignment;

@Repository
public interface RestaurantManagerAssignmentRepository extends JpaRepository<RestaurantManagerAssignment, Long> {

	boolean existsByRestaurantId(Long restaurantId);

	Optional<RestaurantManagerAssignment> findByRestaurantId(Long restaurantId);

	Optional<RestaurantManagerAssignment> findByManagerId(Long managerId);

	List<RestaurantManagerAssignment> findByUser_Id(Long userId);
	
	void deleteByRestaurant_Id(Long id);

}