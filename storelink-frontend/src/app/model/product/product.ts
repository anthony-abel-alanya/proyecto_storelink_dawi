import { Category } from '../category/category'; 

export interface Product {
  productId?: number;
  productName: string;
  description?: string;
  price: number;
  quantity: number;
  category: Category | null; 
  imageUrl: string;
}
