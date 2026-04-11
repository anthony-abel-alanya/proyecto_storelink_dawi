package com.proyecto.shop.StoreLink.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyecto.shop.StoreLink.Dto.OrderItemRequest;
import com.proyecto.shop.StoreLink.Dto.OrderRequest;
import com.proyecto.shop.StoreLink.Exception.InvalidInputException;
import com.proyecto.shop.StoreLink.Exception.ResourceNotFoundException;
import com.proyecto.shop.StoreLink.Model.Customer;
import com.proyecto.shop.StoreLink.Model.Order;
import com.proyecto.shop.StoreLink.Model.OrderItem;
import com.proyecto.shop.StoreLink.Model.Payment;
import com.proyecto.shop.StoreLink.Model.Product;
import com.proyecto.shop.StoreLink.Repository.ICustomerRepository;
import com.proyecto.shop.StoreLink.Repository.IOrderRepository;
import com.proyecto.shop.StoreLink.Repository.IPaymentRepository;
import com.proyecto.shop.StoreLink.Repository.IProductRepository;



@Service
public class OrderService {

    @Autowired
    private IOrderRepository orderDao;
    
    @Autowired
    private ICustomerRepository customerDao;

    @Autowired
    private IProductRepository productDao;
    
    @Autowired
    private IPaymentRepository paymentDao;

    // Create a new order
    // Since placing order is a transaction, use @Transactional
    @Transactional
    public Order createOrder(OrderRequest request) {
        Customer customer = customerDao.findByEmail(request.getCustomerEmail());

        Order order = new Order();
        order.setCustomer(customerDao.findById(customer.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with email: " + request.getCustomerEmail())));
        
        Payment payment = paymentDao.findById(request.getPaymentId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with ID: " + request.getPaymentId()));
        order.setPaymentId(payment);
        
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setTotalAmount(request.getTotalAmount());
        order.setOrderDate(LocalDateTime.now());

        List<OrderItem> items = new ArrayList<>();

        for (OrderItemRequest itemRequest : request.getOrderItems()) {
            Product product = productDao.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + itemRequest.getProductId()));

            // Check if enough stock is available
            if (product.getQuantity() < itemRequest.getQuantity()) {
                throw new InvalidInputException(
                    "Not enough stock for product: " + product.getProductName()
                );
            }

            // Reduce product quantity
            product.setQuantity(product.getQuantity() - itemRequest.getQuantity());
            productDao.save(product); // save updated product stock

            // Create order item
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemRequest.getQuantity());
            item.setProductPrice(itemRequest.getProductPrice());
            items.add(item);
        }

        order.setOrderItems(items);
        return orderDao.save(order);
    }

    // Get all orders
    public List<Order> getAllOrders() {
        return orderDao.findAll();
    }

    // Get order by ID
    public Optional<Order> getOrderById(int id) {
        return orderDao.findById(id);
    }

    // Get all orders for a customer
    public List<Order> getOrdersByCustomerId(int customerId) {
        return orderDao.findByCustomerCustomerId(customerId);
    }

    // Update order status
    public Order updateOrderStatus(int orderId, String orderStatus) {
        // Find the order by ID
        Order order = orderDao.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id " + orderId));

        // Convert string to enum and validate (because entity uses enum)
        Order.OrderStatus newOrderStatus;
        try {
        	newOrderStatus = Order.OrderStatus.valueOf(orderStatus.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidInputException("Invalid order status: " + orderStatus);
        }

        // Set the new status and save
        order.setOrderStatus(newOrderStatus);
        return orderDao.save(order);
    }


    // Delete order by ID
    public void deleteOrder(int id) {
        if (!orderDao.existsById(id)) {
            throw new ResourceNotFoundException("Order not found with id " + id);
        }
        orderDao.deleteById(id);
    }
    
    public List<Order> getOrdersByCustomerEmail(String email) {
        return orderDao.findByCustomerEmail(email);
    }

}
