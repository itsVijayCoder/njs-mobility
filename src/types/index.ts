// Auth types
export * from "./auth";

// Shift and fuel management types
export * from "./shift";

// Store and inventory types
export * from "./store";

// Checkout and shift management types
export * from "./checkout";

// Common utility types
export interface ApiResponse<T> {
   data: T;
   message: string;
   success: boolean;
}

export interface PaginatedResponse<T> {
   data: T[];
   total: number;
   page: number;
   limit: number;
   totalPages: number;
}

export interface SelectOption {
   value: string;
   label: string;
}
