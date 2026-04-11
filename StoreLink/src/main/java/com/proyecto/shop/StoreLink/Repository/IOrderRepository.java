package com.proyecto.shop.StoreLink.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proyecto.shop.StoreLink.Model.Order;



@Repository
public interface IOrderRepository extends JpaRepository<Order, Integer> {

	// To get all orders for a customer
	List<Order> findByCustomerCustomerId(int customerId);
	
	List<Order> findByCustomerEmail(String email);
}
