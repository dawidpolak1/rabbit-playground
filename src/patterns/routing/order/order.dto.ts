export interface CreateOrder {
  items: Array<{ productId: string; quantity: number }>;
  total: number;
}
