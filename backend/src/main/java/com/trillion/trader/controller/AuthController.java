package com.trillion.trader.controller;

import com.trillion.trader.dto.ApiResponse;
import com.trillion.trader.dto.request.AuthRequest;
import com.trillion.trader.dto.response.AuthResponse;
import com.trillion.trader.dto.response.UserResponse;
import com.trillion.trader.security.CustomUserDetails;
import com.trillion.trader.security.JwtTokenProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = tokenProvider.generateToken(authentication);
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        UserResponse userResponse = UserResponse.builder()
                .id(userDetails.getUser().getId())
                .email(userDetails.getUser().getEmail())
                .firstName(userDetails.getUser().getFirstName())
                .lastName(userDetails.getUser().getLastName())
                .roles(userDetails.getUser().getRoles())
                .active(userDetails.getUser().isActive())
                .build();

        AuthResponse authResponse = AuthResponse.builder()
                .token(token)
                .user(userResponse)
                .build();

        return ResponseEntity.ok(ApiResponse.success(authResponse, "Login successful"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        UserResponse userResponse = UserResponse.builder()
                .id(userDetails.getUser().getId())
                .email(userDetails.getUser().getEmail())
                .firstName(userDetails.getUser().getFirstName())
                .lastName(userDetails.getUser().getLastName())
                .roles(userDetails.getUser().getRoles())
                .active(userDetails.getUser().isActive())
                .build();
                
        return ResponseEntity.ok(ApiResponse.success(userResponse, "Current user retrieved"));
    }
}
