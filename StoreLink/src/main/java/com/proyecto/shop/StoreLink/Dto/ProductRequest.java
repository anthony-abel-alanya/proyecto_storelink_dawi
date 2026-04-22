package com.proyecto.shop.StoreLink.Dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ProductRequest {

    @NotBlank(message = "Product name can't be blank!")
    @Size(max = 100, message = "Product name can't be more than 100 characters!")
    private String productName;

    @Size(max = 255, message = "Description can't be more than 255 characters!")
    private String description;

    @Size(max = 100, message = "Author can't be more than 100 characters!")
    private String author;

    @Positive(message = "Price can't be 0 or less!")
    @NotNull(message = "Price can't be null!")
    private BigDecimal price;

    @NotNull(message = "Quantity can't be null!")
    private int quantity;

    @NotBlank(message = "Image URL can't be blank!")
    @Size(max = 255, message = "Image URL can't be more than 255 characters!")
    private String imageUrl;

    @NotNull(message = "Category ID is required")
    private Integer categoryId;
}