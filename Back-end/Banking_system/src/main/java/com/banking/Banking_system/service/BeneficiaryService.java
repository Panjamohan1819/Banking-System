package com.banking.Banking_system.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.banking.Banking_system.dto.BeneficiaryRequest;
import com.banking.Banking_system.dto.BeneficiaryResponse;
import com.banking.Banking_system.entity.Beneficiary;
import com.banking.Banking_system.entity.User;
import com.banking.Banking_system.exception.ResourceNotFoundException;
import com.banking.Banking_system.repository.BeneficiaryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BeneficiaryService {

    private final BeneficiaryRepository beneficiaryRepository;

    // Add a new beneficiary
    @Transactional
    public BeneficiaryResponse addBeneficiary(User user, BeneficiaryRequest request) {
        // Check if beneficiary already exists for this user
        if (beneficiaryRepository.existsByUserIdAndAccountNumber(user.getId(), request.getAccountNumber())) {
            throw new RuntimeException("Beneficiary with this account number already exists.");
        }

        Beneficiary beneficiary = Beneficiary.builder()
                .user(user)
                .beneficiaryName(request.getBeneficiaryName())
                .accountNumber(request.getAccountNumber())
                .nickname(request.getNickname())
                .build();

        Beneficiary saved = beneficiaryRepository.save(beneficiary);
        return mapToResponse(saved);
    }

    // Get all beneficiaries for the logged-in user
    public List<BeneficiaryResponse> getMyBeneficiaries(User user) {
        List<Beneficiary> beneficiaries = beneficiaryRepository.findByUserId(user.getId());
        return beneficiaries.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Delete a beneficiary
    @Transactional
    public void deleteBeneficiary(User user, Long beneficiaryId) {
        Beneficiary beneficiary = beneficiaryRepository.findById(beneficiaryId)
                .orElseThrow(() -> new ResourceNotFoundException("Beneficiary not found."));

        // Ensure the beneficiary belongs to the logged-in user
        if (!beneficiary.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to delete this beneficiary.");
        }

        beneficiaryRepository.delete(beneficiary);
    }

    // Helper: map Beneficiary entity to BeneficiaryResponse DTO
    private BeneficiaryResponse mapToResponse(Beneficiary b) {
        return BeneficiaryResponse.builder()
                .id(b.getId())
                .beneficiaryName(b.getBeneficiaryName())
                .accountNumber(b.getAccountNumber())
                .nickname(b.getNickname())
                .createdAt(b.getCreatedAt())
                .build();
    }
}
