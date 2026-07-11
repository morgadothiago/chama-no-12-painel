import { driverSchema, type DriverStatus } from "@/lib/validations/drivers";
import { distanceKm, type LatLng } from "@/lib/geo";

export type { LatLng };

export type Vehicle = {
  placa: string;
  modelo: string;
  ano: number;
};

export type DriverMetrics = {
  corridas: number;
  avaliacaoMedia: number;
  ganhos: number;
};

export type DocumentTipo = "cnh" | "crlv" | "foto_veiculo";
export type DocumentStatus = "aprovado" | "pendente" | "rejeitado";

export type DriverDocument = {
  tipo: DocumentTipo;
  status: DocumentStatus;
  enviadoEm: string;
};

export type DriverTrip = {
  id: string;
  data: string;
  origem: string;
  destino: string;
  valor: number;
  avaliacao: number;
};

export type DriverAddress = {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
};

export type Driver = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cnh: string;
  status: DriverStatus;
  avatarUrl: string | null;
  veiculo: Vehicle;
  endereco: DriverAddress;
  metrics: DriverMetrics;
  documentos: DriverDocument[];
  corridas: DriverTrip[];
  // Coordenadas mock — sem integração real com Google Maps ainda.
  localizacaoAtual: LatLng | null;
};

function tripsFor(driverId: string, count: number): DriverTrip[] {
  const origens = ["Centro", "Praça da Sé", "Rodoviária", "Zona Sul", "Jardim América", "Bairro Alto"];
  const destinos = ["Aeroporto", "Shopping", "Terminal Rodoviário", "Zona Norte", "Vila Nova", "Estação Central"];

  return Array.from({ length: count }, (_, index) => {
    const day = 20 - index * 3;
    return {
      id: `${driverId}-trip-${index + 1}`,
      data: `2026-07-${String(Math.max(day, 1)).padStart(2, "0")}`,
      origem: origens[index % origens.length],
      destino: destinos[index % destinos.length],
      valor: Number((12 + index * 4.5).toFixed(2)),
      avaliacao: Number((4 + (index % 2 === 0 ? 0.9 : 0.6)).toFixed(1)),
    };
  });
}

// Endereço fake reaproveitado nos motoristas mock abaixo — só pra satisfazer
// o tipo `Driver`, não é lido em lugar nenhum (nenhum dos dois consumidores
// reais deste arquivo, `getMockPassengerRequest`/`getDistanceToPassengerKm`,
// usa endereço).
const MOCK_ENDERECO: DriverAddress = {
  cep: "01310-100",
  logradouro: "Av. Paulista",
  numero: "1000",
  bairro: "Bela Vista",
  cidade: "São Paulo",
  uf: "SP",
};

