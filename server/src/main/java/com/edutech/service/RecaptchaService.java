package com.edutech.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.edutech.dto.RecaptchaResponse;

import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.http.*;

@Service
public class RecaptchaService {

    @Value("${google.recaptcha.secret}")
    private String secretKey;

    public boolean verify(String captchaToken) {
        if (captchaToken == null || captchaToken.isBlank()) {
            return false;
        }

        String verifyUrl = "https://www.google.com/recaptcha/api/siteverify";

        RestTemplate restTemplate = new RestTemplate();

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("secret", secretKey);
        body.add("response", captchaToken);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<MultiValueMap<String, String>> request =
            new HttpEntity<>(body, headers);

        ResponseEntity<RecaptchaResponse> response =
            restTemplate.postForEntity(verifyUrl, request, RecaptchaResponse.class);

        return response.getBody() != null && response.getBody().isSuccess();
    }
}