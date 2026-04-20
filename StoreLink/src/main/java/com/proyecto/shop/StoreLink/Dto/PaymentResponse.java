package com.proyecto.shop.StoreLink.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class PaymentResponse {

    private Integer id;
    private String cardholderName;
    private String maskedCardNumber;
    private String expiryMonth;
    private String expiryYear;
    private BigDecimal amount;
    private String status;
    private LocalDateTime paymentDate;
}