package com.banking.Banking_system.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.banking.Banking_system.dto.AdminDashboardResponse;
import com.banking.Banking_system.dto.TransactionResponse;
import com.banking.Banking_system.dto.UserResponse;
import com.banking.Banking_system.service.AdminService;
import com.banking.Banking_system.service.AccountService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final AccountService accountService;

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/pending-users")
    public ResponseEntity<List<UserResponse>> getPendingUsers() {
        return ResponseEntity.ok(adminService.getPendingUsers());
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PostMapping("/approve/{userId}")
    public ResponseEntity<String> approveUser(@PathVariable Long userId) {
        return ResponseEntity.ok(adminService.approveUser(userId));
    }

    @PostMapping("/reject/{userId}")
    public ResponseEntity<String> rejectUser(@PathVariable Long userId) {
        return ResponseEntity.ok(adminService.rejectUser(userId));
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<TransactionResponse>> getAllTransactions() {
        return ResponseEntity.ok(adminService.getAllTransactions());
    }

    @PostMapping("/transactions/{transactionId}/approve")
    public ResponseEntity<String> approveTransaction(@PathVariable Long transactionId) {
        return ResponseEntity.ok(adminService.approveTransaction(transactionId));
    }

    @PostMapping("/transactions/{transactionId}/reject")
    public ResponseEntity<String> rejectTransaction(@PathVariable Long transactionId) {
        return ResponseEntity.ok(adminService.rejectTransaction(transactionId));
    }

    @PostMapping("/transactions/{transactionId}/cancel")
    public ResponseEntity<String> cancelTransaction(@PathVariable Long transactionId) {
        return ResponseEntity.ok(accountService.cancelTransaction(transactionId));
    }
}
