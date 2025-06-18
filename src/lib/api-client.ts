// API configuration
const API_BASE_URL =
   process.env.NODE_ENV === "development"
      ? "http://localhost:3001"
      : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface ApiOptions {
   method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
   body?: any;
   headers?: Record<string, string>;
}

export class ApiClient {
   private baseUrl: string;

   constructor(baseUrl: string = API_BASE_URL) {
      this.baseUrl = baseUrl;
   }

   private async request<T>(
      endpoint: string,
      options: ApiOptions = {}
   ): Promise<T> {
      const { method = "GET", body, headers = {} } = options;

      const config: RequestInit = {
         method,
         headers: {
            "Content-Type": "application/json",
            ...headers,
         },
      };

      if (body && method !== "GET") {
         config.body = JSON.stringify(body);
      }

      const url = `${this.baseUrl}${endpoint}`;

      try {
         const response = await fetch(url, config);

         if (!response.ok) {
            throw new Error(
               `API Error: ${response.status} ${response.statusText}`
            );
         }

         const data = await response.json();
         return data;
      } catch (error) {
         console.error(`API request failed: ${method} ${url}`, error);
         throw error;
      }
   }

   // Generic CRUD methods
   async get<T>(endpoint: string): Promise<T> {
      return this.request<T>(endpoint);
   }

   async post<T>(endpoint: string, data: any): Promise<T> {
      return this.request<T>(endpoint, { method: "POST", body: data });
   }

   async put<T>(endpoint: string, data: any): Promise<T> {
      return this.request<T>(endpoint, { method: "PUT", body: data });
   }

   async patch<T>(endpoint: string, data: any): Promise<T> {
      return this.request<T>(endpoint, { method: "PATCH", body: data });
   }

   async delete<T>(endpoint: string): Promise<T> {
      return this.request<T>(endpoint, { method: "DELETE" });
   }
}

export const apiClient = new ApiClient();
