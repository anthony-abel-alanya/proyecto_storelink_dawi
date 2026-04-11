import { OrderItemRequest } from '../order-item/order-item-request';

export interface OrderRequest {
  paymentId: number;
  customerEmail: string;
  deliveryAddress: string;
  totalAmount: number;
  orderItems: OrderItemRequest[];
}
