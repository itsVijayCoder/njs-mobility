import { Shift, CashDenomination } from "./shift";

export interface CheckoutSheet {
   id: string;
   shift_id: string;
   checkout_number: number; // 1, 2, 3, or 4
   operator_id: string;
   operator_name: string;
   cash_received: number;
   card_payments: number;
   upi_payments: number;
   other_payments: number;
   opening_balance: number;
   closing_balance: number;
   short_excess: number;
   cash_denominations: CashDenomination[];
   status: "pending" | "completed" | "verified";
   notes?: string;
   created_at: string;
   updated_at: string;
}

export interface ShiftSummary {
   shift_id: string;
   shift_number: number;
   shift_date: string;
   total_checkout_sheets: number;
   completed_checkouts: number;
   total_fuel_sales: number;
   total_store_sales: number;
   total_cash_collections: number;
   total_digital_payments: number;
   net_variance: number;
   status: "ongoing" | "completed" | "verified";
}

export interface MISReport {
   date: string;
   net_sales: number;
   cash_payments: number;
   card_payments: number;
   upi_payments: number;
   other_payments: number;
   fuel_prices: {
      MS: number;
      HSD: number;
   };
   denomination_breakdown: CashDenomination[];
   total_variance: number;
}

// Extend existing Shift interface
export interface ExtendedShift extends Shift {
   checkout_sheets: CheckoutSheet[];
   mis_report?: MISReport;
}
