package com.banking.Banking_system.service;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.banking.Banking_system.dto.AuthResponse;
import com.banking.Banking_system.dto.LoginRequest;
import com.banking.Banking_system.dto.RegisterRequest;
import com.banking.Banking_system.dto.OtpVerificationRequest;
import com.banking.Banking_system.entity.Role;
import com.banking.Banking_system.entity.User;
import com.banking.Banking_system.exception.UserAlreadyExistsException;
import com.banking.Banking_system.repository.UserRepository;
import com.banking.Banking_system.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServices {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    // Register a new user
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email already exists.");
        }

        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new UserAlreadyExistsException("Phone number already exists.");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .country(request.getCountry())
                .role(Role.CUSTOMER)
                .isApproved(false)
                .build();

        userRepository.save(user);

        return new AuthResponse(
                null,
                user.getEmail(),
                user.getFullName(),
                user.getRole().name(),
                "Registration successful. Please wait for admin approval."
        );
    }

    // Login existing user (Step 1: Check credentials and generate OTP)
    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found."));

        if (Boolean.FALSE.equals(user.getIsApproved())) {
            throw new RuntimeException("Account is pending admin approval.");
        }

        if (user.getRole() == Role.ADMIN) {
            String token = jwtService.generateToken(user);
            return new AuthResponse(
                    token,
                    user.getEmail(),
                    user.getFullName(),
                    user.getRole().name(),
                    "Admin login successful."
            );
        }

        // Generate 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        userRepository.save(user);

        // Send Email OTP
        emailService.sendOtpEmail(user.getEmail(), otp);

        return new AuthResponse(
                null,
                user.getEmail(),
                user.getFullName(),
                user.getRole().name(),
                "OTP sent to email. Please verify to login."
        );
    }

    // Verify OTP (Step 2: Generate JWT)
    public AuthResponse verifyOtp(OtpVerificationRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found."));

        if (user.getOtp() == null || !user.getOtp().equals(request.getOtp())) {
            throw new RuntimeException("Invalid OTP.");
        }

        if (user.getOtpExpiry() != null && user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired.");
        }

        // Clear OTP
        user.setOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);

        String token = jwtService.generateToken(user);

        return new AuthResponse(
                token,
                user.getEmail(),
                user.getFullName(),
                user.getRole().name(),
                "Login successful."
        );
    }

    // Forgot Password
    public AuthResponse forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found."));

        String otp = String.format("%06d", new Random().nextInt(999999));
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        emailService.sendOtpEmail(user.getEmail(), otp);

        return new AuthResponse(
                null,
                user.getEmail(),
                user.getFullName(),
                user.getRole().name(),
                "Password reset OTP sent to email."
        );
    }

    // Reset Password
    public AuthResponse resetPassword(com.banking.Banking_system.dto.ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found."));

        if (user.getOtp() == null || !user.getOtp().equals(request.getOtp())) {
            throw new RuntimeException("Invalid OTP.");
        }

        if (user.getOtpExpiry() != null && user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired.");
        }

        // Clear OTP and reset password
        user.setOtp(null);
        user.setOtpExpiry(null);
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return new AuthResponse(
                null,
                user.getEmail(),
                user.getFullName(),
                user.getRole().name(),
                "Password reset successful. Please login with your new password."
        );
    }
}