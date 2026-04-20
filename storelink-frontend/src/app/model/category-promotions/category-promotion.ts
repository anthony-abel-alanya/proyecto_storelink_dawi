import { PromotionStatus } from './promotion-status';

// Response from backend - CategoryPromotionResponse
export interface CategoryPromotion {
  id?: number;
  categoryId: number | null;
  categoryName: string | null;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  active: boolean;
  status: PromotionStatus;
}

// Request to backend for creating/updating
export interface CategoryPromotionRequest {
  categoryId: number;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  active: boolean;
}
