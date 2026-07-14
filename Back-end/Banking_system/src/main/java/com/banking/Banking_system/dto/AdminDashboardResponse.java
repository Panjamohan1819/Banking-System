package com.banking.Banking_system.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {
    private long totalUsers;
    private long pendingApprovals;
    private long totalAccounts;
    private long totalTransactions;
    private List<UserResponse> recentPendingUsers;
}
