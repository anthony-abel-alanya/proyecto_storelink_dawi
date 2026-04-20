package com.proyecto.shop.StoreLink.Dto;

import java.time.LocalDateTime;

public class CategoryPromotionRequest {
    private int categoryId;
    private double discountPercentage;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private boolean active;

    public CategoryPromotionRequest() {}

    public CategoryPromotionRequest(int categoryId, double discountPercentage, 
                                    LocalDateTime startDate, LocalDateTime endDate, boolean active) {
        this.categoryId = categoryId;
        this.discountPercentage = discountPercentage;
        this.startDate = startDate;
        this.endDate = endDate;
        this.active = active;
    }

    public int getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(int categoryId) {
        this.categoryId = categoryId;
    }

    public double getDiscountPercentage() {
        return discountPercentage;
    }

    public void setDiscountPercentage(double discountPercentage) {
        this.discountPercentage = discountPercentage;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}