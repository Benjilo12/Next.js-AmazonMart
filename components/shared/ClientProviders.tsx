"use client";
import React from "react";

import useCartSidebar from "@/hooks/useCartSidebar";
import CartSidebar from "./CartSidebar";
import { Toaster } from "@/components/ui/sonner";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const isCartSidebarOpen = useCartSidebar();

  return (
    <>
      {isCartSidebarOpen ? (
        <div className="flex min-h-screen">
          <div className="flex-1 overflow-hidden">{children}</div>
          <CartSidebar />
        </div>
      ) : (
        <div>{children}</div>
      )}
      <Toaster />
    </>
  );
}
