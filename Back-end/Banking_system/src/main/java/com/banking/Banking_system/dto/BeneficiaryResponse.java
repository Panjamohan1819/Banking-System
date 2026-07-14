package com.banking.Banking_system.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BeneficiaryResponse {
    private Long id;
    private String beneficiaryName;
    private String accountNumber;
    private String nickname;
    private LocalDateTime createdAt;
}
