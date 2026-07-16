import { toastManager } from "@/components/ui/toast"

export function showErrorToast(message: string | undefined, title = "Algo deu errado") {
  toastManager.add({ type: "error", title, description: message ?? "Tente novamente." })
}

export function showSuccessToast(message: string, title = "Sucesso") {
  toastManager.add({ type: "success", title, description: message })
}
