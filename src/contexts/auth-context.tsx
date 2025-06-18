"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
   User,
   AuthState,
   AuthContextType,
   LoginCredentials,
} from "@/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
   const [state, setState] = useState<AuthState>({
      user: null,
      isLoading: true,
      isAuthenticated: false,
   });

   useEffect(() => {
      // Check for stored auth state
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
         try {
            const user = JSON.parse(storedUser);
            setState({
               user,
               isLoading: false,
               isAuthenticated: true,
            });
         } catch (error) {
            console.error("Failed to parse stored user:", error);
            localStorage.removeItem("user");
            setState((prev) => ({ ...prev, isLoading: false }));
         }
      } else {
         setState((prev) => ({ ...prev, isLoading: false }));
      }
   }, []);

   const login = async (credentials: LoginCredentials) => {
      setState((prev) => ({ ...prev, isLoading: true }));

      try {
         // Mock authentication - replace with real API call
         const mockUsers = [
            {
               id: "1",
               email: "admin@njsmobility.com",
               full_name: "Admin User",
               role: "admin" as const,
               status: "active" as const,
               created_at: new Date().toISOString(),
               updated_at: new Date().toISOString(),
            },
            {
               id: "2",
               email: "manager@njsmobility.com",
               full_name: "Manager User",
               role: "manager" as const,
               status: "active" as const,
               created_at: new Date().toISOString(),
               updated_at: new Date().toISOString(),
            },
            {
               id: "3",
               email: "operator1@njsmobility.com",
               full_name: "Shift Operator 1",
               role: "shift_operator_1" as const,
               status: "active" as const,
               created_at: new Date().toISOString(),
               updated_at: new Date().toISOString(),
            },
         ];

         const user = mockUsers.find((u) => u.email === credentials.email);

         if (!user) {
            throw new Error("Invalid credentials");
         }

         localStorage.setItem("user", JSON.stringify(user));
         setState({
            user,
            isLoading: false,
            isAuthenticated: true,
         });
      } catch (error) {
         setState((prev) => ({ ...prev, isLoading: false }));
         throw error;
      }
   };

   const logout = async () => {
      localStorage.removeItem("user");
      setState({
         user: null,
         isLoading: false,
         isAuthenticated: false,
      });
   };

   const updateUser = (userData: Partial<User>) => {
      if (state.user) {
         const updatedUser = { ...state.user, ...userData };
         localStorage.setItem("user", JSON.stringify(updatedUser));
         setState((prev) => ({ ...prev, user: updatedUser }));
      }
   };

   const contextValue: AuthContextType = {
      ...state,
      login,
      logout,
      updateUser,
   };

   return (
      <AuthContext.Provider value={contextValue}>
         {children}
      </AuthContext.Provider>
   );
}

export function useAuth() {
   const context = useContext(AuthContext);
   if (context === undefined) {
      throw new Error("useAuth must be used within an AuthProvider");
   }
   return context;
}
