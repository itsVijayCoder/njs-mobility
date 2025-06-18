import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Shift, ShiftReading, ShiftPayment } from "@/types/shift";
import { User } from "@/types/auth";
import { Pump } from "@/types/shift";

// Query Keys
export const shiftKeys = {
   all: ["shifts"] as const,
   lists: () => [...shiftKeys.all, "list"] as const,
   list: (filters: Record<string, any>) =>
      [...shiftKeys.lists(), { filters }] as const,
   details: () => [...shiftKeys.all, "detail"] as const,
   detail: (id: string) => [...shiftKeys.details(), id] as const,
   readings: (shiftId: string) =>
      [...shiftKeys.detail(shiftId), "readings"] as const,
   payments: (shiftId: string) =>
      [...shiftKeys.detail(shiftId), "payments"] as const,
};

// Fetch shifts
export function useShifts(filters?: Record<string, any>) {
   return useQuery({
      queryKey: shiftKeys.list(filters || {}),
      queryFn: async () => {
         const searchParams = new URLSearchParams();
         if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
               if (
                  value !== undefined &&
                  value !== null &&
                  value !== "" &&
                  value !== "all"
               ) {
                  searchParams.append(key, value.toString());
               }
            });
         }

         const shiftsResponse = await apiClient.get<Shift[]>(
            `/shifts?${searchParams.toString()}`
         );
         const usersResponse = await apiClient.get<User[]>("/users");

         // Enrich shifts with user data
         const shifts = shiftsResponse.map((shift) => {
            const operator = usersResponse.find(
               (user) => user.id === shift.operator_id
            );
            return {
               ...shift,
               operator: operator || ({} as User),
            };
         });

         return shifts;
      },
   });
}

// Fetch single shift
export function useShift(id: string) {
   return useQuery({
      queryKey: shiftKeys.detail(id),
      queryFn: async () => {
         const [shift, user] = await Promise.all([
            apiClient.get<Shift>(`/shifts/${id}`),
            apiClient.get<User>(`/users/${id}`).catch(() => null),
         ]);

         return {
            ...shift,
            operator: user || ({} as User),
         };
      },
      enabled: !!id,
   });
}

// Fetch shift readings
export function useShiftReadings(shiftId: string) {
   return useQuery({
      queryKey: shiftKeys.readings(shiftId),
      queryFn: async () => {
         const [readings, pumps] = await Promise.all([
            apiClient.get<ShiftReading[]>(
               `/shift_readings?shift_id=${shiftId}`
            ),
            apiClient.get<Pump[]>("/pumps"),
         ]);

         return readings.map((reading) => {
            const pump = pumps.find((p) => p.id === reading.pump_id);
            return {
               ...reading,
               pump: pump || ({} as Pump),
            };
         });
      },
      enabled: !!shiftId,
   });
}

// Fetch shift payments
export function useShiftPayments(shiftId: string) {
   return useQuery({
      queryKey: shiftKeys.payments(shiftId),
      queryFn: () =>
         apiClient.get<ShiftPayment[]>(`/shift_payments?shift_id=${shiftId}`),
      enabled: !!shiftId,
   });
}

// Create shift mutation
export function useCreateShift() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: (
         shift: Omit<Shift, "id" | "created_at" | "updated_at" | "operator">
      ) => apiClient.post<Shift>("/shifts", shift),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: shiftKeys.all });
      },
   });
}

// Update shift mutation
export function useUpdateShift() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: ({ id, ...shift }: Partial<Shift> & { id: string }) =>
         apiClient.put<Shift>(`/shifts/${id}`, shift),
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({
            queryKey: shiftKeys.detail(variables.id),
         });
         queryClient.invalidateQueries({ queryKey: shiftKeys.lists() });
      },
   });
}

// Create shift reading mutation
export function useCreateShiftReading() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: (reading: Omit<ShiftReading, "id" | "created_at">) =>
         apiClient.post<ShiftReading>("/shift_readings", reading),
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({
            queryKey: shiftKeys.readings(variables.shift_id),
         });
         queryClient.invalidateQueries({
            queryKey: shiftKeys.detail(variables.shift_id),
         });
      },
   });
}

// Create shift payment mutation
export function useCreateShiftPayment() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: (payment: Omit<ShiftPayment, "id" | "created_at">) =>
         apiClient.post<ShiftPayment>("/shift_payments", payment),
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({
            queryKey: shiftKeys.payments(variables.shift_id),
         });
         queryClient.invalidateQueries({
            queryKey: shiftKeys.detail(variables.shift_id),
         });
      },
   });
}
