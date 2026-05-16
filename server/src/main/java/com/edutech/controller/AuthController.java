package com.edutech.controller;

import java.security.Principal;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.edutech.dto.LoginRequest;
import com.edutech.dto.LoginResponse;
import com.edutech.model.User;
import com.edutech.service.RecaptchaService;
import com.edutech.service.UserService;
import com.edutech.util.JwtUtil;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  
    private UserService userService;


    private AuthenticationManager authenticationManager;

    private RecaptchaService recaptchaService;

    
    private JwtUtil jwtUtil;

    public AuthController(
            UserService userService,
            AuthenticationManager authenticationManager,
            JwtUtil jwtUtil,
            RecaptchaService recaptchaService
    ) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.recaptchaService = recaptchaService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@Valid @RequestBody User user) {

        User savedUser = userService.registerUser(user);

        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {

        boolean captchaValid = recaptchaService.verify(loginRequest.getCaptchaToken());

        if (!captchaValid) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Captcha verification failed. Please try again.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()));

        String username = authentication.getName();

        User user = userService.getUserByUsername(username);

        String token = jwtUtil.generateToken(username);

        LoginResponse response = new LoginResponse(
                user.getId(),
                token,
                user.getUsername(),
                user.getEmail(),
                user.getRole());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/userDetails")
    public ResponseEntity<LoginResponse> getLoggedInUserDetails(Principal principal) {

        String username = principal.getName();

        User user = userService.getUserByUsername(username);

        LoginResponse response = new LoginResponse(
                user.getId(),
                null,
                user.getUsername(),
                user.getEmail(),
                user.getRole());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}