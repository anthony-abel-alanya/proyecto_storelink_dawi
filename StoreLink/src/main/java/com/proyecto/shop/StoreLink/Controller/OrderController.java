package com.proyecto.shop.StoreLink.Controller;

import java.util.Collections;
import java.util.List;

import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.proyecto.shop.StoreLink.Model.Order;
import com.proyecto.shop.StoreLink.Service.OrderService;
import com.proyecto.shop.StoreLink.Dto.OrderRequest;
import com.proyecto.shop.StoreLink.Exception.ResourceNotFoundException;



@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    @Autowired
    private OrderService orderService;

    // Create new order
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('CUSTOMER')")
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody @Valid OrderRequest orderRequest) {
        logger.info("Creating a new order...");
        Order savedOrder = orderService.createOrder(orderRequest);
        logger.info("Order created successfully with ID: {}", savedOrder.getOrderId());
        return ResponseEntity.ok(savedOrder);
    }


    // Get all orders
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping
    public ResponseEntity<?> getAllOrders() {
        logger.info("Fetching all orders...");
        List<Order> orders = orderService.getAllOrders();

        if (orders.isEmpty()) {
            logger.info("No orders found.");
            return ResponseEntity.ok(Collections.emptyList());
        }

        logger.info("Found {} orders.", orders.size());
        return ResponseEntity.ok(orders);
    }

    
    // Get order by ID 
    // If you want to get order by order ID of a particular customer with customer ID, do separate method
    // Otherwise customer would be able to access other's orders also
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable int id) {
        logger.info("Fetching order with ID: {}", id);
        return orderService.getOrderById(id)
                .map(order -> {
                    logger.info("Order found with ID: {}", id);
                    return ResponseEntity.ok(order);
                })
                .orElseThrow(() -> {
                    logger.warn("Order not found with ID: {}", id);
                    return new ResourceNotFoundException("Order not found with ID: " + id);
                });
    }

     // Get all orders for a specific customer
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('CUSTOMER')")
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Order>> getOrdersByCustomerId(@PathVariable int customerId) {
        logger.info("Fetching orders for customer ID: {}", customerId);
        List<Order> orders = orderService.getOrdersByCustomerId(customerId);

        if (orders.isEmpty()) {
            logger.info("No orders found for customer ID: {}", customerId);
            return ResponseEntity.ok(Collections.emptyList());
        }

        logger.info("Found {} orders for customer ID: {}", orders.size(), customerId);
        return ResponseEntity.ok(orders);
    }

    // Update order status
    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable int id,
                                                         @RequestParam String orderStatus) {
        logger.info("Updating order status for order ID: {} to '{}'", id, orderStatus);
        Order updatedOrder = orderService.updateOrderStatus(id, orderStatus);
        logger.info("Order ID {} status updated to '{}'", id, updatedOrder.getOrderStatus());
        return ResponseEntity.ok(updatedOrder);
    }
    
    // Update order status to cancelled by customer
    @PreAuthorize("hasAuthority('CUSTOMER')")
    @PutMapping("/{id}/cancel")
    public ResponseEntity<Order> cancelOrder(@PathVariable int id) {
        logger.info("Cancelling order for order ID: {} ", id);
        Order updatedOrder = orderService.updateOrderStatus(id, "CANCELLED");
        logger.info("Order ID {} status updated to CANCELLED", id);
        return ResponseEntity.ok(updatedOrder);
    }

    // Delete an order
    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable int id) {
        logger.info("Deleting order with ID: {}", id);
        orderService.deleteOrder(id);
        logger.info("Order deleted successfully with ID: {}", id);
        return ResponseEntity.noContent().build(); // 204 No Content
    }
    
    // Get orders by customer  email
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('CUSTOMER')")
    @GetMapping("/customer/email/{email}")
    public ResponseEntity<List<Order>> getOrdersByCustomerEmail(@PathVariable String email) {
        logger.info("Fetching orders for customer email: {}", email);
        List<Order> orders = orderService.getOrdersByCustomerEmail(email);

        if (orders.isEmpty()) {
            logger.info("No orders found for customer email: {}", email);
            return ResponseEntity.ok(Collections.emptyList());
        }

        logger.info("Found {} orders for customer email: {}", orders.size(), email);
        return ResponseEntity.ok(orders);
    }
}
