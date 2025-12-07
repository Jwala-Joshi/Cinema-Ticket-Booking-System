package com.cinema.backend.controllers;

import com.cinema.backend.models.Order;
import com.cinema.backend.repositories.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @PostMapping("/api/v1/order")
    Order newOrder(@RequestBody Order newOrder) {
        return orderRepository.save(newOrder);
    }

    @GetMapping("/api/v1/order/{userId}")
    public List<Order> getAllOrdersByUserId(@PathVariable Long userId) {
        return orderRepository.findByCustomerIdOrderByCreatedAtDesc(userId);
    }
}
