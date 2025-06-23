// src/types/index.ts
export interface Supplier {
  id: number;
  name: string;
  location: string;
  category: string | null;
  country: string;
  established_year: number;
  employees: string;
  description: string;
  min_order_value: string;
  production_capacity: string;
  verified: boolean;
  contact: SupplierContact | null;
}

export interface SupplierContact {
  name: string;
  position: string;
  email: string;
  phone: string;
  website: string | null;
  address: string | null;
}

export interface Quote {
  id: number;
  name: string;
  requirements: string;
  industry: string;
  details: string;
  created_at: string;
}

export interface Offer {
  id: number;
  supplier: Supplier;
  quote: Quote;
  offer_price: string;
  description: string;
  created_at: string;
}