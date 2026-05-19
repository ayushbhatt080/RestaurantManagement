package com.edutech.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.edutech.service.PaymentService;

@RestController
@RequestMapping("api/payment")
// @CrossOrigin
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/createOrder")
    public String createOrder(
            @RequestParam Double amount)
            throws Exception {

        return paymentService.createOrder(amount);
    }
}