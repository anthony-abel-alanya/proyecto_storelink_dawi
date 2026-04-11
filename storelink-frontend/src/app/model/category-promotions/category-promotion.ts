import { Category } from 'src/app/model/category/category';

export interface CategoryPromotion {
  id?: number;
  category: Category | null;
  discountPercentage: number;
  startDate: string; // e.g., "2025-10-28"
  endDate: string;
  active: boolean;
}
