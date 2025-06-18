import { User } from "./auth";
import { StoreSale } from "./store";

export interface Pump {
   id: string;
   name: string;
   fuel_type: FuelType;
   status: "active" | "maintenance" | "inactive";
   current_reading: number;
   created_at: string;
   updated_at: string;
}

export type FuelType = "MS" | "HSD";

export interface Shift {
   id: string;
   shift_date: string;
   shift_number: number; // 1, 2, 3
   operator_id: string;
   operator: User;
   status: "ongoing" | "completed" | "verified";
   start_time: string;
   end_time?: string;
   readings: ShiftReading[];
   payments: ShiftPayment[];
   store_sales: StoreSale[];
   total_fuel_sales: number;
   total_store_sales: number;
   total_cash: number;
   total_digital: number;
   variance: number;
   notes?: string;
   created_at: string;
   updated_at: string;
}

export interface ShiftReading {
   id: string;
   shift_id: string;
   pump_id: string;
   pump: Pump;
   opening_reading: number;
   closing_reading: number;
   litres_sold: number;
   rate_per_litre: number;
   total_amount: number;
   created_at: string;
}

export interface ShiftPayment {
   id: string;
   shift_id: string;
   payment_mode: PaymentMode;
   amount: number;
   cash_denominations?: CashDenomination[];
   created_at: string;
}

export type PaymentMode = "cash" | "card" | "upi";

export interface CashDenomination {
   denomination: number;
   count: number;
   total: number;
}

export interface FuelPrice {
   id: string;
   fuel_type: FuelType;
   price: number;
   effective_date: string;
   created_by: string;
   created_at: string;
}

export interface DailySalesReport {
   date: string;
   total_fuel_sales: number;
   total_store_sales: number;
   total_revenue: number;
   fuel_breakdown: {
      ms_sales: number;
      hsd_sales: number;
      ms_litres: number;
      hsd_litres: number;
   };
   payment_breakdown: {
      cash: number;
      card: number;
      upi: number;
   };
   variance: number;
   shifts: Shift[];
}
