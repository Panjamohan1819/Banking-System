package com.banking.Banking_system.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.banking.Banking_system.dto.BeneficiaryRequest;
import com.banking.Banking_system.dto.BeneficiaryResponse;
import com.banking.Banking_system.entity.User;
import com.banking.Banking_system.service.BeneficiaryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/beneficiaries")
@RequiredArgsConstructor
public class BeneficiaryController {

    private final BeneficiaryService beneficiaryService;

    // Add a new beneficiary
    @PostMapping
    public ResponseEntity<BeneficiaryResponse> addBeneficiary(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody BeneficiaryRequest request) {
        return ResponseEntity.ok(beneficiaryService.addBeneficiary(user, request));
    }

    // Get all my beneficiaries
    @GetMapping
    public ResponseEntity<List<BeneficiaryResponse>> getMyBeneficiaries(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(beneficiaryService.getMyBeneficiaries(user));
    }

    // Delete a beneficiary
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBeneficiary(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        beneficiaryService.deleteBeneficiary(user, id);
        return ResponseEntity.ok("Beneficiary deleted successfully.");
    }
}
