package com.localcode.dto;

/**
 * DTO for authentication response containing JWT token and user information.
 */
public class AuthResponse {
    
    private String token;
    private String tokenType = "Bearer";
    private UserDTO user;
    
    // Constructors
    public AuthResponse() {
    }
    
    public AuthResponse(String token, UserDTO user) {
        this.token = token;
        this.user = user;
    }
    
    // Getters and Setters
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getTokenType() {
        return tokenType;
    }
    
    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }
    
    public UserDTO getUser() {
        return user;
    }
    
    public void setUser(UserDTO user) {
        this.user = user;
    }
}
