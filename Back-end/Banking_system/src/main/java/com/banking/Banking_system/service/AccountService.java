package com.banking.Banking_system.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.banking.Banking_system.dto.AccountResponse;
import com.banking.Banking_system.dto.DepositRequest;
import com.banking.Banking_system.dto.TransactionResponse;
import com.banking.Banking_system.dto.TransferRequest;
import com.banking.Banking_system.entity.Account;
import com.banking.Banking_system.entity.AccountType;
import com.banking.Banking_system.entity.Currency;
import com.banking.Banking_system.entity.Transaction;
import com.banking.Banking_system.entity.TransactionStatus;
import com.banking.Banking_system.entity.TransactionType;
import com.banking.Banking_system.entity.User;
import com.banking.Banking_system.exception.ResourceNotFoundException;
import com.banking.Banking_system.repository.AccountRepository;
import com.banking.Banking_system.repository.TransactionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    // Generate unique 12-digit account number
    private String generateAccountNumber() {
        String accountNumber;
        do {
            long number = (long) (Math.random() * 900000000000L) + 100000000000L;
            accountNumber = String.valueOf(number);
        } while (accountRepository.existsByAccountNumber(accountNumber));
        return accountNumber;
    }

    // Create a new account for the user
    @Transactional
    public AccountResponse createAccount(User user) {
        // Check if user already has an account
        if (accountRepository.findByUserId(user.getId()).isPresent()) {
            throw new RuntimeException("User already has an account.");
        }

        Account account = Account.builder()
                .accountNumber(generateAccountNumber())
                .balance(BigDecimal.ZERO)
                .status(AccountType.ACTIVE)
                .currency(Currency.fromCountry(user.getCountry()))
                .user(user)
                .build();

        Account saved = accountRepository.save(account);
        return mapToResponse(saved);
    }

    // Get account details for the logged-in user
    public AccountResponse getMyAccount(User user) {
        Account account = accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Account not found. Please create an account first."));
        return mapToResponse(account);
    }

    // Deposit money
    @Transactional
    public AccountResponse deposit(User user, DepositRequest request) {
        Account account = accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Account not found."));

        if (account.getStatus() != AccountType.ACTIVE) {
            throw new RuntimeException("Account is not active.");
        }

        if (transactionRepository.existsByCheckNumber(request.getCheckNumber())) {
            throw new RuntimeException("Check number already exists.");
        }

        // Record the transaction as PENDING. Admin must approve to add balance.
        Transaction transaction = Transaction.builder()
                .receiverAccount(account)
                .amount(request.getAmount())
                .type(TransactionType.DEPOSIT)
                .status(TransactionStatus.PENDING)
                .checkNumber(request.getCheckNumber())
                .description(request.getDescription() != null ? request.getDescription() : "Deposit")
                .build();
        transactionRepository.save(transaction);

        return mapToResponse(account);
    }

    // Transfer money to another account
    @Transactional
    public AccountResponse transfer(User user, TransferRequest request) {
        Account senderAccount = accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Sender account not found."));

        if (senderAccount.getStatus() != AccountType.ACTIVE) {
            throw new RuntimeException("Your account is not active.");
        }

        Account receiverAccount = accountRepository.findByAccountNumber(request.getReceiverAccountNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Receiver account not found."));

        if (receiverAccount.getStatus() != AccountType.ACTIVE) {
            throw new RuntimeException("Receiver account is not active.");
        }

        if (senderAccount.getAccountNumber().equals(receiverAccount.getAccountNumber())) {
            throw new RuntimeException("Cannot transfer to your own account.");
        }

        if (senderAccount.getBalance().compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Insufficient balance.");
        }

        Currency senderCurrency = senderAccount.getCurrency();
        Currency receiverCurrency = receiverAccount.getCurrency();

        BigDecimal convertedAmount = request.getAmount()
                .multiply(BigDecimal.valueOf(senderCurrency.getRateToInr()))
                .divide(BigDecimal.valueOf(receiverCurrency.getRateToInr()), 4, java.math.RoundingMode.HALF_UP);

        // Debit sender
        senderAccount.setBalance(senderAccount.getBalance().subtract(request.getAmount()));
        accountRepository.save(senderAccount);

        // Credit receiver
        receiverAccount.setBalance(receiverAccount.getBalance().add(convertedAmount));
        accountRepository.save(receiverAccount);

        // Record the transaction
        Transaction transaction = Transaction.builder()
                .senderAccount(senderAccount)
                .receiverAccount(receiverAccount)
                .amount(request.getAmount())
                .type(TransactionType.TRANSFER)
                .status(TransactionStatus.COMPLETED)
                .description(request.getDescription() != null ? request.getDescription() : "Fund Transfer")
                .build();
        transactionRepository.save(transaction);

        return mapToResponse(senderAccount);
    }

    // Get transaction history for the logged-in user
    public List<TransactionResponse> getTransactionHistory(User user) {
        Account account = accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Account not found."));

        List<Transaction> transactions = transactionRepository.findAllByAccountId(account.getId());

        return transactions.stream()
                .map(this::mapToTransactionResponse)
                .collect(Collectors.toList());
    }

    // Cancel transaction
    @Transactional
    public String cancelTransaction(Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found."));

        if (transaction.getStatus() != TransactionStatus.COMPLETED) {
            throw new RuntimeException("Only completed transactions can be cancelled.");
        }

        if (transaction.getType() == TransactionType.DEPOSIT) {
            Account account = transaction.getReceiverAccount();
            account.setBalance(account.getBalance().subtract(transaction.getAmount()));
            accountRepository.save(account);
        } else if (transaction.getType() == TransactionType.TRANSFER) {
            Account sender = transaction.getSenderAccount();
            Account receiver = transaction.getReceiverAccount();

            Currency senderCurrency = sender.getCurrency();
            Currency receiverCurrency = receiver.getCurrency();

            BigDecimal convertedAmount = transaction.getAmount()
                    .multiply(BigDecimal.valueOf(senderCurrency.getRateToInr()))
                    .divide(BigDecimal.valueOf(receiverCurrency.getRateToInr()), 4, java.math.RoundingMode.HALF_UP);

            sender.setBalance(sender.getBalance().add(transaction.getAmount()));
            receiver.setBalance(receiver.getBalance().subtract(convertedAmount));
            accountRepository.save(sender);
            accountRepository.save(receiver);
        }

        transaction.setStatus(TransactionStatus.CANCELLED);
        transactionRepository.save(transaction);

        return "Transaction cancelled successfully. Funds have been refunded.";
    }

    // Helper: map Account entity to AccountResponse DTO
    private AccountResponse mapToResponse(Account account) {
        return AccountResponse.builder()
                .id(account.getId())
                .accountNumber(account.getAccountNumber())
                .balance(account.getBalance())
                .currency(account.getCurrency().name())
                .country(account.getCurrency().getCountry())
                .status(account.getStatus().name())
                .createdAt(account.getCreatedAt())
                .build();
    }

    // Helper: map Transaction entity to TransactionResponse DTO
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
