"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { api } from "@/lib/api-client";

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

async function getToken(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return (session?.user as { apiToken?: string } | undefined)?.apiToken ?? null;
}

function revalidatePassengerPaths(id?: string) {
  revalidatePath("/dashboard/passageiros");
  revalidatePath("/dashboard");
  if (id) revalidatePath(`/dashboard/passageiros/${id}`);
}

export async function updatePassengerAction(
  id: string,
  input: { nome: string; email: string; telefone: string }
): Promise<ActionResult> {
  const token = await getToken();
  if (!token) return { success: false, error: "Não autorizado." };

  try {
    await api.patch(`/passengers/${id}`, input, token);
    revalidatePassengerPaths(id);
    return { success: true, data: undefined };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

export async function blockPassengerAction(id: string): Promise<ActionResult> {
  const token = await getToken();
  if (!token) return { success: false, error: "Não autorizado." };

  try {
    await api.post(`/passengers/${id}/block`, undefined, token);
    revalidatePassengerPaths(id);
    return { success: true, data: undefined };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

export async function unblockPassengerAction(id: string): Promise<ActionResult> {
  const token = await getToken();
  if (!token) return { success: false, error: "Não autorizado." };

  try {
    await api.post(`/passengers/${id}/unblock`, undefined, token);
    revalidatePassengerPaths(id);
    return { success: true, data: undefined };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

export async function deletePassengerAction(id: string): Promise<ActionResult> {
  const token = await getToken();
  if (!token) return { success: false, error: "Não autorizado." };

  try {
    await api.delete(`/passengers/${id}`, token);
    revalidatePassengerPaths();
    return { success: true, data: undefined };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}
