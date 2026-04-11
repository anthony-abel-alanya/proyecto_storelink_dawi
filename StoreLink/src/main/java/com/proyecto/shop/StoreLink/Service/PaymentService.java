package com.proyecto.shop.StoreLink.Service;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyecto.shop.StoreLink.Exception.ResourceNotFoundException;
import com.proyecto.shop.StoreLink.Model.Payment;
import com.proyecto.shop.StoreLink.Repository.IPaymentRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    @Autowired
    private IPaymentRepository paymentDao;

    /**
     * Process a new payment transaction.
     * Validates card details, dummy CVV, and OTP.
     * Saves payment record in DB.
     */
    public Payment processPayment(Payment payment) {
        logger.info("Processing payment for Order... ");

        // Basic dummy CVV and OTP validation
        if (!isValidCvv(payment.getCvv())) {
            logger.warn("Payment failed: Invalid CVV!");
            payment.setStatus(Payment.PaymentStatus.FAILED);
            return paymentDao.save(payment);
        }

        if (!isValidOtp(payment.getOtp())) {
            logger.warn("Payment failed: Invalid OTP!");
            payment.setStatus(Payment.PaymentStatus.FAILED);
            return paymentDao.save(payment);
        }

        // Mark payment as successful
        payment.setStatus(Payment.PaymentStatus.SUCCESS);
        payment.setPaymentDate(LocalDateTime.now());
        Payment savedPayment = paymentDao.save(payment);

        logger.info("Payment successful for Order with Payment ID: {}", 
                savedPayment.getId());
        return savedPayment;
    }

    // Fetch all payments.
    public List<Payment> getAllPayments() {
        logger.info("Fetching all payments...");
        return paymentDao.findAll();
    }

    // Fetch payment by ID.
    public Payment getPaymentById(int id) {
        logger.info("Fetching payment with ID: {}", id);
        return paymentDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with ID: " + id));
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
