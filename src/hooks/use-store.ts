import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
   Product,
   StoreSale,
   StoreSaleItem,
   StockMovement,
} from "@/types/store";

// Query Keys
export const storeKeys = {
   all: ["store"] as const,
   products: () => [...storeKeys.all, "products"] as const,
   product: (id: string) => [...storeKeys.products(), id] as const,
   sales: () => [...storeKeys.all, "sales"] as const,
   sale: (id: string) => [...storeKeys.sales(), id] as const,
   saleItems: (saleId: string) => [...storeKeys.sale(saleId), "items"] as const,
   stockMovements: () => [...storeKeys.all, "stock-movements"] as const,
};

// Products
export function useProducts(filters?: Record<string, any>) {
   return useQuery({
      queryKey: storeKeys.products(),
      queryFn: async () => {
         const searchParams = new URLSearchParams();
         if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
               if (value !== undefined && value !== null && value !== "") {
                  searchParams.append(key, value.toString());
               }
            });
         }
         return apiClient.get<Product[]>(
            `/products?${searchParams.toString()}`
         );
      },
   });
}

export function useProduct(id: string) {
   return useQuery({
      queryKey: storeKeys.product(id),
      queryFn: () => apiClient.get<Product>(`/products/${id}`),
      enabled: !!id,
   });
}

// Store Sales
export function useStoreSales(filters?: Record<string, any>) {
   return useQuery({
      queryKey: storeKeys.sales(),
      queryFn: async () => {
         const searchParams = new URLSearchParams();
         if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
               if (value !== undefined && value !== null && value !== "") {
                  searchParams.append(key, value.toString());
               }
            });
         }
         return apiClient.get<StoreSale[]>(
            `/store_sales?${searchParams.toString()}`
         );
      },
   });
}

export function useStoreSale(id: string) {
   return useQuery({
      queryKey: storeKeys.sale(id),
      queryFn: () => apiClient.get<StoreSale>(`/store_sales/${id}`),
      enabled: !!id,
   });
}

export function useStoreSaleItems(saleId: string) {
   return useQuery({
      queryKey: storeKeys.saleItems(saleId),
      queryFn: async () => {
         const [items, products] = await Promise.all([
            apiClient.get<StoreSaleItem[]>(
               `/store_sale_items?sale_id=${saleId}`
            ),
            apiClient.get<Product[]>("/products"),
         ]);

         return items.map((item) => {
            const product = products.find((p) => p.id === item.product_id);
            return {
               ...item,
               product: product || ({} as Product),
            };
         });
      },
      enabled: !!saleId,
   });
}

// Stock Movements
export function useStockMovements(productId?: string) {
   return useQuery({
      queryKey: storeKeys.stockMovements(),
      queryFn: async () => {
         const searchParams = new URLSearchParams();
         if (productId) {
            searchParams.append("product_id", productId);
         }

         const [movements, products] = await Promise.all([
            apiClient.get<StockMovement[]>(
               `/stock_movements?${searchParams.toString()}`
            ),
            apiClient.get<Product[]>("/products"),
         ]);

         return movements.map((movement) => {
            const product = products.find((p) => p.id === movement.product_id);
            return {
               ...movement,
               product: product || ({} as Product),
            };
         });
      },
   });
}

// Mutations
export function useCreateProduct() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: (
         product: Omit<Product, "id" | "created_at" | "updated_at">
      ) =>
         apiClient.post<Product>("/products", {
            ...product,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
         }),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: storeKeys.products() });
      },
   });
}

export function useUpdateProduct() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: ({ id, ...product }: Partial<Product> & { id: string }) =>
         apiClient.put<Product>(`/products/${id}`, {
            ...product,
            updated_at: new Date().toISOString(),
         }),
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({
            queryKey: storeKeys.product(variables.id),
         });
         queryClient.invalidateQueries({ queryKey: storeKeys.products() });
      },
   });
}

export function useCreateStoreSale() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async (saleData: {
         sale: Omit<StoreSale, "id" | "created_at" | "invoice_number">;
         items: Omit<StoreSaleItem, "id" | "sale_id">[];
      }) => {
         // Generate invoice number
         const invoiceNumber = `INV-${new Date()
            .toISOString()
            .slice(0, 10)
            .replace(/-/g, "")}-${String(Date.now()).slice(-3)}`;

         // Create sale
         const sale = await apiClient.post<StoreSale>("/store_sales", {
            ...saleData.sale,
            invoice_number: invoiceNumber,
            created_at: new Date().toISOString(),
         });

         // Create sale items
         const items = await Promise.all(
            saleData.items.map((item) =>
               apiClient.post<StoreSaleItem>("/store_sale_items", {
                  ...item,
                  sale_id: sale.id,
               })
            )
         );

         // Update product stock
         await Promise.all(
            saleData.items.map((item) =>
               apiClient
                  .get<Product>(`/products/${item.product_id}`)
                  .then((product) =>
                     apiClient.put(`/products/${item.product_id}`, {
                        ...product,
                        stock_quantity: product.stock_quantity - item.quantity,
                        updated_at: new Date().toISOString(),
                     })
                  )
            )
         );

         return { sale, items };
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: storeKeys.sales() });
         queryClient.invalidateQueries({ queryKey: storeKeys.products() });
         queryClient.invalidateQueries({
            queryKey: storeKeys.stockMovements(),
         });
      },
   });
}
