package com.banking.Banking_system.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {
    private Long id;
    private String senderAccountNumber;
    private String receiverAccountNumber;
    private BigDecimal amount;
    private BigDecimal convertedAmount;
    private String senderCurrency;
    private String receiverCurrency;
    private String checkNumber;
    private String type;
    private String status;
    private String description;
    private LocalDateTime createdAt;
}
