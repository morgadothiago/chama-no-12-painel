import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { api } from "@/lib/api-client";

export type CouponTipoDesconto = "percentual" | "fixo";

export type Coupon = {
  id: string;
  codigo: string;
  tipoDesconto: CouponTipoDesconto;
  valor: number;
  ativo: boolean;
  createdAt: string;
};

async function getToken(): Promise<string> {
  const session = await getServerSession(authOptions);
  const token = (session?.user as { apiToken?: string } | undefined)?.apiToken;
  if (!token) throw new Error("Não autenticado");
  return token;
}

export async function fetchCoupons(): Promise<Coupon[]> {
  try {
    const token = await getToken();
    const res = await api.get<Coupon[]>("/coupons", token);
    return res.data ?? [];
  } catch {
    return [];
  }
}
