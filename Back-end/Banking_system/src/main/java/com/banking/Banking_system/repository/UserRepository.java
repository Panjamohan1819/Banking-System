package com.banking.Banking_system.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.banking.Banking_system.entity.Role;
import com.banking.Banking_system.entity.User;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long>{
	Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String phoneNumber);
    
    List<User> findByIsApprovedFalse();
    long countByRole(Role role);
    List<User> findByRole(Role role);
}
