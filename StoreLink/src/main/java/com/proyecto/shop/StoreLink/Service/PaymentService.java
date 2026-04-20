package com.proyecto.shop.StoreLink.Service;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyecto.shop.StoreLink.Dto.PaymentResponse;
import com.proyecto.shop.StoreLink.Exception.ResourceNotFoundException;
import com.proyecto.shop.StoreLink.Model.Payment;
import com.proyecto.shop.StoreLink.Repository.IPaymentRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    @Autowired
    private IPaymentRepository paymentDao;

    /**
     * Process a new payment transaction.
     * Validates card details, dummy CVV, and OTP.
     * Saves payment record in DB.
     * Returns PaymentResponse without sensitive data.
     */
    public PaymentResponse processPayment(Payment payment) {
        logger.info("Processing payment for Order... ");

        // Basic dummy CVV and OTP validation
        if (!isValidCvv(payment.getCvv())) {
            logger.warn("Payment failed: Invalid CVV!");
            payment.setStatus(Payment.PaymentStatus.FAILED);
            return mapToResponse(paymentDao.save(payment));
        }

        if (!isValidOtp(payment.getOtp())) {
            logger.warn("Payment failed: Invalid OTP!");
            payment.setStatus(Payment.PaymentStatus.FAILED);
            return mapToResponse(paymentDao.save(payment));
        }

        // Mark payment as successful
        payment.setStatus(Payment.PaymentStatus.SUCCESS);
        payment.setPaymentDate(LocalDateTime.now());
        Payment savedPayment = paymentDao.save(payment);

        logger.info("Payment successful for Order with Payment ID: {}", 
                savedPayment.getId());
        return mapToResponse(savedPayment);
    }

    // Fetch all payments as PaymentResponse list (without sensitive data).
    public List<PaymentResponse> getAllPayments() {
        logger.info("Fetching all payments...");
        return paymentDao.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Fetch payment by ID as PaymentResponse (without sensitive data).
    public PaymentResponse getPaymentById(int id) {
        logger.info("Fetching payment with ID: {}", id);
        return paymentDao.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with ID: " + id));
    }

    // Map Payment entity to PaymentResponse (excludes sensitive fields: cvv, otp, full cardNumber)
    private PaymentResponse mapToResponse(Payment payment) {
        PaymentResponse response = new PaymentResponse();
        response.setId(payment.getId());
        response.setCardholderName(payment.getCardholderName());
        
        // Mask card number - show only last 4 digits
        if (payment.getCardNumber() != null && payment.getCardNumber().length() >= 4) {
            response.setMaskedCardNumber("****-****-****-" + payment.getCardNumber().substring(12));
        } else {
            response.setMaskedCardNumber("****-****-****-****");
        }
        
        response.setExpiryMonth(payment.getExpiryMonth());
        response.setExpiryYear(payment.getExpiryYear());
        response.setAmount(payment.getAmount());
        response.setStatus(payment.getStatus() != null ? payment.getStatus().name() : "UNKNOWN");
        response.setPaymentDate(payment.getPaymentDate());
        
        // Note: cvv, otp, and full cardNumber are NOT included in the response
        return response;
    }

    // Dummy CVV validation
    private boolean isValidCvv(String cvv) {
        return cvv != null && cvv.matches("^[0-9]{3}$");
    }

    // Dummy OTP validation
    private boolean isValidOtp(String otp) {
        return otp != null && otp.matches("^[0-9]{6}$");
    }
}
