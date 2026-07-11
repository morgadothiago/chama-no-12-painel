import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { api } from "@/lib/api-client";

export type TarifaPadraoApi = {
  taxaBase: number;
  valorPorKm: number;
  valorPorMinuto: number;
  valorMinimo: number;
  updatedAt: string;
};

async function getToken(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return (session?.user as { apiToken?: string } | undefined)?.apiToken ?? null;
}

export async function fetchTarifaPadrao(): Promise<TarifaPadraoApi | null> {
  try {
    const token = await getToken();
    const res = await api.get<TarifaPadraoApi>("/pricing", token ?? undefined);
    return res.data;
  } catch {
    return null;
  }
}
