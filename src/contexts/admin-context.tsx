"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AdminContextType {
   isAdmin: boolean;
   user: {
      name: string;
      email: string;
      role: "admin" | "operator" | "guest";
   } | null;
   login: (credentials: {
      email: string;
      password: string;
   }) => Promise<boolean>;
   logout: () => void;
   checkAdminAccess: () => boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Mock admin users for demonstration
const ADMIN_USERS = [
   {
      email: "admin@njsmobility.com",
      password: "admin123",
      name: "System Administrator",
      role: "admin" as const,
   },
   {
      email: "manager@njsmobility.com",
      password: "manager123",
      name: "Operations Manager",
      role: "admin" as const,
   },
];

export function AdminProvider({ children }: { children: React.ReactNode }) {
   const [user, setUser] = useState<AdminContextType["user"]>(null);
   const [isAdmin, setIsAdmin] = useState(false);

   useEffect(() => {
      // Check for stored admin session
      const storedUser = localStorage.getItem("njs_admin_user");
      if (storedUser) {
         try {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setIsAdmin(userData.role === "admin");
         } catch (error) {
            localStorage.removeItem("njs_admin_user");
         }
      }
   }, []);

   const login = async (credentials: {
      email: string;
      password: string;
   }): Promise<boolean> => {
      const adminUser = ADMIN_USERS.find(
         (user) =>
            user.email === credentials.email &&
            user.password === credentials.password
      );

      if (adminUser) {
         const userData = {
            name: adminUser.name,
            email: adminUser.email,
            role: adminUser.role,
         };

         setUser(userData);
         setIsAdmin(true);
         localStorage.setItem("njs_admin_user", JSON.stringify(userData));
         return true;
      }

      return false;
   };

   const logout = () => {
      setUser(null);
      setIsAdmin(false);
      localStorage.removeItem("njs_admin_user");
   };

   const checkAdminAccess = () => {
      return isAdmin && user?.role === "admin";
   };

   return (
      <AdminContext.Provider
         value={{
            isAdmin,
            user,
            login,
            logout,
            checkAdminAccess,
         }}
      >
         {children}
      </AdminContext.Provider>
   );
}

export function useAdmin() {
   const context = useContext(AdminContext);
   if (context === undefined) {
      throw new Error("useAdmin must be used within an AdminProvider");
   }
   return context;
}
