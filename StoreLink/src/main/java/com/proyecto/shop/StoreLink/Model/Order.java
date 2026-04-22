package com.proyecto.shop.StoreLink.Model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private int orderId;

    // Relationship: Many orders belong to one customer
    
    @ManyToOne
    @JoinColumn(name = "customer_id")
    @JsonIgnoreProperties("orders") 
    private Customer customer;
    
    @OneToOne
    @JoinColumn(name = "payment_id")
    @JsonIgnore
    private Payment paymentId;

    @Column(name = "order_date", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    @NotNull(message = "Order date can't be null!")
    private LocalDateTime orderDate;

    @Column(name = "delivery_address")
    @Size(message = "Address length can't be more than 255 characters!")
    @NotBlank(message = "Delivery address can't be empty!")
    private String deliveryAddress;

    @Column(name = "total_amount", precision = 10, scale = 2)
    @NotNull(message = "Total amount can't be null!")
    @Positive(message = "Total amount can't be 0 or less than 0!")
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_status", length = 20)
    @NotNull(message = "Order status can't be empty!")
    private OrderStatus orderStatus = OrderStatus.PENDING;

    // One-to-Many mapping with OrderItems
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<OrderItem> orderItems;

    // Enum representing order status values from the SQL ENUM
    public enum OrderStatus {
        PENDING, PROCESSING, DELIVERED, CANCELLED
    }
}

