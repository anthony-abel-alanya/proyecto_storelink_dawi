package com.proyecto.shop.StoreLink.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user_details")
public class UserInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "password")
    private String password;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_info_roles_details",
        joinColumns = @JoinColumn(name = "id"),
        inverseJoinColumns = @JoinColumn(name = "role_id") // match with RoleDetails's roleId
    )
    private List<RoleDetails> allRoles;
    
	/*
	 * You're telling JPA:
	 * 
	 * Each user can have multiple roles Each role can belong to multiple users So
	 * JPA needs a third table to store this relationship — that’s
	 * user_info_roles_details. JPA creates that table on it's own.
	 */
}