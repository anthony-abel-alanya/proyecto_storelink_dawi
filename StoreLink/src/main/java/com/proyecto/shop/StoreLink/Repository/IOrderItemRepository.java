package com.proyecto.shop.StoreLink.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proyecto.shop.StoreLink.Model.OrderItem;



@Repository
public interface IOrderItemRepository extends JpaRepository<OrderItem, Integer> {

    // Find all items for a specific order
    List<OrderItem> findByOrderOrderId(int orderId);

    // Find all items for a specific product
    List<OrderItem> findByProductProductId(int productId);
}
