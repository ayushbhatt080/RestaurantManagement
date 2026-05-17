// 
package com.edutech.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutech.dto.AssignManagerRequest;
import com.edutech.dto.RestaurantManagerAssignmentDTO;
import com.edutech.service.RestaurantManagerAssignmentService;

@RestController
@RequestMapping("/api/restaurants/assignmanager")
public class RestaurantManagerAssignmentController {

    @Autowired
    private RestaurantManagerAssignmentService assignmentService;

    @PostMapping
    public ResponseEntity<RestaurantManagerAssignmentDTO> assignManager(
            @RequestBody AssignManagerRequest request) {

        RestaurantManagerAssignmentDTO dto = assignmentService.assignManager(
                request.getRestaurantId(),
                request.getManagerId()
        );

        return ResponseEntity.status(201).body(dto);
    }

    @GetMapping
    public ResponseEntity<List<RestaurantManagerAssignmentDTO>> getAllAssignments() {
        return ResponseEntity.ok(assignmentService.getAllAssignments());
    }

    @GetMapping("/{restaurantId}")
    public ResponseEntity<RestaurantManagerAssignmentDTO> getAssignmentByRestaurantId(
            @PathVariable Long restaurantId) {

        return ResponseEntity.ok(
                assignmentService.getAssignmentByRestaurantId(restaurantId)
        );
    }
}