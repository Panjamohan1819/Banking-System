package com.banking.Banking_system.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data

public class RegisterRequest {
	@NotBlank(message = " Full Name is required")
	private String fullName;
	
	@Email(message = " Enter a valid Email")
	@NotBlank(message = "Email is required")
	private String email;
	
	@NotBlank(message = "password is required")
	@Size(min = 8, message = "Password must be at least 8 characters")
	private String password;
	
	// Add validation
	@NotBlank
	@Pattern(regexp = "^[6-9]\\d{9}$",
	         message = "Enter a valid 10-digit phone number")
	private String phoneNumber;
	
	@NotBlank(message = "Country is required")
	private String country;
	
	

}
