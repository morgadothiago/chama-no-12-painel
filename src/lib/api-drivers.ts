import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { api } from "@/lib/api-client";
import type { Driver, DriverMetrics, DriverDocument, DriverTrip } from "@/lib/drivers";

type ApiDriver = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cnh: string;
  status: string;
  avatarUrl: string | null;
  veiculo: { placa: string; modelo: string; ano: number };
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
  };
  metrics: DriverMetrics;
  documentos: DriverDocument[];
  localizacaoAtual: { lat: number; lng: number } | null;
};

async function getToken(): Promise<string> {
  const session = await getServerSession(authOptions);
  const token = (session?.user as { apiToken?: string } | undefined)?.apiToken;
  if (!token) throw new Error("Não autenticado");
  return token;
}

function mapDriver(d: ApiDriver): Driver {
  return {
    id: d.id,
    nome: d.nome,
    email: d.email,
    telefone: d.telefone,
    cnh: d.cnh,
    status: d.status as Driver["status"],
    avatarUrl: d.avatarUrl,
    veiculo: d.veiculo,
    endereco: d.endereco,
    metrics: d.metrics,
    documentos: d.documentos,
    corridas: [],
    localizacaoAtual: d.localizacaoAtual,
  };
}

export async function fetchDrivers(): Promise<Driver[]> {
  try {
    const token = await getToken();
    const res = await api.get<ApiDriver[]>("/drivers", token);
    return (res.data ?? []).map(mapDriver);
  } catch {
    return [];
  }
}

export async function fetchDriverById(id: string): Promise<Driver | null> {
  try {
    const token = await getToken();
    const res = await api.get<ApiDriver>(`/drivers/${id}`, token);
    return mapDriver(res.data);
  } catch {
    return null;
  }
}

export async function fetchDriverTrips(id: string): Promise<DriverTrip[]> {
  try {
    const token = await getToken();
    const res = await api.get<DriverTrip[]>(`/drivers/${id}/trips`, token);
    return res.data ?? [];
  } catch {
    return [];
  }
}
