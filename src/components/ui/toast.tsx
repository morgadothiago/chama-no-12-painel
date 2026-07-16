"use client"

import { Toast as ToastPrimitive } from "@base-ui/react/toast"

import { cn } from "@/lib/utils"

/** Manager único — permite disparar toast de qualquer lugar (fora da árvore React), ver `@/lib/toast`. */
export const toastManager = ToastPrimitive.createToastManager()

function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <ToastPrimitive.Provider toastManager={toastManager}>
      {children}
      <ToastViewport />
    </ToastPrimitive.Provider>
  )
}

function ToastViewport() {
  const { toasts } = ToastPrimitive.useToastManager()

  return (
    <ToastPrimitive.Portal>
      <ToastPrimitive.Viewport className="fixed right-4 bottom-4 z-50 mx-auto w-[calc(100vw-2rem)] sm:w-90">
        {toasts.map((toast) => (
          <ToastPrimitive.Root
            key={toast.id}
            toast={toast}
            className={cn(
              "absolute right-0 bottom-0 left-0 z-[calc(1000-var(--toast-index))] w-full origin-bottom rounded-lg border p-4 shadow-lg transition-[transform,opacity] duration-300",
              "data-[type=error]:border-destructive/40 data-[type=error]:bg-destructive/10",
              "data-[type=success]:border-emerald-500/40 data-[type=success]:bg-emerald-500/10",
              "bg-background data-starting-style:opacity-0 data-ending-style:opacity-0",
              "[transform:translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*0.75rem)))]",
              "data-expanded:[transform:translateY(var(--toast-offset-y))]"
            )}
          >
            <ToastPrimitive.Title className="text-sm font-semibold text-foreground" />
            <ToastPrimitive.Description className="mt-1 text-sm text-muted-foreground" />
            <ToastPrimitive.Close
              aria-label="Fechar"
              className="absolute top-2 right-2 rounded-md p-1 text-muted-foreground hover:bg-muted"
            >
              ✕
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}
      </ToastPrimitive.Viewport>
    </ToastPrimitive.Portal>
  )
}

export { ToastProvider }
