export type PassengerTrip = {
  id: string;
  data: string;
  origem: string;
  destino: string;
  valor: number;
  motorista: string;
  avaliacao: number;
};

export type Passenger = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  avatarUrl: string | null;
  status: "ativo" | "inativo" | "bloqueado";
  totalCorridas: number;
  totalGasto: number;
  cadastroEm: string;
  ultimaCorrida: string | null;
  corridas: PassengerTrip[];
};

const rawPassengers: Passenger[] = [
  {
    id: "1",
    nome: "Ana Beatriz Oliveira",
    email: "ana.oliveira@example.com",
    telefone: "(11) 91234-5678",
    avatarUrl: null,
    status: "ativo",
    totalCorridas: 47,
    totalGasto: 823.5,
    cadastroEm: "2025-12-01",
    ultimaCorrida: "2026-07-08",
    corridas: [
      { id: "p1-t1", data: "2026-07-08", origem: "Centro", destino: "Shopping", valor: 18.5, motorista: "Carlos Eduardo Silva", avaliacao: 5 },
      { id: "p1-t2", data: "2026-07-05", origem: "Aeroporto", destino: "Zona Sul", valor: 45.0, motorista: "Fernanda Costa Lima", avaliacao: 4 },
    ],
  },
  {
    id: "2",
    nome: "Lucas Mendes Rocha",
    email: "lucas.rocha@example.com",
    telefone: "(21) 99887-6543",
    avatarUrl: null,
    status: "ativo",
    totalCorridas: 23,
    totalGasto: 412.3,
    cadastroEm: "2026-02-15",
    ultimaCorrida: "2026-07-07",
    corridas: [
      { id: "p2-t1", data: "2026-07-07", origem: "Praça da Sé", destino: "Rodoviária", valor: 22.0, motorista: "Ricardo Almeida Souza", avaliacao: 3 },
    ],
  },
  {
    id: "3",
    nome: "Marina Costa Santos",
    email: "marina.santos@example.com",
    telefone: "(31) 98765-4321",
    avatarUrl: null,
    status: "inativo",
    totalCorridas: 8,
    totalGasto: 156.0,
    cadastroEm: "2025-10-20",
    ultimaCorrida: "2026-04-12",
    corridas: [],
  },
  {
    id: "4",
    nome: "Thiago Almeida Pereira",
    email: "thiago.pereira@example.com",
    telefone: "(41) 97654-3210",
    avatarUrl: null,
    status: "ativo",
    totalCorridas: 112,
    totalGasto: 2100.75,
    cadastroEm: "2025-08-10",
    ultimaCorrida: "2026-07-09",
    corridas: [
      { id: "p4-t1", data: "2026-07-09", origem: "Zona Norte", destino: "Aeroporto", valor: 35.0, motorista: "Juliana Pereira Santos", avaliacao: 5 },
      { id: "p4-t2", data: "2026-07-08", origem: "Estação Central", destino: "Jardim América", valor: 12.5, motorista: "Carlos Eduardo Silva", avaliacao: 4 },
      { id: "p4-t3", data: "2026-07-06", origem: "Centro", destino: "Vila Nova", valor: 19.0, motorista: "Patrícia Rodrigues Nunes", avaliacao: 5 },
    ],
  },
  {
    id: "5",
    nome: "Camila Duarte Farias",
    email: "camila.farias@example.com",
    telefone: "(51) 96543-2109",
    avatarUrl: null,
    status: "bloqueado",
    totalCorridas: 3,
    totalGasto: 67.0,
    cadastroEm: "2026-05-01",
    ultimaCorrida: "2026-06-20",
    corridas: [
      { id: "p5-t1", data: "2026-06-20", origem: "Bairro Alto", destino: "Centro", valor: 15.0, motorista: "Marcos Vinícius Oliveira", avaliacao: 1 },
    ],
  },
];

export function getPassengers() {
  return rawPassengers;
}

export function getPassengerById(id: string) {
  return rawPassengers.find((p) => p.id === id);
}
