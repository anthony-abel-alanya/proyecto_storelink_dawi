import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from 'src/app/model/category/category';
import { CategoryPromotion, CategoryPromotionRequest } from 'src/app/model/category-promotions/category-promotion';
import { PromotionStatus } from 'src/app/model/category-promotions/promotion-status';
import { CategoryPromotionService } from 'src/app/service/category-promotions/category-promotion.service';
import { CategoryService } from 'src/app/service/category/category.service';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-promotions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.css'],
})
export class PromotionsComponent implements OnInit {
  promotions: CategoryPromotion[] = [];
  categories: Category[] = [];
  // Use categoryId for creation
  selectedCategoryId: number | null = null;
  newPromotion = {
    startDate: '',
    endDate: '',
    discountPercentage: 0,
    active: true,
  };

  constructor(
    private promotionService: CategoryPromotionService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadPromotions();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => (this.categories = data),
      error: (err) => console.error('Failed to load categories', err),
    });
  }

  loadPromotions() {
    this.promotionService.getAllPromotions().subscribe({
      next: (data) => (this.promotions = data),
      error: (err) => console.error('Failed to load promotions', err),
    });
  }

  // Get CSS class based on backend status (enum)
  getStatusClass(promo: CategoryPromotion): string {
    switch (promo.status) {
      case PromotionStatus.ACTIVE:
        return 'bg-success';
      case PromotionStatus.PENDING:
        return 'bg-warning text-dark';
      case PromotionStatus.EXPIRED:
        return 'bg-secondary';
      case PromotionStatus.STOPPED:
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  // Get display text based on backend status (enum)
  getStatusText(promo: CategoryPromotion): string {
    switch (promo.status) {
      case PromotionStatus.ACTIVE:
        return 'Activa';
      case PromotionStatus.PENDING:
        return 'Pendiente';
      case PromotionStatus.EXPIRED:
        return 'Expirada';
      case PromotionStatus.STOPPED:
        return 'Detenida';
      default:
        return 'Desconocido';
    }
  }

  createPromotion(form: NgForm) {
    if (form.invalid || !this.selectedCategoryId) {
      alert('Please fill all required fields correctly!');
      return;
    }

    // Build request object with categoryId
    const promotionToSend: CategoryPromotionRequest = {
      categoryId: this.selectedCategoryId!,
      discountPercentage: this.newPromotion.discountPercentage,
      startDate: new Date(this.newPromotion.startDate).toISOString(),
      endDate: new Date(this.newPromotion.endDate).toISOString(),
      active: true,
    };

    this.promotionService.createPromotion(promotionToSend).subscribe({
      next: (res) => {
        alert(
          `Promotion for category "${res.categoryName ?? 'unknown'}" created successfully!`
        );
        // Reset form and model
        this.selectedCategoryId = null;
        this.newPromotion = {
          startDate: '',
          endDate: '',
          discountPercentage: 0,
          active: true,
        };
        form.resetForm();
        this.loadPromotions();
      },
      error: (err) => {
        console.error('Failed to create promotion', err);
        alert(
          'Failed to create promotion. Please check the input values (Category should be unique)!'
        );
      },
    });
  }

  stopPromotion(promo: CategoryPromotion) {
    if (!confirm(`Stop promotion for category "${promo.categoryName ?? 'unknown'}"?`)) return;

    this.promotionService.stopPromotion(promo.id!).subscribe({
      next: () => {
        alert(`Promotion for category "${promo.categoryName ?? 'unknown'}" stopped.`);
        this.loadPromotions();
      },
      error: (err) => console.error('Failed to stop promotion', err),
    });
  }

  deletePromotion(promo: CategoryPromotion) {
    if (
      !confirm(
        `Delete promotion for category "${promo.categoryName ?? 'unknown'}" permanently?`
      )
    ) {
      return;
    }

    this.promotionService.deletePromotion(promo.id!).subscribe({
      next: () => {
        alert(`Promotion deleted successfully.`);
        this.loadPromotions();
      },
      error: (err) => console.error('Failed to delete promotion', err),
    });
  }
}
