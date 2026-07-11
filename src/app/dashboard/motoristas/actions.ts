"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { api } from "@/lib/api-client";
import {
  driverFormSchema,
  type DriverFormInput,
} from "@/lib/validations/drivers";

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

async function getToken(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return (session?.user as { apiToken?: string } | undefined)?.apiToken ?? null;
}

function revalidateDriverPaths(id?: string) {
  revalidatePath("/dashboard/motoristas");
  revalidatePath("/dashboard");
  if (id) revalidatePath(`/dashboard/motoristas/${id}`);
}

export async function updateDriverAction(
  id: string,
  input: DriverFormInput
): Promise<ActionResult<{ id: string }>> {
  const token = await getToken();
  if (!token) return { success: false, error: "Não autorizado." };

  const parsed = driverFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos. Confira os campos e tente novamente." };
  }

  try {
    const { data } = parsed;
    await api.patch(`/drivers/${id}`, {
      nome: data.nome,
      email: data.email,
      telefone: data.telefone,
      cnh: data.cnh,
      veiculo: data.veiculo,
      endereco: data.endereco,
    }, token);

    revalidateDriverPaths(id);
    return { success: true, data: { id } };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

export async function createDriverAction(
  input: DriverFormInput
): Promise<ActionResult<{ id: string }>> {
  const token = await getToken();
  if (!token) return { success: false, error: "Não autorizado." };

  const parsed = driverFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos. Confira os campos e tente novamente." };
  }

  try {
    const { data } = parsed;
    const res = await api.post<{ id: string }>("/drivers", {
      nome: data.nome,
      email: data.email,
      telefone: data.telefone,
      cnh: data.cnh,
      veiculo: {
        placa: data.veiculo.placa,
        modelo: data.veiculo.modelo,
        ano: data.veiculo.ano,
      },
      endereco: {
        cep: data.endereco.cep,
        logradouro: data.endereco.logradouro,
        numero: data.endereco.numero,
        complemento: data.endereco.complemento ?? "",
        bairro: data.endereco.bairro,
        cidade: data.endereco.cidade,
        uf: data.endereco.uf,
      },
    }, token);

    revalidateDriverPaths(res.data.id);
    return { success: true, data: { id: res.data.id } };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

export async function approveDriverAction(id: string): Promise<ActionResult> {
  const token = await getToken();
  if (!token) return { success: false, error: "Não autorizado." };

  try {
    await api.post(`/drivers/${id}/approve`, undefined, token);
    revalidateDriverPaths(id);
    return { success: true, data: undefined };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

export async function rejectDriverAction(id: string): Promise<ActionResult> {
  const token = await getToken();
  if (!token) return { success: false, error: "Não autorizado." };

  try {
    await api.post(`/drivers/${id}/reject`, { motivo: "Rejeitado pelo administrador" }, token);
    revalidateDriverPaths();
    return { success: true, data: undefined };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

export async function toggleActiveAction(
  id: string
): Promise<ActionResult<{ status: string }>> {
  const token = await getToken();
  if (!token) return { success: false, error: "Não autorizado." };

  try {
    // Get current status, then toggle
    const driver = await api.get<{ status: string }>(`/drivers/${id}`, token);
    const isActive = driver.data.status === "ativo";

    if (isActive) {
      await api.post(`/drivers/${id}/deactivate`, undefined, token);
    } else {
      await api.post(`/drivers/${id}/activate`, undefined, token);
    }

    revalidateDriverPaths(id);
    return { success: true, data: { status: isActive ? "inativo" : "ativo" } };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

export async function simulateDocumentUploadAction(
  driverId: string,
  tipo: string
): Promise<ActionResult> {
  const token = await getToken();
  if (!token) return { success: false, error: "Não autorizado." };

  try {
    await api.patch(`/drivers/${driverId}/documents/${tipo}`, {
      status: "aprovado",
    }, token);
    revalidateDriverPaths(driverId);
    return { success: true, data: undefined };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}
