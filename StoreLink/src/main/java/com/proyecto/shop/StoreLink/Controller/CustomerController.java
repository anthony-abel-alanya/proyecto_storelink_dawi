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

import com.proyecto.shop.StoreLink.Model.Customer;
import com.proyecto.shop.StoreLink.Model.UserInfo;
import com.proyecto.shop.StoreLink.Service.CustomerService;
import com.proyecto.shop.StoreLink.Exception.ResourceNotFoundException;




@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private static final Logger logger = LoggerFactory.getLogger(CustomerController.class);

    @Autowired
    private CustomerService customerService;

    // Create new customer record
    @PostMapping
    public ResponseEntity<Customer> createCustomer(@Valid @RequestBody Customer customer) {
        logger.info("Creating new customer...");
        Customer savedCustomer = customerService.createCustomer(customer);
        logger.info("Customer created successfully with ID: {}", savedCustomer.getCustomerId());
        return ResponseEntity.ok(savedCustomer); // HTTP 200 OK
    }

    // Get all customers
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping
    public ResponseEntity<?> getAllCustomers() {
        logger.info("Fetching all customers...");
        List<Customer> customers = customerService.getAllCustomers();

        if (customers.isEmpty()) {
            logger.info("No customers found in the database.");
            return ResponseEntity.ok(Collections.emptyList()); // 200 with empty list
        }

        logger.info("Found {} customers.", customers.size());
        return ResponseEntity.ok(customers);
    }

    // Get customer by ID
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable int id) {
        logger.info("Fetching customer with ID: {}", id);
        return customerService.getCustomerById(id)
                .map(customer -> {
                    logger.info("Customer found with ID: {}", id);
                    return ResponseEntity.ok(customer);
                })
                .orElseThrow(() -> {
                    logger.warn("Customer not found with ID: {}", id);
                    return new ResourceNotFoundException("Customer not found with ID: " + id);
                });
    }

    // Update customer details (user can update their details)
    @PreAuthorize("hasAuthority('CUSTOMER')")
    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable int id,
                                                         @Valid @RequestBody Customer updatedCustomer) {
        logger.info("Updating customer with ID: {}", id);
        Customer customer = customerService.updateCustomer(id, updatedCustomer);
        logger.info("Customer with ID {} updated successfully.", id);
        return ResponseEntity.ok(customer);
    }

    // Delete customer (user can delete their own account)
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('CUSTOMER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable int id) {
        logger.info("Deleting customer with ID: {}", id);
        customerService.deleteCustomer(id);
        logger.info("Customer deleted successfully with ID: {}", id);
        return ResponseEntity.noContent().build(); // 204 No Content
    }
    
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('CUSTOMER')")
    @GetMapping("/email/{email}")
    public ResponseEntity<Customer> getCustomerByEmail(@PathVariable String email) {
        logger.info("Fetching customer with email: {}", email);

        return customerService.getCustomerByEmail(email)
                .map(customer -> {
                    logger.info("Customer found with email: {}", email);
                    return ResponseEntity.ok(customer);
                })
                .orElseThrow(() -> {
                    logger.warn("Customer not found with email: {}", email);
                    return new ResourceNotFoundException("Customer not found with email: " + email);
                });
    }

    // Get all users (excluding admin) - para gestión de cuentas
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/users/list")
    public ResponseEntity<List<UserInfo>> getAllUsersExcludingAdmin() {
        logger.info("Fetching all users excluding admin...");
        List<UserInfo> users = customerService.getAllUsersExcludingAdmin();
        logger.info("Found {} users (excluding admin).", users.size());
        return ResponseEntity.ok(users);
    }

    // Toggle user enabled status (bloquear/desbloquear)
    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/users/{id}/toggle-status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable int id) {
        logger.info("Toggling user status for ID: {}", id);
        try {
            UserInfo user = customerService.toggleUserStatus(id);
            logger.info("User status toggled successfully for ID: {}", id);
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            logger.warn("Error toggling user status: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (ResourceNotFoundException e) {
            logger.warn("User not found: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

}
