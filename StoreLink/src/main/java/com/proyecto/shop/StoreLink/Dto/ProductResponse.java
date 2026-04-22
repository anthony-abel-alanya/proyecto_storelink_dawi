package com.proyecto.shop.StoreLink.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ProductResponse {

    private Integer productId;
    private String productName;
    private String description;
    private String author;
    private BigDecimal price;
    private int quantity;
    private String imageUrl;
    private Integer categoryId;
    private String categoryName;
}