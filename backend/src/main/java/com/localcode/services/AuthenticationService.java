package com.localcode.services;

import com.localcode.dto.AuthResponse;
import com.localcode.dto.LoginRequest;
import com.localcode.dto.RegisterRequest;
import com.localcode.dto.UserDTO;
import com.localcode.exception.ValidationException;
import com.localcode.persistence.entity.User;
import com.localcode.persistence.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Service for handling user authentication operations.
 */
@Service
public class AuthenticationService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SecretKey jwtSecretKey;
    private final long jwtExpiration;
    
    public AuthenticationService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Value("${jwt.secret}") String jwtSecret,
            @Value("${jwt.expiration}") long jwtExpiration) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtSecretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        this.jwtExpiration = jwtExpiration;
    }
    
    /**
     * Register a new user with BCrypt password hashing (12 rounds).
     *
     * @param request the registration request
     * @return UserDTO of the created user
     * @throws IllegalArgumentException if username or email already exists
     */
    @Transactional
    public UserDTO register(RegisterRequest request) {
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ValidationException("username", "Username already exists");
        }
        
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ValidationException("email", "Email already exists");
        }
        
        // Hash password with BCrypt (12 rounds configured in PasswordEncoder bean)
        String hashedPassword = passwordEncoder.encode(request.getPassword());
        
        // Create and save user
        User user = new User(request.getUsername(), request.getEmail(), hashedPassword);
        user = userRepository.save(user);
        
        return UserDTO.fromEntity(user);
    }
    
    /**
     * Authenticate user and generate JWT token.
     *
     * @param request the login request
     * @return AuthResponse containing JWT token and user info
     * @throws BadCredentialsException if credentials are invalid
     */
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        // Find user by username
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Invalid username or password"));
        
        // Validate password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid username or password");
        }
        
        // Generate JWT token
        String token = generateToken(user);
        
        // Create response
        UserDTO userDTO = UserDTO.fromEntity(user);
        return new AuthResponse(token, userDTO);
    }
    
    /**
     * Generate JWT token with 1-hour expiration.
     *
     * @param user the user to generate token for
     * @return JWT token string
     */
    public String generateToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);
        
        return Jwts.builder()
                .subject(user.getUsername())
                .claim("userId", user.getId())
                .claim("email", user.getEmail())
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(jwtSecretKey, SignatureAlgorithm.HS256)
                .compact();
    }
    
    /**
     * Validate JWT token and extract claims.
     *
     * @param token the JWT token
     * @return Claims if token is valid
     * @throws io.jsonwebtoken.JwtException if token is invalid or expired
     */
    public Claims validateToken(String token) {
        return Jwts.parser()
                .verifyWith(jwtSecretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
    
    /**
     * Extract username from JWT token.
     *
     * @param token the JWT token
     * @return username
     */
    public String getUsernameFromToken(String token) {
        Claims claims = validateToken(token);
        return claims.getSubject();
    }
    
    /**
     * Extract user ID from JWT token.
     *
     * @param token the JWT token
     * @return user ID
     */
    public Long getUserIdFromToken(String token) {
        Claims claims = validateToken(token);
        return claims.get("userId", Long.class);
    }
    
    /**
     * Get user by username.
     *
     * @param username the username
     * @return User entity
     * @throws UsernameNotFoundException if user not found
     */
    @Transactional(readOnly = true)
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }
    
    /**
     * Get user by ID.
     *
     * @param userId the user ID
     * @return User entity
     * @throws UsernameNotFoundException if user not found
     */
    @Transactional(readOnly = true)
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with ID: " + userId));
    }
}
