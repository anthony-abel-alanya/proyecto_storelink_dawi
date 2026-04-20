package com.proyecto.shop.StoreLink.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class AuthResponse {

    private String token;
    private String email;
    private List<String> roles;
}