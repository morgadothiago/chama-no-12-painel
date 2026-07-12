import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { api } from "@/lib/api-client";
import type { Passenger } from "@/lib/passengers";

type ApiPassenger = {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  status: Passenger["status"];
  totalCorridas: number;
  totalGasto: number;
  cadastroEm: string;
  ultimaCorrida: string | null;
  corridas: Passenger["corridas"];
};

async function getToken(): Promise<string> {
  const session = await getServerSession(authOptions);
  const token = (session?.user as { apiToken?: string } | undefined)?.apiToken;
  if (!token) throw new Error("Não autenticado");
  return token;
}

function mapPassenger(p: ApiPassenger): Passenger {
  return {
    id: p.id,
    nome: p.nome,
    email: p.email,
    telefone: p.telefone ?? "",
    avatarUrl: null,
    status: p.status,
    totalCorridas: p.totalCorridas,
    totalGasto: p.totalGasto,
    cadastroEm: p.cadastroEm,
    ultimaCorrida: p.ultimaCorrida,
    corridas: p.corridas,
  };
}

export async function fetchPassengers(): Promise<Passenger[]> {
  try {
    const token = await getToken();
    const res = await api.get<ApiPassenger[]>("/passengers", token);
    return (res.data ?? []).map(mapPassenger);
  } catch {
    return [];
  }
}

export async function fetchPassengerById(id: string): Promise<Passenger | null> {
  try {
    const token = await getToken();
    const res = await api.get<ApiPassenger>(`/passengers/${id}`, token);
    return mapPassenger(res.data);
  } catch {
    return null;
  }
}
