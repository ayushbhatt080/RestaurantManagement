package com.edutech.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutech.dto.OrderRequest;
import com.edutech.dto.OrderResponseDTO;
import com.edutech.model.Order;
import com.edutech.service.OrderService;
import com.edutech.util.JwtUtil;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;
     @Autowired
        private JwtUtil jwtUtil;



@GetMapping("/my")
public ResponseEntity<List<OrderResponseDTO>> getMyOrders(@RequestHeader("Authorization") String header) {

    String token = header.replace("Bearer ", "");
    String username = jwtUtil.extractUsername(token);

    List<Order> orders = orderService.getOrdersForManager(username);

    List<OrderResponseDTO> response = orders.stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());

    return ResponseEntity.ok(response);
}


    // =========================
    // PLACE ORDER
    // =========================
    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody OrderRequest request) {

        try {

            orderService.createOrder(request);

            return new ResponseEntity<>(
                    Map.of("message", "Order placed successfully"),
                    HttpStatus.CREATED
            );

        } catch (Exception e) {

            e.printStackTrace();

            return new ResponseEntity<>(
                    Map.of("error", "Order failed: " + e.getMessage()),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
    

    // =========================
    // GET ALL ORDERS
    // =========================
    @GetMapping
    public ResponseEntity<List<OrderResponseDTO>> getAllOrders() {

        List<Order> orders = orderService.getAllOrders();

        List<OrderResponseDTO> response = orders.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // =========================
    // GET ORDER BY ID
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> getOrderById(
            @PathVariable Long id
    ) {

        Order order = orderService.getOrderById(id);

        return new ResponseEntity<>(
                mapToDTO(order),
                HttpStatus.OK
        );
    }

    // =========================
    // GET ORDERS BY USER ID
    // =========================
    @GetMapping("/userId/{userId}")
    public ResponseEntity<List<OrderResponseDTO>> getUserOrderHistory(
            @PathVariable Long userId
    ) {

        List<Order> orders = orderService.getOrdersByUser(userId);

        List<OrderResponseDTO> response = orders.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // =========================
    // CANCEL ORDER
    // =========================
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(
            @PathVariable Long id
    ) {

        orderService.cancelOrder(id);

        return new ResponseEntity<>(
                Map.of("message", "Order cancelled successfully"),
                HttpStatus.OK
        );
    }

    // =========================
    // UPDATE ORDER STATUS
    // =========================
    @PutMapping("/{id}/status/{status}")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @PathVariable String status
    ) {

        orderService.updateOrderStatus(id, status);

        return new ResponseEntity<>(
                Map.of("message", "Order status updated successfully"),
                HttpStatus.OK
        );
    }

    // =========================
    // ENTITY -> DTO MAPPING
    // =========================
    private OrderResponseDTO mapToDTO(Order order) {

        // Restaurant name
        String restaurantName =
                order.getRestaurant() != null
                        ? order.getRestaurant().getName()
                        : null;

        // Item count
        int itemCount =
                order.getItems() != null
                        ? order.getItems().size()
                        : 0;

        // Menu item names
        List<String> menuItemNames =
                order.getItems() != null
                        ? order.getItems()
                               .stream()
                               .map(item -> item.getName())
                               .collect(Collectors.toList())
                        : List.of();

        return new OrderResponseDTO(
                order.getId(),
                order.getCustomerName(),
                restaurantName,
                itemCount,
                menuItemNames,
                order.getTotalAmount(),
                order.getStatus(),
                order.getOrderTime()
        );
    }
}
