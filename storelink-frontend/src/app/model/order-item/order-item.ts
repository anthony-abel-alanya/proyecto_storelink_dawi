import { Order } from '../order/order';
import { Product } from '../product/product';

export interface OrderItem {
  orderItemId?: number;
  order?: Order;
  product: Product;
  quantity: number;
  productPrice: number;
  subtotal: number;
}
