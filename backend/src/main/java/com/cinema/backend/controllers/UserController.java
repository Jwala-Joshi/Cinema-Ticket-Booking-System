package com.cinema.backend.controllers;

import com.cinema.backend.dto.LoginResponseDTO;
import com.cinema.backend.models.User;
import com.cinema.backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/api/v1/register")
    User newUser(@RequestBody User newUser) {
        return userService.registerUser(newUser);
    }

    @PostMapping("/api/v1/login")
    public ResponseEntity<LoginResponseDTO> loginUser(@RequestBody User loginRequest) {
        User user = userService.getUserByEmail(loginRequest.getEmail());

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponseDTO("Invalid credentials", null, null,null,null,null));
        }

        if (userService.isPasswordMatch(loginRequest.getPassword(), user.getPassword())) {
            LoginResponseDTO response = new LoginResponseDTO("Login successful", user.getName(),user.getSurname(), user.getId(),user.getRole().toString(),user.getEmail());
            return ResponseEntity.ok().body(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponseDTO("Invalid credentials", null, null,null,null,null));
        }
    }

    @GetMapping("/api/v1/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/api/v1/users/{id}") 
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(user);
    }

    @PutMapping("/api/v1/users/{id}")
    public ResponseEntity<?> updateUserName(@PathVariable Long id, @RequestBody NameUpdateRequest req) {
        try {
            User updatedUser = userService.updateName(id, req.getName(), req.getSurname(), req.getCurrentPassword());
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PutMapping("/api/v1/users/{id}/email")
    public ResponseEntity<?> updateUserEmail(@PathVariable Long id, @RequestBody EmailUpdateRequest req) {
        try {
            User updatedUser = userService.updateEmail(id, req.getEmail(), req.getCurrentPassword());
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    @PutMapping("/api/v1/users/{id}/role")
    public ResponseEntity<User> updateUserRole(@PathVariable Long id, @RequestBody RoleRequest req) {
        try {
            User updatedUser = userService.updateRole(id, req.getRole());
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping("/api/v1/users/{id}/password")
    public ResponseEntity<User> updatePassword(@PathVariable Long id, @RequestBody PasswordRequest req) {
        try {
            User updatedUser = userService.updatePassword(id, req.getPassword());
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping("/api/v1/users/{id}/passwordUpdate")
    public ResponseEntity<?> updatePasswordWithValid(@PathVariable Long id, @RequestBody PasswordUpdateRequest req) {
        try {
            User updatedUser = userService.updatePassword(id, req.getCurrentPassword(), req.getNewPassword());
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @DeleteMapping("/api/v1/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    static class NameUpdateRequest {
        private String name;
        private String surname;
        private String currentPassword;
        
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getSurname() { return surname; }
        public void setSurname(String surname) { this.surname = surname; }
        public String getCurrentPassword() { return currentPassword; }
        public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }
    }

    static class EmailUpdateRequest {
        private String email;
        private String currentPassword;
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getCurrentPassword() { return currentPassword; }
        public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }
    }

    static class PasswordUpdateRequest {
        private String currentPassword;
        private String newPassword;
        
        public String getCurrentPassword() { return currentPassword; }
        public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }

    static class RoleRequest {
        private String role;
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }

    static class PasswordRequest {
        private String password;
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}