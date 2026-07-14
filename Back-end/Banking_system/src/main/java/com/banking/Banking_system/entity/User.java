package com.banking.Banking_system.entity;


import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

//import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isApproved = false;

    @Column
    private String country;

    @Column
    private String otp;

    @Column
    private LocalDateTime otpExpiry;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
	
    
//    userDetails methods
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities(){
    	return List.of(new SimpleGrantedAuthority("ROLE_"+role.name()));
    	
    }
    @Override public String getUsername() { return email;}
    @Override public boolean isAccountNonExpired(){ return true;}
    @Override public boolean isAccountNonLocked(){ return true;}
    @Override public boolean isCredentialsNonExpired(){ return true;}
    @Override public boolean isEnabled(){ return true;}


	@Override
	public String getPassword() {
		return password;
	}

}
