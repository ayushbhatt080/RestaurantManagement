package com.edutech.service;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.config.RazorpayConfig;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;

@Service
public class PaymentService {

    @Autowired
    private RazorpayConfig razorpayConfig;

    public String createOrder(Double amount) throws Exception {

        RazorpayClient client = new RazorpayClient(
                razorpayConfig.getKeyId(),
                razorpayConfig.getKeySecret()
        );

        JSONObject orderRequest = new JSONObject();

        orderRequest.put("amount", amount);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "txn_123456");

        Order order = client.orders.create(orderRequest);

        return order.toString();
    }
}