// Mock in-memory driver store. Replace with a real DB lookup later.
// Mutated directly by Server Actions (approve/reject/activate/edit/create) —
// state resets whenever the dev server restarts.
const rawDrivers: Driver[] = [
  {
    id: "1",
    nome: "Carlos Eduardo Silva",
    email: "carlos.silva@example.com",
    telefone: "(11) 98765-4321",
    cnh: "12345678900",
    status: "ativo",
    avatarUrl: null,
    veiculo: { placa: "ABC1D23", modelo: "Chevrolet Onix", ano: 2021 },
    endereco: MOCK_ENDERECO,
    metrics: { corridas: 1284, avaliacaoMedia: 4.8, ganhos: 18420.5 },
    documentos: [
      { tipo: "cnh", status: "aprovado", enviadoEm: "2026-01-10" },
      { tipo: "crlv", status: "aprovado", enviadoEm: "2026-01-10" },
      { tipo: "foto_veiculo", status: "aprovado", enviadoEm: "2026-01-10" },
    ],
    corridas: tripsFor("1", 6),
    localizacaoAtual: { lat: -23.5505, lng: -46.6333 }, // Praça da Sé, SP
  },
  {
    id: "2",
    nome: "Fernanda Costa Lima",
    email: "fernanda.lima@example.com",
    telefone: "(21) 99876-5432",
    cnh: "23456789011",
    status: "ativo",
    avatarUrl: null,
    veiculo: { placa: "DEF2E34", modelo: "Fiat Argo", ano: 2022 },
    endereco: MOCK_ENDERECO,
    metrics: { corridas: 942, avaliacaoMedia: 4.9, ganhos: 15230.0 },
    documentos: [
      { tipo: "cnh", status: "aprovado", enviadoEm: "2026-02-02" },
      { tipo: "crlv", status: "aprovado", enviadoEm: "2026-02-02" },
      { tipo: "foto_veiculo", status: "aprovado", enviadoEm: "2026-02-02" },
    ],
    corridas: tripsFor("2", 5),
    localizacaoAtual: { lat: -23.5613, lng: -46.6565 }, // Av. Paulista, SP
  },
  {
    id: "3",
    nome: "Ricardo Almeida Souza",
    email: "ricardo.souza@example.com",
    telefone: "(31) 98123-4567",
    cnh: "34567890122",
    status: "pendente",
    avatarUrl: null,
    veiculo: { placa: "GHI3F45", modelo: "Hyundai HB20", ano: 2020 },
    endereco: MOCK_ENDERECO,
    metrics: { corridas: 0, avaliacaoMedia: 0, ganhos: 0 },
    documentos: [
      { tipo: "cnh", status: "aprovado", enviadoEm: "2026-06-28" },
      { tipo: "crlv", status: "pendente", enviadoEm: "2026-06-28" },
      { tipo: "foto_veiculo", status: "pendente", enviadoEm: "2026-06-28" },
    ],
    corridas: [],
    localizacaoAtual: null, // ainda pendente de aprovação, não está em rota
  },
  {
    id: "4",
    nome: "Juliana Pereira Santos",
    email: "juliana.santos@example.com",
    telefone: "(41) 99234-5678",
    cnh: "45678901233",
    status: "ativo",
    avatarUrl: null,
    veiculo: { placa: "JKL4G56", modelo: "Volkswagen Gol", ano: 2019 },
    endereco: MOCK_ENDERECO,
    metrics: { corridas: 2130, avaliacaoMedia: 4.6, ganhos: 27890.75 },
    documentos: [
      { tipo: "cnh", status: "aprovado", enviadoEm: "2025-11-14" },
      { tipo: "crlv", status: "aprovado", enviadoEm: "2025-11-14" },
      { tipo: "foto_veiculo", status: "aprovado", enviadoEm: "2025-11-14" },
    ],
    corridas: tripsFor("4", 6),
    localizacaoAtual: { lat: -23.5335, lng: -46.6367 }, // Zona Norte, SP
  },
  {
    id: "5",
    nome: "Marcos Vinícius Oliveira",
    email: "marcos.oliveira@example.com",
    telefone: "(51) 98345-6789",
    cnh: "56789012344",
    status: "inativo",
    avatarUrl: null,
    veiculo: { placa: "MNO5H67", modelo: "Renault Kwid", ano: 2018 },
    endereco: MOCK_ENDERECO,
    metrics: { corridas: 356, avaliacaoMedia: 4.2, ganhos: 4870.3 },
    documentos: [
      { tipo: "cnh", status: "aprovado", enviadoEm: "2025-08-05" },
      { tipo: "crlv", status: "aprovado", enviadoEm: "2025-08-05" },
      { tipo: "foto_veiculo", status: "rejeitado", enviadoEm: "2025-08-05" },
    ],
    corridas: tripsFor("5", 4),
    localizacaoAtual: null, // inativo, fora de rota
  },
  {
    id: "6",
    nome: "Patrícia Rodrigues Nunes",
    email: "patricia.nunes@example.com",
    telefone: "(61) 99456-7890",
    cnh: "67890123455",
    status: "ativo",
    avatarUrl: null,
    veiculo: { placa: "PQR6I78", modelo: "Toyota Corolla", ano: 2023 },
    endereco: MOCK_ENDERECO,
    metrics: { corridas: 578, avaliacaoMedia: 4.95, ganhos: 12340.9 },
    documentos: [
      { tipo: "cnh", status: "aprovado", enviadoEm: "2026-03-20" },
      { tipo: "crlv", status: "aprovado", enviadoEm: "2026-03-20" },
      { tipo: "foto_veiculo", status: "aprovado", enviadoEm: "2026-03-20" },
    ],
    corridas: tripsFor("6", 5),
    localizacaoAtual: { lat: -23.5878, lng: -46.6413 }, // Zona Sul, SP
  },
  {
    id: "7",
    nome: "Bruno Henrique Martins",
    email: "bruno.martins@example.com",
    telefone: "(71) 98567-8901",
    cnh: "78901234566",
    status: "pendente",
    avatarUrl: null,
    veiculo: { placa: "STU7J89", modelo: "Honda City", ano: 2021 },
    endereco: MOCK_ENDERECO,
    metrics: { corridas: 12, avaliacaoMedia: 4.1, ganhos: 210.0 },
    documentos: [
      { tipo: "cnh", status: "pendente", enviadoEm: "2026-07-01" },
      { tipo: "crlv", status: "pendente", enviadoEm: "2026-07-01" },
      { tipo: "foto_veiculo", status: "aprovado", enviadoEm: "2026-07-01" },
    ],
    corridas: tripsFor("7", 2),
    localizacaoAtual: null, // ainda pendente de aprovação, não está em rota
  },
  {
    id: "8",
    nome: "Camila Ferreira Rocha",
    email: "camila.rocha@example.com",
    telefone: "(81) 99678-9012",
    cnh: "89012345677",
    status: "inativo",
    avatarUrl: null,
    veiculo: { placa: "VWX8K90", modelo: "Jeep Renegade", ano: 2020 },
    endereco: MOCK_ENDERECO,
    metrics: { corridas: 764, avaliacaoMedia: 4.4, ganhos: 9820.6 },
    documentos: [
      { tipo: "cnh", status: "aprovado", enviadoEm: "2025-12-11" },
      { tipo: "crlv", status: "aprovado", enviadoEm: "2025-12-11" },
      { tipo: "foto_veiculo", status: "aprovado", enviadoEm: "2025-12-11" },
    ],
    corridas: tripsFor("8", 5),
    localizacaoAtual: null, // inativo, fora de rota
  },
];

