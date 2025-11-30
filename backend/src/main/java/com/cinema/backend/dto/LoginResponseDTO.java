package com.cinema.backend.dto;

public class LoginResponseDTO {

    private String message;
    private String userName;
    private Long userId;
    private String role;

    public LoginResponseDTO(String message, String userName, Long userId,String role) {
        this.message = message;
        this.userName = userName;
        this.userId = userId;
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role){
        this.role = role;
    }
}
