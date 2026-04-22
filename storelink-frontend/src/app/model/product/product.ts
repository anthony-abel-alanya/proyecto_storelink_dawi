// Interface for ProductResponse from backend
export interface Product {
  productId?: number;
  productName: string;
  description?: string;
  author?: string;
  price: number;
  quantity: number;
  imageUrl: string;
  categoryId?: number;
  categoryName?: string;
}

export interface ProductRequest {
  productName: string;
  description?: string;
  author?: string;
  price: number;
  quantity: number;
  imageUrl: string;
  categoryId: number;
}
