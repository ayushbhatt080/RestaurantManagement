package com.edutech.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;

import com.fasterxml.jackson.annotation.JsonIgnore;

// import org.apache.tomcat.jni.Local;

import java.time.LocalDateTime;

@Entity
public class RestaurantManagerAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // private Long restaurantId;
    private Long managerId;
    private Long assignedBy;

    private LocalDateTime assignedAt;

    @PrePersist
    public void assignedTime(){
        this.assignedAt = LocalDateTime.now();
    }

    // Many assignments → One Restaurant
    @ManyToOne
    @JoinColumn(name = "restaurant_id", nullable = false)
    @JsonIgnore
    private Restaurant restaurant;

    // Many assignments → One User (manager)
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    public RestaurantManagerAssignment(Long id, Long managerId, Long assignedBy, LocalDateTime assignedAt,
            Restaurant restaurant, User user) {
        this.id = id;
        this.managerId = managerId;
        this.assignedBy = assignedBy;
        this.assignedAt = assignedAt;
        this.restaurant = restaurant;
        this.user = user;
    }

    public RestaurantManagerAssignment(Long managerId, Long assignedBy, LocalDateTime assignedAt, Restaurant restaurant,
            User user) {
        this.managerId = managerId;
        this.assignedBy = assignedBy;
        this.assignedAt = assignedAt;
        this.restaurant = restaurant;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getManagerId() {
        return managerId;
    }

    public void setManagerId(Long managerId) {
        this.managerId = managerId;
    }

    public Long getAssignedBy() {
        return assignedBy;
    }

    public void setAssignedBy(Long assignedBy) {
        this.assignedBy = assignedBy;
    }

    public LocalDateTime getAssignedAt() {
        return assignedAt;
    }

    public void setAssignedAt(LocalDateTime assignedAt) {
        this.assignedAt = assignedAt;
    }

    public Restaurant getRestaurant() {
        return restaurant;
    }

    public void setRestaurant(Restaurant restaurant) {
        this.restaurant = restaurant;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public RestaurantManagerAssignment() {
    }

    
}