package com.proyecto.shop.StoreLink.Dto;

import com.proyecto.shop.StoreLink.Model.PromotionStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class CategoryPromotionResponse {
    private Integer id;
    private Integer categoryId;
    private String categoryName;
    private Double discountPercentage;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean active;
    private PromotionStatus status;
}