package com.banking.Banking_system.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.banking.Banking_system.entity.Account;
import com.banking.Banking_system.entity.AccountType;

public interface AccountRepository extends JpaRepository<Account, Long>{
	Optional<Account> findByAccountNumber(String accountNumber);
	Optional<Account> findByUserId(Long userId);
	boolean existsByAccountNumber(String accountNumber);
	List<Account> findByStatus(AccountType status);

}
