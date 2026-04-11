package com.proyecto.shop.StoreLink.Dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {

	private int paymentId;
    private String customerEmail;
    private String deliveryAddress;
    private BigDecimal totalAmount;
    // We don't ask order status because when order is placed, status is PENDING by default

    private List<OrderItemRequest> orderItems;
}
