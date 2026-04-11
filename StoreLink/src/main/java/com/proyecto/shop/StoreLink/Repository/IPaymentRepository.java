package com.proyecto.shop.StoreLink.Repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proyecto.shop.StoreLink.Model.Payment;

import java.util.List;

@Repository
public interface IPaymentRepository extends JpaRepository<Payment, Integer> {

    // Find all successful payments
    List<Payment> findByStatus(Payment.PaymentStatus status);

    // Find all payments by cardholder name
    List<Payment> findByCardholderNameIgnoreCase(String cardholderName);
}
