package com.proyecto.shop.StoreLink.Model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "customers")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private Integer customerId;

    @Column(name = "name")
    @NotBlank(message = "Name can't be blank!")
    @Size(max = 100, message = "Name can't be more than 100 characters!")
    private String name;

    @Column(name = "email", unique = true)
    @Size(max = 100, message = "Email can't be more than 100 characters!")
    @NotBlank(message = "Email can't be blank!")
    private String email;

    @Column(name = "phone")
    @NotBlank(message = "Phone number can't be blank!")
    @Size(min = 9, max = 9, message = "Phone number should 9 digits!")
    private String phone;

    @Column(name = "password", length = 255)
    @NotBlank(message = "Password can't be blank!")
    @Size(min = 8, max = 255, message = "Password must be at least 8 characters and not more than 255 characters!")
    private String password;

    // One-to-Many mapping with orders 
    //@OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    //@JsonIgnore
    //private List<OrderEntity> orders;

    
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("customer") 
    private List<Order> orders;
}

