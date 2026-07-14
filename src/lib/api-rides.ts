import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { api } from "@/lib/api-client";

export type RideStatus = "solicitada" | "aceita" | "iniciada" | "finalizada" | "cancelada";

export type Ride = {
  id: string;
  driverId: string | null;
  passengerId: string | null;
  passengerName: string;
  passengerPhone: string | null;
  origem: string;
  destino: string;
  status: RideStatus;
  valor: number | null;
  distanciaKm: number | null;
  avaliacao: number | null;
  solicitadaEm: string;
  aceitaEm: string | null;
  iniciadaEm: string | null;
  finalizadaEm: string | null;
  canceladaEm: string | null;
  canceladoPor: "motorista" | "passageiro" | "sistema" | null;
  motivoCancelamento: string | null;
};

async function getToken(): Promise<string> {
  const session = await getServerSession(authOptions);
  const token = (session?.user as { apiToken?: string } | undefined)?.apiToken;
  if (!token) throw new Error("Não autenticado");
  return token;
}

export async function fetchRides(params?: { status?: RideStatus }): Promise<Ride[]> {
  try {
    const token = await getToken();
    const query = params?.status ? `?status=${params.status}&limit=100` : "?limit=100";
    const res = await api.get<Ride[]>(`/rides${query}`, token);
    return res.data ?? [];
  } catch {
    return [];
  }
}

export async function fetchRideById(id: string): Promise<Ride | null> {
  try {
    const token = await getToken();
    const res = await api.get<Ride>(`/rides/${id}`, token);
    return res.data;
  } catch {
    return null;
  }
}

export async function completeRide(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await getToken();
    await api.post(`/rides/${id}/complete`, undefined, token);
    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

export async function cancelRide(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await getToken();
    await api.post(
      `/rides/${id}/cancel`,
      { canceladoPor: "sistema", motivo: "Cancelada pelo admin no painel" },
      token,
    );
    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}
