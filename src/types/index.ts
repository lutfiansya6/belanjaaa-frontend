export interface Shop {
  id: string;
  name: string;
  description?: string;
  city: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  sold: number;
  rating: number;
  shopId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  shop?: Shop;
  category?: Category;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductsResponse {
  items: Product[];
  meta: PaginationMeta;
}

export type ProductSortOption = 'newest' | 'price_asc' | 'price_desc' | 'best_selling';

export interface ProductQueryParams {
  search?: string;
  categoryId?: string;
  sort?: ProductSortOption;
  page?: number;
  limit?: number;
}

export type UserRole = 'ADMIN' | 'SELLER' | 'BUYER';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: UserRole;
  shop?: {
    id: string;
    name: string;
    city: string;
  } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  message: string;
  accessToken?: string;
  user: User;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface CartItemProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl: string;
  sold?: number;
  rating?: number;
  shopId: string;
  categoryId: string;
  shop?: {
    id: string;
    name: string;
    city: string;
  };
  category?: {
    id: string;
    name: string;
  };
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
  product: CartItemProduct;
}

export interface CartResponse {
  id: string;
  userId: string;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  updatedAt: string;
}

export interface AddToCartInput {
  productId: string;
  quantity?: number;
}

export interface UpdateCartItemInput {
  quantity: number;
}

export interface Address {
  id: string;
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  province?: string | null;
  postalCode?: string | null;
  isDefault: boolean;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAddressInput {
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  province?: string;
  postalCode?: string;
  isDefault?: boolean;
}

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  orderId?: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
  createdAt?: string;
  product?: {
    id: string;
    name: string;
    imageUrl: string;
    shop?: {
      id: string;
      name: string;
      city: string;
    };
  };
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  totalAmount: number;
  addressId?: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  address?: Address | null;
}

export interface CreateOrderInput {
  addressId?: string;
}

