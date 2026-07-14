package com.banking.Banking_system.configure;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.banking.Banking_system.entity.Role;
import com.banking.Banking_system.entity.User;
import com.banking.Banking_system.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AdminDataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail("panjamohan1819@gmail.com")) {
            User admin = User.builder()
                    .fullName("System Admin")
                    .email("panjamohan1819@gmail.com")
                    .password(passwordEncoder.encode("Admin@1819"))
                    .phoneNumber("9999999999")
                    .role(Role.ADMIN)
                    .isApproved(true)
                    .country("India")
                    .build();
            userRepository.save(admin);
            System.out.println("Admin user created: panjamohan1819@gmail.com / Admin@1819");
        }
    }
}
