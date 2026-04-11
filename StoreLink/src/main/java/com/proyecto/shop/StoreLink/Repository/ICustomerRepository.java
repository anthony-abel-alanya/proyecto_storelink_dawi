package com.proyecto.shop.StoreLink.Repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proyecto.shop.StoreLink.Model.Customer;



@Repository
public interface ICustomerRepository extends JpaRepository<Customer, Integer> {
	
	// Search customer by email 
	Customer findByEmail(String email);


}
