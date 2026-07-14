package com.banking.Banking_system.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.banking.Banking_system.dto.AccountResponse;
import com.banking.Banking_system.dto.DepositRequest;
import com.banking.Banking_system.dto.TransactionResponse;
import com.banking.Banking_system.dto.TransferRequest;
import com.banking.Banking_system.entity.User;
import com.banking.Banking_system.service.AccountService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    // Create a new bank account
    @PostMapping
    public ResponseEntity<AccountResponse> createAccount(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(accountService.createAccount(user));
    }

    // Get my account details
    @GetMapping
    public ResponseEntity<AccountResponse> getMyAccount(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(accountService.getMyAccount(user));
    }

    // Deposit money
    @PostMapping("/deposit")
    public ResponseEntity<AccountResponse> deposit(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody DepositRequest request) {
        return ResponseEntity.ok(accountService.deposit(user, request));
    }

    // Transfer money to another account
    @PostMapping("/transfer")
    public ResponseEntity<AccountResponse> transfer(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody TransferRequest request) {
        return ResponseEntity.ok(accountService.transfer(user, request));
    }

    // Get transaction history
    @GetMapping("/transactions")
    public ResponseEntity<List<TransactionResponse>> getTransactionHistory(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(accountService.getTransactionHistory(user));
    }
}
