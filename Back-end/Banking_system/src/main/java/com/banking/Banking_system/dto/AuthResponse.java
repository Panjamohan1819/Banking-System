package com.banking.Banking_system.dto;

//import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
	private String token;
	
	private String email;
	private String fullName;
	private String role;
	private String message;
}
