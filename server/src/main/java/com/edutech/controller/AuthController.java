package com.edutech.controller;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.edutech.dto.LoginRequest;
import com.edutech.dto.LoginResponse;
import com.edutech.dto.OtpRequest;
import com.edutech.dto.OtpVerificationRequest;

import com.edutech.model.User;
import com.edutech.service.EmailService;
// import com.edutech.service.EmailServiceImpl;
import com.edutech.service.OtpService;
import com.edutech.service.RecaptchaService;
import com.edutech.service.UserService;
import com.edutech.util.JwtUtil;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private RecaptchaService recaptchaService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private OtpService otpService;

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@Valid @RequestBody User user) {

        User savedUser = userService.registerUser(user);

        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestBody OtpRequest request) {

        otpService.generateAndSendOtp(request.getEmail());

        return new ResponseEntity<>("OTP sent successfully", HttpStatus.OK);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpVerificationRequest request) {

        boolean isOtpValid = otpService.verifyOtp(
                request.getEmail(),
                request.getOtp());

        if (!isOtpValid) {
            return new ResponseEntity<>(
                    "Invalid or expired OTP",
                    HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(
                "OTP verified successfully",
                HttpStatus.OK);
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
        String sessionId = UUID.randomUUID().toString();
        user.setSessionId(sessionId);
        userService.saveUser(user);

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
    public ResponseEntity<LoginResponse> getLoggedInUserDetails(@RequestBody Principal principal) {

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

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAll() {
        List<User> users = userService.getAllManagers();
        return ResponseEntity.ok(users);
    }

}