export const drivers: Driver[] = rawDrivers.map((driver) => driverSchema.parse(driver));

let nextId = drivers.length + 1;

export function getDrivers() {
  return drivers;
}

export function getDriverById(id: string) {
  return drivers.find((driver) => driver.id === id);
}

// --- Distância motorista → passageiro (mock, sem Google Maps ainda) ---
// Google Maps (Distance Matrix/Directions API) fica para uma fase futura —
// por enquanto simulamos uma "solicitação de passageiro" próxima ao motorista
// e calculamos a distância em linha reta (Haversine, ver src/lib/geo.ts).

export type PassengerRequest = {
  nome: string;
  localizacao: LatLng;
};

export function getMockPassengerRequest(driver: Driver): PassengerRequest | null {
  if (!driver.localizacaoAtual || driver.status !== "ativo") return null;

  // Offset determinístico a partir do id do motorista, só para o mock ser
  // estável entre renders (não é geolocalização real).
  const seed = driver.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const angleRad = (seed % 360) * (Math.PI / 180);
  const offsetKm = 1 + (seed % 4); // 1 a 4 km do motorista

  const latRad = driver.localizacaoAtual.lat * (Math.PI / 180);
  const offsetLat = (offsetKm / 111) * Math.cos(angleRad);
  const offsetLng = (offsetKm / (111 * Math.cos(latRad))) * Math.sin(angleRad);

  return {
    nome: "Passageiro em espera",
    localizacao: {
      lat: driver.localizacaoAtual.lat + offsetLat,
      lng: driver.localizacaoAtual.lng + offsetLng,
    },
  };
}

export function getDistanceToPassengerKm(driver: Driver): number | null {
  const passenger = getMockPassengerRequest(driver);
  if (!passenger || !driver.localizacaoAtual) return null;

  return distanceKm(driver.localizacaoAtual, passenger.localizacao);
}

// --- Mutation helpers, used exclusively by Server Actions ---
// All of them mutate the module-level `drivers` array in place so existing
// references (and the array returned by getDrivers) stay valid.

export function createDriver(input: {
  nome: string;
  email: string;
  telefone: string;
  cnh: string;
  veiculo: Vehicle;
}): Driver {
  const driver: Driver = {
    id: String(nextId++),
    nome: input.nome,
    email: input.email,
    telefone: input.telefone,
    cnh: input.cnh,
    status: "pendente",
    avatarUrl: null,
    veiculo: input.veiculo,
    endereco: MOCK_ENDERECO,
    metrics: { corridas: 0, avaliacaoMedia: 0, ganhos: 0 },
    documentos: [
      { tipo: "cnh", status: "pendente", enviadoEm: new Date().toISOString().slice(0, 10) },
      { tipo: "crlv", status: "pendente", enviadoEm: new Date().toISOString().slice(0, 10) },
      { tipo: "foto_veiculo", status: "pendente", enviadoEm: new Date().toISOString().slice(0, 10) },
    ],
    corridas: [],
    localizacaoAtual: null,
  };

  drivers.push(driver);
  return driver;
}

export function updateDriver(
  id: string,
  input: {
    nome: string;
    email: string;
    telefone: string;
    cnh: string;
    veiculo: Vehicle;
  }
): Driver | undefined {
  const driver = getDriverById(id);
  if (!driver) return undefined;

  driver.nome = input.nome;
  driver.email = input.email;
  driver.telefone = input.telefone;
  driver.cnh = input.cnh;
  driver.veiculo = input.veiculo;

  return driver;
}

export function setDriverStatus(id: string, status: DriverStatus): Driver | undefined {
  const driver = getDriverById(id);
  if (!driver) return undefined;

  driver.status = status;
  return driver;
}

export function removeDriver(id: string): boolean {
  const index = drivers.findIndex((driver) => driver.id === id);
  if (index === -1) return false;

  drivers.splice(index, 1);
  return true;
}

export function setDocumentStatus(
  driverId: string,
  tipo: DocumentTipo,
  status: DocumentStatus
): Driver | undefined {
  const driver = getDriverById(driverId);
  if (!driver) return undefined;

  const document = driver.documentos.find((doc) => doc.tipo === tipo);
  if (document) {
    document.status = status;
    document.enviadoEm = new Date().toISOString().slice(0, 10);
  }

  return driver;
}
