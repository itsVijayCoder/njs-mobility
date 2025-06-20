"use client";

import React, { createContext, useContext, useState } from "react";

interface SidebarContextType {
   isOpen: boolean;
   setIsOpen: (open: boolean) => void;
   toggle: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
   const [isOpen, setIsOpen] = useState(true);

   const toggle = () => setIsOpen((prev) => !prev);

   return (
      <SidebarContext.Provider value={{ isOpen, setIsOpen, toggle }}>
         {children}
      </SidebarContext.Provider>
   );
}

export function useSidebar() {
   const context = useContext(SidebarContext);
   if (context === undefined) {
      throw new Error("useSidebar must be used within a SidebarProvider");
   }
   return context;
}
