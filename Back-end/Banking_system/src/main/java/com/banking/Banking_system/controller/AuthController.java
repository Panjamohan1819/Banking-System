package com.banking.Banking_system.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.banking.Banking_system.dto.AuthResponse;
import com.banking.Banking_system.dto.LoginRequest;
import com.banking.Banking_system.dto.RegisterRequest;
import com.banking.Banking_system.service.AuthServices;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthServices authServices;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authServices.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authServices.login(request));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@Valid @RequestBody com.banking.Banking_system.dto.OtpVerificationRequest request) {
        return ResponseEntity.ok(authServices.verifyOtp(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<AuthResponse> forgotPassword(@Valid @RequestBody com.banking.Banking_system.dto.ForgotPasswordRequest request) {
        return ResponseEntity.ok(authServices.forgotPassword(request.getEmail()));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<AuthResponse> resetPassword(@Valid @RequestBody com.banking.Banking_system.dto.ResetPasswordRequest request) {
        return ResponseEntity.ok(authServices.resetPassword(request));
    }
}
