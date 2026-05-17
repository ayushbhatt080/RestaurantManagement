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

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // ✅ PLACE ORDER
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

    // ✅ GET ALL ORDERS
    @GetMapping
    public ResponseEntity<List<OrderResponseDTO>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();

        List<OrderResponseDTO> response = orders.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // ✅ GET ORDER BY ID
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> getOrderById(@PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        return new ResponseEntity<>(mapToDTO(order), HttpStatus.OK);
    }

    // ✅ GET ORDERS BY USER ID
    @GetMapping("/userId/{userId}")
    public ResponseEntity<List<OrderResponseDTO>> getUserOrderHistory(@PathVariable Long userId) {
        List<Order> orders = orderService.getOrdersByUser(userId);

        List<OrderResponseDTO> response = orders.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // ✅ CANCEL ORDER
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Long id) {
        orderService.cancelOrder(id);

        return new ResponseEntity<>(
                Map.of("message", "Order cancelled successfully"),
                HttpStatus.OK
        );
    }

    // ✅ UPDATE ORDER STATUS
    @PutMapping("/{id}/status/{status}")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @PathVariable String status) {

        orderService.updateOrderStatus(id, status);

        return new ResponseEntity<>(
                Map.of("message", "Order status updated successfully"),
                HttpStatus.OK
        );
    }

    // ✅ Convert Order entity to clean frontend DTO
    private OrderResponseDTO mapToDTO(Order order) {

        String restaurantName = order.getRestaurant() != null
                ? order.getRestaurant().getName()
                : null;

        int itemCount = order.getItems() != null
                ? order.getItems().size()
                : 0;

        return new OrderResponseDTO(
                order.getId(),
                order.getCustomerName(),
                restaurantName,
                itemCount,
                order.getTotalAmount(),
                order.getStatus(),
                order.getOrderTime()
        );
    }
}
// package com.edutech.controller;

// import java.util.List;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import com.edutech.dto.OrderRequest;
// import com.edutech.model.Order;
// import com.edutech.service.OrderService;

// @RestController
// @RequestMapping("/api/orders")
// public class OrderController {

//     @Autowired
//     private OrderService orderService;

//     // ✅ PLACE ORDER - changed to return simple message
//     // @PostMapping
//     // public ResponseEntity<?> placeOrder(@RequestBody OrderRequest request) {
//     //     try {
//     //         orderService.createOrder(request);

//     //         return new ResponseEntity<>(
//     //                 "Order placed successfully",
//     //                 HttpStatus.CREATED
//     //         );

//     //     } catch (Exception e) {
//     //         e.printStackTrace();

//     //         return new ResponseEntity<>(
//     //                 "Order failed: " + e.getMessage(),
//     //                 HttpStatus.INTERNAL_SERVER_ERROR
//     //         );
//     //     }
//     // }

//     @PostMapping
// public ResponseEntity<?> placeOrder(@RequestBody OrderRequest request) {
//     try {
//         orderService.createOrder(request);

//         return new ResponseEntity<>(
//                 java.util.Map.of("message", "Order placed successfully"),
//                 HttpStatus.CREATED
//         );

//     } catch (Exception e) {
//         e.printStackTrace();

//         return new ResponseEntity<>(
//                 java.util.Map.of("error", "Order failed: " + e.getMessage()),
//                 HttpStatus.INTERNAL_SERVER_ERROR
//         );
//     }
// }

//     // ✅ GET ALL ORDERS
//     @GetMapping
//     public ResponseEntity<List<Order>> getAllOrders() {
//         List<Order> orders = orderService.getAllOrders();
//         return new ResponseEntity<>(orders, HttpStatus.OK);
//     }

//     // ✅ GET ORDER BY ID
//     @GetMapping("/{id}")
//     public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
//         Order order = orderService.getOrderById(id);
//         return new ResponseEntity<>(order, HttpStatus.OK);
//     }

//     // ✅ GET ORDERS BY USER ID
//     @GetMapping("/userId/{userId}")
//     public ResponseEntity<List<Order>> getUserOrderHistory(@PathVariable Long userId) {
//         List<Order> orders = orderService.getOrdersByUser(userId);
//         return new ResponseEntity<>(orders, HttpStatus.OK);
//     }

//     // ✅ CANCEL ORDER
//     @PutMapping("/{id}/cancel")
//     public ResponseEntity<String> cancelOrder(@PathVariable Long id) {
//         orderService.cancelOrder(id);
//         return new ResponseEntity<>("Order cancelled successfully", HttpStatus.OK);
//     }

//     // ✅ UPDATE ORDER STATUS - useful for admin/manager dropdown
//     @PutMapping("/{id}/status/{status}")
//     public ResponseEntity<String> updateOrderStatus(
//             @PathVariable Long id,
//             @PathVariable String status) {

//         orderService.updateOrderStatus(id, status);
//         return new ResponseEntity<>("Order status updated successfully", HttpStatus.OK);
//     }
// }