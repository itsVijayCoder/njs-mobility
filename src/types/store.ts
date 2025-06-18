import { PaymentMode } from "./shift";

export interface Product {
   id: string;
   name: string;
   barcode?: string;
   category: ProductCategory;
   price: number;
   cost_price: number;
   stock_quantity: number;
   min_stock_level: number;
   unit: ProductUnit;
   tax_rate: number;
   status: "active" | "inactive";
   created_at: string;
   updated_at: string;
}

export type ProductCategory =
   | "beverage"
   | "snacks"
   | "automotive"
   | "tobacco"
   | "other";
export type ProductUnit = "piece" | "kg" | "litre" | "packet";

export interface StoreSale {
   id: string;
   shift_id: string;
   invoice_number: string;
   items: StoreSaleItem[];
   subtotal: number;
   tax_amount: number;
   total_amount: number;
   payment_mode: PaymentMode;
   customer_name?: string;
   customer_phone?: string;
   created_at: string;
}

export interface StoreSaleItem {
   id: string;
   sale_id: string;
   product_id: string;
   product: Product;
   quantity: number;
   unit_price: number;
   total_price: number;
   tax_amount: number;
}

export interface StockMovement {
   id: string;
   product_id: string;
   product: Product;
   type: "in" | "out" | "adjustment";
   quantity: number;
   previous_stock: number;
   new_stock: number;
   reason: string;
   reference_id?: string; // sale_id or purchase_id
   created_by: string;
   created_at: string;
}

export interface ProductFormData {
   name: string;
   barcode?: string;
   category: ProductCategory;
   price: number;
   cost_price: number;
   stock_quantity: number;
   min_stock_level: number;
   unit: ProductUnit;
   tax_rate: number;
}

export interface StoreSaleFormData {
   items: {
      product_id: string;
      quantity: number;
      unit_price: number;
   }[];
   payment_mode: PaymentMode;
   customer_name?: string;
   customer_phone?: string;
}
