"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { api } from "@/lib/api-client";
import type { CouponTipoDesconto } from "@/lib/api-coupons";

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

async function getToken(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return (session?.user as { apiToken?: string } | undefined)?.apiToken ?? null;
}

export async function createCouponAction(input: {
  codigo: string;
  tipoDesconto: CouponTipoDesconto;
  valor: number;
}): Promise<ActionResult> {
  const token = await getToken();
  if (!token) return { success: false, error: "Não autorizado." };

  try {
    await api.post("/coupons", input, token);
    revalidatePath("/dashboard/cupons");
    return { success: true, data: undefined };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

export async function toggleCouponAction(id: string, ativo: boolean): Promise<ActionResult> {
  const token = await getToken();
  if (!token) return { success: false, error: "Não autorizado." };

  try {
    await api.patch(`/coupons/${id}`, { ativo: !ativo }, token);
    revalidatePath("/dashboard/cupons");
    return { success: true, data: undefined };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}
