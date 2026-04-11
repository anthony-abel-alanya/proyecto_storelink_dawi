package com.proyecto.shop.StoreLink.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyecto.shop.StoreLink.Exception.ResourceNotFoundException;
import com.proyecto.shop.StoreLink.Model.OrderItem;
import com.proyecto.shop.StoreLink.Repository.IOrderItemRepository;



@Service
public class OrderItemService {

    @Autowired
    private IOrderItemRepository orderItemDao;

    // Create a new order item
    public OrderItem createOrderItem(OrderItem orderItem) {
        return orderItemDao.save(orderItem);
    }

    // Get all order items
    public List<OrderItem> getAllOrderItems() {
        return orderItemDao.findAll();
    }

    // Get order item by ID
    public Optional<OrderItem> getOrderItemById(int id) {
        return orderItemDao.findById(id);
    }

    // Get all items for a specific order
    public List<OrderItem> getItemsByOrderId(int orderId) {
        return orderItemDao.findByOrderOrderId(orderId);
    }

    // Get all items for a specific product
    public List<OrderItem> getItemsByProductId(int productId) {
        return orderItemDao.findByProductProductId(productId);
    }

    // Update an order item
    public OrderItem updateOrderItem(int id, OrderItem updatedItem) {
        return orderItemDao.findById(id).map(item -> {
            item.setOrder(updatedItem.getOrder());
            item.setProduct(updatedItem.getProduct());
            item.setQuantity(updatedItem.getQuantity());
            item.setProductPrice(updatedItem.getProductPrice());
            // subtotal is automatically recalculated by @PreUpdate/@PrePersist
            return orderItemDao.save(item);
        }).orElseThrow(() -> new ResourceNotFoundException("OrderItem not found with id " + id));
    }

    // Delete an order item by ID
    public void deleteOrderItem(int id) {
        if (!orderItemDao.existsById(id)) {
            throw new ResourceNotFoundException("OrderItem not found with id " + id);
        }
        orderItemDao.deleteById(id);
    }
}

