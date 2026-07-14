package com.banking.Banking_system.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.banking.Banking_system.dto.AdminDashboardResponse;
import com.banking.Banking_system.dto.TransactionResponse;
import com.banking.Banking_system.dto.UserResponse;
import com.banking.Banking_system.entity.Account;
import com.banking.Banking_system.entity.Role;
import com.banking.Banking_system.entity.Transaction;
import com.banking.Banking_system.entity.TransactionStatus;
import com.banking.Banking_system.entity.TransactionType;
import com.banking.Banking_system.entity.User;
import com.banking.Banking_system.exception.ResourceNotFoundException;
import com.banking.Banking_system.repository.AccountRepository;
import com.banking.Banking_system.repository.TransactionRepository;
import com.banking.Banking_system.repository.UserRepository;
import java.math.BigDecimal;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final AccountService accountService;

    public AdminDashboardResponse getDashboardStats() {
        long totalUsers = userRepository.countByRole(Role.CUSTOMER);
        List<User> pendingUsers = userRepository.findByIsApprovedFalse();
        long pendingApprovals = pendingUsers.size();
        long totalAccounts = accountRepository.count();
        long totalTransactions = transactionRepository.count();

        List<UserResponse> recentPending = pendingUsers.stream()
                .limit(5)
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());

        return AdminDashboardResponse.builder()
                .totalUsers(totalUsers)
                .pendingApprovals(pendingApprovals)
                .totalAccounts(totalAccounts)
                .totalTransactions(totalTransactions)
                .recentPendingUsers(recentPending)
                .build();
    }

    public List<UserResponse> getPendingUsers() {
        return userRepository.findByIsApprovedFalse().stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findByRole(Role.CUSTOMER).stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public String approveUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        user.setIsApproved(true);
        userRepository.save(user);
        
        // Auto-create account
        accountService.createAccount(user);
        
        return "User approved and account created successfully";
    }

    @Transactional
    public String rejectUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        userRepository.delete(user);
        return "User registration rejected";
    }

    public List<TransactionResponse> getAllTransactions() {
        return transactionRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToTransactionResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public String approveTransaction(Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        
        if (transaction.getStatus() != TransactionStatus.PENDING) {
            throw new RuntimeException("Only PENDING transactions can be approved.");
        }
        if (transaction.getType() != TransactionType.DEPOSIT) {
            throw new RuntimeException("Only DEPOSIT transactions require approval.");
        }

        // Add funds to receiver
        Account account = transaction.getReceiverAccount();
        account.setBalance(account.getBalance().add(transaction.getAmount()));
        accountRepository.save(account);

        // Mark as completed
        transaction.setStatus(TransactionStatus.COMPLETED);
        transactionRepository.save(transaction);
        
        return "Deposit transaction approved and funds credited.";
    }

    @Transactional
    public String rejectTransaction(Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        
        if (transaction.getStatus() != TransactionStatus.PENDING) {
            throw new RuntimeException("Only PENDING transactions can be rejected.");
        }

        transaction.setStatus(TransactionStatus.FAILED); // or CANCELLED
        transactionRepository.save(transaction);
        
        return "Transaction rejected.";
    }
    
    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .country(user.getCountry())
                .isApproved(user.getIsApproved())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private TransactionResponse mapToTransactionResponse(Transaction t) {
        BigDecimal convertedAmount = null;
        String senderCurrency = null;
        String receiverCurrency = null;

        if (t.getType() == TransactionType.TRANSFER && t.getSenderAccount() != null && t.getReceiverAccount() != null) {
            senderCurrency = t.getSenderAccount().getCurrency().name();
            receiverCurrency = t.getReceiverAccount().getCurrency().name();
            convertedAmount = t.getAmount()
                    .multiply(BigDecimal.valueOf(t.getSenderAccount().getCurrency().getRateToInr()))
                    .divide(BigDecimal.valueOf(t.getReceiverAccount().getCurrency().getRateToInr()), 4, java.math.RoundingMode.HALF_UP);
        }

        return TransactionResponse.builder()
                .id(t.getId())
                .senderAccountNumber(t.getSenderAccount() != null ? t.getSenderAccount().getAccountNumber() : null)
                .receiverAccountNumber(t.getReceiverAccount() != null ? t.getReceiverAccount().getAccountNumber() : null)
                .amount(t.getAmount())
                .convertedAmount(convertedAmount)
                .senderCurrency(senderCurrency)
                .receiverCurrency(receiverCurrency)
                .checkNumber(t.getCheckNumber())
                .type(t.getType().name())
                .status(t.getStatus().name())
                .description(t.getDescription())
                .createdAt(t.getCreatedAt())
                .build();
    }
}
