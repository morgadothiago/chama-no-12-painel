"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { api } from "@/lib/api-client";

type ActionResult = { success: true } | { success: false; error: string };

export type TarifaPadraoInput = {
  taxaBase: number;
  valorPorKm: number;
  valorPorMinuto: number;
  valorMinimo: number;
};

export async function updateTarifaPadraoAction(
  input: TarifaPadraoInput
): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  const token = (session?.user as { apiToken?: string } | undefined)?.apiToken;
  if (!token) return { success: false, error: "Não autorizado." };

  try {
    await api.patch("/pricing", input, token);
    revalidatePath("/dashboard/preco");
    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}
