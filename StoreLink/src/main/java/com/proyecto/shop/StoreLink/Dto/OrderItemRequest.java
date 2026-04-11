package com.proyecto.shop.StoreLink.Dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemRequest {

    private int productId;
    private int quantity;
    private BigDecimal productPrice;
}

