"use client"

import { useEffect } from "react"

/**
 * Captura erros no root layout em si (fora do alcance de error.tsx) —
 * precisa dos próprios <html>/<body> porque substitui o layout inteiro.
 */
export default function GlobalError({
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
    <html lang="pt-BR">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
          <h1 className="text-xl font-semibold text-red-600">Algo deu errado</h1>
          <p className="max-w-md text-sm text-gray-500">{error.message}</p>
          <button
            onClick={reset}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  )
}
