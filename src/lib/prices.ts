export type TarifaPadrao = {
  valorBase: number;
  precoPorKm: number;
  precoPorMinuto: number;
  valorMinimo: number;
};

export type BandeiraTarifa = {
  nome: string;
  ativo: boolean;
  percentualAdicional: number;
  horarios: { inicio: string; fim: string; dias: string[] }[];
};

export type PrecoDinamico = {
  id: string;
  nome: string;
  fatorMultiplicador: number;
  horarioInicio: string;
  horarioFim: string;
  diasSemana: string[];
  ativo: boolean;
};

const TARIFA_PADRAO: TarifaPadrao = {
  valorBase: 5.0,
  precoPorKm: 2.5,
  precoPorMinuto: 0.5,
  valorMinimo: 10.0,
};

const BANDEIRAS: BandeiraTarifa[] = [
  {
    nome: "Bandeira 1",
    ativo: true,
    percentualAdicional: 0,
    horarios: [
      { inicio: "06:00", fim: "22:00", dias: ["seg", "ter", "qua", "qui", "sex"] },
    ],
  },
  {
    nome: "Bandeira 2",
    ativo: true,
    percentualAdicional: 25,
    horarios: [
      { inicio: "22:00", fim: "06:00", dias: ["seg", "ter", "qua", "qui", "sex"] },
      { inicio: "00:00", fim: "23:59", dias: ["sab", "dom"] },
    ],
  },
];

const PRECOS_DINAMICOS: PrecoDinamico[] = [
  {
    id: "1",
    nome: "Horário de pico matutino",
    fatorMultiplicador: 1.5,
    horarioInicio: "07:00",
    horarioFim: "09:00",
    diasSemana: ["seg", "ter", "qua", "qui", "sex"],
    ativo: true,
  },
  {
    id: "2",
    nome: "Horário de pico noturno",
    fatorMultiplicador: 1.3,
    horarioInicio: "18:00",
    horarioFim: "20:00",
    diasSemana: ["seg", "ter", "qua", "qui", "sex"],
    ativo: true,
  },
  {
    id: "3",
    nome: "Chuva intensa",
    fatorMultiplicador: 1.2,
    horarioInicio: "00:00",
    horarioFim: "23:59",
    diasSemana: ["seg", "ter", "qua", "qui", "sex", "sab", "dom"],
    ativo: false,
  },
  {
    id: "4",
    nome: "Eventos especiais (réveillon)",
    fatorMultiplicador: 2.0,
    horarioInicio: "20:00",
    horarioFim: "23:59",
    diasSemana: ["seg", "ter", "qua", "qui", "sex", "sab", "dom"],
    ativo: false,
  },
];

export function getTarifaPadrao() {
  return TARIFA_PADRAO;
}

export function getBandeiras() {
  return BANDEIRAS;
}

export function getPrecosDinamicos() {
  return PRECOS_DINAMICOS;
}

export function setTarifaPadrao(input: TarifaPadrao) {
  Object.assign(TARIFA_PADRAO, input);
}

export function toggleBandeira(nome: string) {
  const bandeira = BANDEIRAS.find((b) => b.nome === nome);
  if (bandeira) bandeira.ativo = !bandeira.ativo;
}

export function togglePrecoDinamico(id: string) {
  const preco = PRECOS_DINAMICOS.find((p) => p.id === id);
  if (preco) preco.ativo = !preco.ativo;
}
