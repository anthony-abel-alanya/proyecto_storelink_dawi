import { Customer } from '../customer/customer';
import { OrderItem } from '../order-item/order-item';
import { Payment } from '../payment/payment';

export interface Order {
  orderId?: number;
  payment: Payment;
  customer: Customer;
  deliveryAddress: string;
  totalAmount: number;
  orderStatus: string;
  orderDate: string;
  orderItems: OrderItem[]; 
}
