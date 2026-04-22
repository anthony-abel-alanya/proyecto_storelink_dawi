package com.proyecto.shop.StoreLink.Model;

import java.math.BigDecimal;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Integer productId;

    @Column(name = "product_name", length = 100)
    @NotBlank(message = "Product name can't be blank!")
    @Size(max = 100, message = "Product name can't be more than 100 characters!")
    private String productName;

    @Column(name = "description", length = 255)
    @Size(max = 255, message = "Description can't be more than 255 characters!")
    private String description;

    @Column(name = "author", length = 100)
    @Size(max = 100, message = "Author can't be more than 100 characters!")
    private String author;

    @Column(name = "price", precision = 10, scale = 2)
    @Positive(message = "Price can't be 0 or less!")
    @NotNull(message = "Price can't be null!")
    private BigDecimal price;

    @Column(name = "quantity", columnDefinition = "INT DEFAULT 0")
    @NotNull(message = "Quantity can't be null!")
    @Min(value = 0, message = "Quantity can't be less than 0!")
    private int quantity;
    
    /*@Column(name = "category", length = 100)
    @NotBlank(message = "Product category can't be blank!")
    @Size(max = 100, message = "Product category can't be more than 100 characters!")
    private String category;*/

    @Column(name = "image_url", length = 255)
    @Size(max = 255, message = "Image URL can't be more than 255 characters!")
    @NotBlank(message = "Image URL can't be blank!")
    private String imageUrl;
    
    //JOIN
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false) 
    @NotNull(message = "Product category is required")
    private Category category;

    // One-to-Many mapping with OrderItems 
    // @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    // @JsonBackReference
    // private List<OrderItemEntity> orderItems;
}
