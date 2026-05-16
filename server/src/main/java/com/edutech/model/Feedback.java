package com.edutech.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
public class Feedback {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String customerName;

  private String comment;

  @Max(value = 5)
  @Min(value = 1)
  private int rating;

  // ✅ Admin reply / response field
  @Column(length = 1000)
  private String response;

  @ManyToOne
  @JoinColumn(name = "menu_item_id")
  @JsonBackReference
  private MenuItem menuItem;

  @ManyToOne
  @JoinColumn(name = "restaurant_id")
  private Restaurant restaurant;

  public Feedback() {
  }

  public Feedback(Long id, String customerName, String comment, int rating, MenuItem menuItem, Restaurant restaurant) {
    this.id = id;
    this.customerName = customerName;
    this.comment = comment;
    this.rating = rating;
    this.menuItem = menuItem;
    this.restaurant = restaurant;
  }

  public Feedback(String customerName, String comment, int rating, MenuItem menuItem, Restaurant restaurant) {
    this.customerName = customerName;
    this.comment = comment;
    this.rating = rating;
    this.menuItem = menuItem;
    this.restaurant = restaurant;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getCustomerName() {
    return customerName;
  }

  public void setCustomerName(String customerName) {
    this.customerName = customerName;
  }

  public String getComment() {
    return comment;
  }

  public void setComment(String comment) {
    this.comment = comment;
  }

  public int getRating() {
    return rating;
  }

  public void setRating(int rating) {
    this.rating = rating;
  }

  // ✅ Getter for admin response
  public String getResponse() {
    return response;
  }

  // ✅ Setter for admin response
  public void setResponse(String response) {
    this.response = response;
  }

  public MenuItem getMenuItem() {
    return menuItem;
  }

  public void setMenuItem(MenuItem menuItem) {
    this.menuItem = menuItem;
  }

  public Restaurant getRestaurant() {
    return restaurant;
  }

  public void setRestaurant(Restaurant restaurant) {
    this.restaurant = restaurant;
  }
}