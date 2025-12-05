package com.cinema.backend.dto;

public class LoginResponseDTO {

    private String message;
    private String userName;
    private String surname;
    private Long userId;
    private String role;
    private String email;

    public LoginResponseDTO(String message, String userName,String surname, Long userId,String role,String email) {
        this.message = message;
        this.userName = userName;
        this.surname = surname;
        this.userId = userId;
        this.role = role;
        this.email = email;
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

    public String getSurname(){
        return surname;
    }

    public void setSurname(String surname){
        this.surname = surname;
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

    public String getEmail(){
        return email;
    }

    public void setEmail(String email){
        this.email = email;
    }
}
