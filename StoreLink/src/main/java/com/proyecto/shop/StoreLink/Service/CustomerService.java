package com.proyecto.shop.StoreLink.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.proyecto.shop.StoreLink.Exception.ResourceNotFoundException;
import com.proyecto.shop.StoreLink.Model.Customer;
import com.proyecto.shop.StoreLink.Model.RoleDetails;
import com.proyecto.shop.StoreLink.Model.UserInfo;
import com.proyecto.shop.StoreLink.Repository.ICustomerRepository;
import com.proyecto.shop.StoreLink.Repository.IRoleDetailsRepository;
import com.proyecto.shop.StoreLink.Repository.IUserInfoRepository;




@Service
public class CustomerService {

    @Autowired
    private ICustomerRepository customerDao;
    
    @Autowired
    private IUserInfoRepository userInfoDao;

    @Autowired
    private IRoleDetailsRepository roleDetailsDao;

    @Autowired
    private PasswordEncoder passwordEncoder; // Spring Security's encoder

    // Create a new customer and give them CUSTOMER role (basically sign-up)
    public Customer createCustomer(Customer customer) {
    	//Always encrypt password
    	customer.setPassword(passwordEncoder.encode(customer.getPassword()));

        // Find the CUSTOMER role
        RoleDetails customerRole = roleDetailsDao.findByRoleName("CUSTOMER")
                .orElseThrow(() -> new ResourceNotFoundException("Role CUSTOMER not found in DB!"));

    	// Save the customer in the customers table only if password encryption and role is successful
        // Otherwise customer would get saved without entry in UserInfo table if role is not found
        Customer savedCustomer = customerDao.save(customer);
        
        // Create corresponding user record in users table
        UserInfo user = new UserInfo();
        user.setEmail(savedCustomer.getEmail());
        user.setPassword(savedCustomer.getPassword());
        user.setAllRoles(List.of(customerRole));
        userInfoDao.save(user);

        return savedCustomer;
    }

    // Get all customers
    public List<Customer> getAllCustomers() {
        return customerDao.findAll();
    }

    // Get customer by ID
    public Optional<Customer> getCustomerById(int id) {
        return customerDao.findById(id);
    }

    // Update customer
    public Customer updateCustomer(int id, Customer updatedCustomer) {
        return customerDao.findById(id).map(customer -> {
            customer.setName(updatedCustomer.getName());
            customer.setEmail(updatedCustomer.getEmail());
            customer.setPhone(updatedCustomer.getPhone());
            customer.setPassword(updatedCustomer.getPassword());
            return customerDao.save(customer);
        }).orElseThrow(() -> new ResourceNotFoundException("Customer not found with id " + id));
    }

    // Delete customer by ID
    public void deleteCustomer(int id) {
        if (!customerDao.existsById(id)) {
            throw new ResourceNotFoundException("Customer not found with id " + id);
        }
        customerDao.deleteById(id);
    }
    
    // Find customer by email
    public Optional<Customer> getCustomerByEmail(String email) {
        return Optional.ofNullable(customerDao.findByEmail(email));
    }

}
