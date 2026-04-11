package com.proyecto.shop.StoreLink.Controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.proyecto.shop.StoreLink.Model.Payment;
import com.proyecto.shop.StoreLink.Service.PaymentService;

import jakarta.validation.Valid;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    @Autowired
    private PaymentService paymentService;

    // Process a new payment
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('CUSTOMER')")
    @PostMapping
    public ResponseEntity<Payment> processPayment(@RequestBody @Valid Payment paymentRequest) {
        logger.info("Received payment request for Order");
        Payment processedPayment = paymentService.processPayment(paymentRequest);
        logger.info("Payment processed with status: {} for Order", 
                processedPayment.getStatus());
        return ResponseEntity.ok(processedPayment);
    }

    // Get all payments
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        logger.info("Fetching all payments...");
        List<Payment> payments = paymentService.getAllPayments();

        if (payments.isEmpty()) {
            logger.info("No payments found.");
            return ResponseEntity.ok(Collections.emptyList());
        }

        logger.info("Found {} payments.", payments.size());
        return ResponseEntity.ok(payments);
    }

    // Get payment by ID
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('CUSTOMER')")
    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable int id) {
        logger.info("Fetching payment with ID: {}", id);
        Payment payment = paymentService.getPaymentById(id);
        logger.info("Payment found with ID: {}", id);
        return ResponseEntity.ok(payment);
    }

}
