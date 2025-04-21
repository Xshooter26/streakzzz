"use client";

import { Toaster as HotToaster } from "react-hot-toast";

export function Toaster() {
  return (
    <HotToaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Default options for all toasts
        duration: 3000,
        style: {
          background: "var(--background)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
        },
        // Styles for specific toast types
        success: {
          duration: 3000,
          style: {
            background: "var(--success-background, #ecfdf5)",
            color: "var(--success-foreground, #065f46)",
            border: "1px solid var(--success-border, #a7f3d0)",
          },
        },
        error: {
          duration: 4000,
          style: {
            background: "var(--error-background, #fef2f2)",
            color: "var(--error-foreground, #b91c1c)",
            border: "1px solid var(--error-border, #fecaca)",
          },
        },
      }}
    />
  );
}