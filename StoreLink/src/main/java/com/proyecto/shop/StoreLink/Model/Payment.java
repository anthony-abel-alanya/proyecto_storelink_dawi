package com.proyecto.shop.StoreLink.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Integer id;

    @NotBlank(message = "Cardholder name is required.")
    @Size(max = 100, message = "Cardholder name cannot exceed 100 characters.")
    @Column(name = "cardholder_name", nullable = false, length = 100)
    private String cardholderName;

    @NotBlank(message = "Card number is required.")
    @Pattern(regexp = "^[0-9]{16}$", message = "Card number must be 16 digits.")
    @Column(name = "card_number", nullable = false, length = 16)
    @Transient
    private String cardNumber;

    @NotBlank(message = "Expiry month is required.")
    @Pattern(regexp = "^(0[1-9]|1[0-2])$", message = "Expiry month must be between 01 and 12.")
    @Column(name = "expiry_month", nullable = false, length = 2)
    @Transient
    private String expiryMonth;

    @NotBlank(message = "Expiry year is required.")
    @Pattern(regexp = "^[0-9]{2}$", message = "Expiry year must be 2 digits (e.g., 26).")
    @Column(name = "expiry_year", nullable = false, length = 2)
    @Transient
    private String expiryYear;

    @NotBlank(message = "CVV is required.")
    @Pattern(regexp = "^[0-9]{3}$", message = "CVV must be 3 digits.")
    @Transient // CVV should never be persisted for security reasons
    private String cvv;

    @NotBlank(message = "OTP is required for transaction verification.")
    @Pattern(regexp = "^[0-9]{6}$", message = "OTP must be 6 digits.")
    @Transient // OTP is used only for dummy verification, not stored
    private String otp;

    @NotNull(message = "Amount cannot be null.")
    @DecimalMin(value = "0.01", message = "Payment amount must be greater than zero.")
    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "payment_status", nullable = false)
    @Enumerated(EnumType.STRING)
    private PaymentStatus status = PaymentStatus.PENDING;

    @Column(name = "payment_date", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime paymentDate;

    public enum PaymentStatus {
        PENDING,
        SUCCESS,
        FAILED
    }
}
