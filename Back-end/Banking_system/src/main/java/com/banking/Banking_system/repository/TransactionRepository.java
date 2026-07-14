package com.banking.Banking_system.repository;



import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.banking.Banking_system.entity.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long>{
	
	@Query("""
			SELECT t 
			FROM Transaction t 
			WHERE t.senderAccount.id = :accountId 
			OR t.receiverAccount.id = :accountId
			ORDER BY t.createdAt DESC
			""")
	List<Transaction> findAllByAccountId(@Param("accountId") Long accountId);
	
	
	List<Transaction> findBySenderAccountIdOrderByCreatedAtDesc(Long accountId);
	
	
	List<Transaction> findByReceiverAccountIdOrderByCreatedAtDesc(Long accountId);
	
	boolean existsByCheckNumber(String checkNumber);
	
	List<Transaction> findAllByOrderByCreatedAtDesc();
}
