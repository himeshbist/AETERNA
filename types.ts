export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'Men' | 'Women' | 'Limited';
  images: string[];
  sizes: number[];
  colors: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
}

export interface CartItem extends Product {
  selectedSize: number;
  selectedColor: string;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'Pending' | 'Shipped' | 'Delivered';
  customer: {
    name: string;
    email: string;
    address: string;
  };
}