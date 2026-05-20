
package com.edutech.model;
import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String username;

    @Column(unique = true)
    private String password;

    @Email
    @Column(unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
    

    //fields for session management of user
    private String sessionId;

    //fields for password reset
    private String resetToken;
    private LocalDateTime resetTokenExpiry;

    // One user → Many orders
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Order> orders;

    // Constructors
    public User() {}

    public User(String username, String password, String email, Role role) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public List<Order> getOrders() {
        return orders;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }

    //Getter Setter for session Management

    public String getSessionId(){
        return this.sessionId;
    }

    public void setSessionId(String sessionId){
        this.sessionId= sessionId;
    }


    //Getter setter for password reset
    public String getresetToken(){
        return resetToken;
    }

    public void setResetToken(String resetToken){
        this.resetToken = resetToken;
    }

    public LocalDateTime getResetTokenExpiry(){
        return resetTokenExpiry;
    }

    public void setResetTokenExpiry(LocalDateTime resetTokenExpiry){
        this.resetTokenExpiry = resetTokenExpiry;
    }
}