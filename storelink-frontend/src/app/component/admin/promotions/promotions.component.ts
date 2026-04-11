import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from 'src/app/model/category/category';
import { CategoryPromotion } from 'src/app/model/category-promotions/category-promotion';
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
  newPromotion: CategoryPromotion = {
    id: 0,
    category: null,
    startDate: '',
    endDate: '',
    discountPercentage: 0,
    active: true,
  };
  today = new Date();

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

  createPromotion(form: NgForm) {
    if (form.invalid) {
      alert('Please fill all required fields correctly!');
      return;
    }

    // Convert Date objects/ string inputs to ISO strings for backend
    const promotionToSend = {
      ...this.newPromotion,
      startDate: new Date(this.newPromotion.startDate).toISOString(),
      endDate: new Date(this.newPromotion.endDate).toISOString(),
    };

    this.promotionService.createPromotion(promotionToSend).subscribe({
      next: (res) => {
        alert(
          `Promotion for category "${res.category?.name ?? 'unknown'}" created successfully!`
        );
        // Reset form and model
        this.newPromotion = {
          id: 0,
          category: null,
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
    if (!confirm(`Stop promotion for category "${promo.category?.name ?? 'unknown'}"?`)) return;

    this.promotionService.stopPromotion(promo.id!).subscribe({
      next: () => {
        alert(`Promotion for category "${promo.category?.name ?? 'unknown'}" stopped.`);
        this.loadPromotions();
      },
      error: (err) => console.error('Failed to stop promotion', err),
    });
  }

  deletePromotion(promo: CategoryPromotion) {
    if (
      !confirm(
        `Delete promotion for category "${promo.category?.name ?? 'unknown'}" permanently?`
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
