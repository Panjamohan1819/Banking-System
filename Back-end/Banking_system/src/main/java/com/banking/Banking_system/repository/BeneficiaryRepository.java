package com.banking.Banking_system.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.banking.Banking_system.entity.Beneficiary;

public interface BeneficiaryRepository extends JpaRepository<Beneficiary, Long>{
	List<Beneficiary> findByUserId(Long userId);
	Optional<Beneficiary> findByUserIdAndAccountNumber(Long userId, String accountNumber);
	boolean existsByUserIdAndAccountNumber(Long userId, String accountNumber);
	

}
