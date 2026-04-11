package com.proyecto.shop.StoreLink.Dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

	@NotNull(message = "Email is required")
    private String email;
	
	@NotNull(message = "Password is required")
    private String password;

}