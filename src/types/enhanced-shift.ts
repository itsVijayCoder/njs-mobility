// Enhanced types for the comprehensive shift reading structure
export interface DispenserReading {
   dispenser_name: string; // DSM-An1, DSM-Bn1, etc.
   ms_pump: PumpReading;
   hsd_pump: PumpReading;
}

export interface PumpReading {
   pump_name: string;
   fuel_type: "MS" | "HSD";
   closing_reading: number;
   opening_reading: number;
   dispensed_qty: number; // Calculated: closing - opening
   pump_test_qty?: number; // Only for Shift I
   own_use_qty: number;
   net_dispensed_qty: number; // Calculated: dispensed - pump_test - own_use
   rate_per_litre: number;
   amount: number; // Calculated: net_dispensed_qty * rate_per_litre
}

export interface ShiftReadingData {
   shift_id: string;
   shift_number: number;
   shift_date: string;
   operator_name: string;
   dispensers: DispenserReading[];
   totals: {
      total_dispensed: number;
      total_pump_test: number;
      total_own_use: number;
      total_net_dispensed: number;
      total_amount: number;
   };
   cash_collections: CashCollectionData[];
   expenses: ExpenseData[];
   payments: PaymentSummary;
}

export interface CashCollectionData {
   drop_number: string; // I, II, III, IV, V, VI
   amount: number;
   remarks?: string;
}

export interface ExpenseData {
   description: string;
   amount: number;
   pending: boolean;
}

export interface PaymentSummary {
   gpay: number;
   card: number;
   fleet: number;
   pending: number;
   total_gpay_mop: number;
   total_cash: number;
   total_fleet: number;
   discount: {
      total_amount_before_discount: number;
      total_amount_with_drop: number;
      total_amount_without_drop: number;
   };
}
