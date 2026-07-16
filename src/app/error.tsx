"use client"

import { useEffect } from "react"

/**
 * Boundary de erro do App Router — sem isso, um erro de render não tratado
 * em qualquer rota derruba a página inteira sem nenhuma UI de recuperação.
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-xl font-semibold text-destructive">Algo deu errado</h1>
      <p className="max-w-md text-sm text-muted-foreground">{error.message}</p>
      <button
        onClick={reset}
        className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
      >
        Tentar novamente
      </button>
    </div>
  )
}
