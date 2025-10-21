//components/ui/toaster.tsx
"use client"

import { Toaster } from "sonner"

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "rgba(255,248,244,0.9)",
          border: "1px solid #E6CDB6",
          color: "#4B4444",
          borderRadius: "12px",
          padding: "12px 16px",
        },
      }}
    />
  )
}
