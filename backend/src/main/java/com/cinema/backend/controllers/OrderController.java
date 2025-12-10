package com.cinema.backend.controllers;

import com.cinema.backend.models.Order;
import com.cinema.backend.models.User;
import com.cinema.backend.repositories.OrderRepository;
import com.cinema.backend.repositories.UserRepository;
import com.cinema.backend.services.EmailService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @PostMapping("/order")
    public ResponseEntity<?> newOrder(@RequestBody Order newOrder) throws MessagingException, UnsupportedEncodingException {
        Order savedOrder = orderRepository.save(newOrder);
        User user = userRepository.findById(savedOrder.getCustomerId()).orElse(null);

        if (user != null) {
            String email = user.getEmail();
            String subject = "🎬 Booking Confirmation - " + savedOrder.getMovieTitle();

            String seats = savedOrder.getSeat() != null
                    ? savedOrder.getSeat().stream()
                            .map(seat -> String.valueOf(seat + 1))
                            .collect(Collectors.joining(", "))
                    : "N/A";

            String formattedDate = "N/A";
            if (savedOrder.getOrderDate() != null && !savedOrder.getOrderDate().isEmpty()) {
                LocalDateTime orderDateTime = LocalDateTime.parse(savedOrder.getOrderDate());
                formattedDate = orderDateTime.format(DateTimeFormatter.ofPattern("dd MMM yyyy, h:mm a"));
            }

            double totalPrice = savedOrder.getMoviePrice() * (savedOrder.getSeat() != null ? savedOrder.getSeat().size() : 1);

            String html = """
                    <h2>🎫 Your Movie Booking is Confirmed!</h2>
                    <p>Hi %s, thank you for booking with our Cinema!</p>
                    <h3>Booking Details:</h3>
                    <ul>
                        <li><b>Movie:</b> %s</li>
                        <li><b>Seats:</b> %s</li>
                        <li><b>Total Price:</b> Rs %s</li>
                        <li><b>Show Time:</b> %s</li>
                    </ul>
                    <p>Enjoy your movie! 🍿</p>
                    """.formatted(user.getName(), savedOrder.getMovieTitle(), seats, totalPrice, formattedDate);

            try {
                emailService.sendEmail(email, subject, html);
            } catch (MessagingException e) {
                return ResponseEntity.status(500).body("Booking saved BUT email failed: " + e.getMessage());
            }
        }
        return ResponseEntity.ok(savedOrder);
    }

    @GetMapping("/order/{userId}")
    public List<Order> getAllOrdersByUserId(@PathVariable Long userId) {
        return orderRepository.findByCustomerIdOrderByCreatedAtDesc(userId);
    }
}
