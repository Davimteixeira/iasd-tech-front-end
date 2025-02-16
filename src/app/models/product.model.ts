export interface Product {
  id?: number;
  name: string;
  description: string;
  price: string;
  category: number;
  created_at?: string;
  user?: number;
}

export interface Category {
  readonly id: number;
  name: string;
}

export interface CategoryResponse {
  count: number;
  next?: string;
  previous?: string;
  results: Category[];
}
