// Interface for ProductResponse from backend
export interface Product {
  productId?: number;
  productName: string;
  description?: string;
  price: number;
  quantity: number;
  imageUrl: string;
  categoryId?: number;    // For logic comparisons
  categoryName?: string;  // For display only
}

// Interface for ProductRequest to send to backend
export interface ProductRequest {
  productName: string;
  description?: string;
  price: number;
  quantity: number;
  imageUrl: string;
  categoryId: number;  // Send categoryId instead of category object
}
