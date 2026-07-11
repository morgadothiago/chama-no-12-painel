export type CouponType = "percentual" | "fixo" | "primeira_corrida" | "indicacao";

export type CouponRule = {
  valorMinimoCorrida?: number;
  primeiroUso?: boolean;
  limiteUsos?: number;
};

export type Coupon = {
  id: string;
  codigo: string;
  tipo: CouponType;
  valor: number;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  usosAtuais: number;
  limiteUsos: number;
  ativo: boolean;
  regras?: CouponRule;
};

const rawCoupons: Coupon[] = [
  {
    id: "1",
    codigo: "BEMVINDO10",
    tipo: "percentual",
    valor: 10,
    descricao: "10% de desconto na primeira corrida",
    dataInicio: "2026-01-01",
    dataFim: "2026-12-31",
    usosAtuais: 245,
    limiteUsos: 1000,
    ativo: true,
    regras: { primeiroUso: true, valorMinimoCorrida: 15 },
  },
  {
    id: "2",
    codigo: "INDICA5",
    tipo: "fixo",
    valor: 5,
    descricao: "R$ 5 de desconto para indicados",
    dataInicio: "2026-03-01",
    dataFim: "2026-12-31",
    usosAtuais: 89,
    limiteUsos: 500,
    ativo: true,
    regras: { primeiroUso: true },
  },
  {
    id: "3",
    codigo: "CHUVA15",
    tipo: "percentual",
    valor: 15,
    descricao: "15% off em dias de chuva",
    dataInicio: "2026-01-01",
    dataFim: "2026-06-30",
    usosAtuais: 410,
    limiteUsos: 500,
    ativo: false,
    regras: { valorMinimoCorrida: 20 },
  },
  {
    id: "4",
    codigo: "VIP20",
    tipo: "fixo",
    valor: 20,
    descricao: "R$ 20 de desconto para clientes VIP",
    dataInicio: "2026-04-15",
    dataFim: "2026-10-15",
    usosAtuais: 12,
    limiteUsos: 200,
    ativo: true,
    regras: { valorMinimoCorrida: 50 },
  },
  {
    id: "5",
    codigo: "PRIMEIRAVIP",
    tipo: "primeira_corrida",
    valor: 100,
    descricao: "Primeira corrida grátis (até R$ 25)",
    dataInicio: "2026-01-01",
    dataFim: "2026-12-31",
    usosAtuais: 512,
    limiteUsos: 2000,
    ativo: true,
    regras: { primeiroUso: true, valorMinimoCorrida: 0 },
  },
  {
    id: "6",
    codigo: "AMIGO10",
    tipo: "indicacao",
    valor: 10,
    descricao: "R$ 10 para quem indicou e R$ 10 para o novo usuário",
    dataInicio: "2026-05-01",
    dataFim: "2026-12-31",
    usosAtuais: 67,
    limiteUsos: 1000,
    ativo: true,
    regras: { primeiroUso: true, valorMinimoCorrida: 10 },
  },
];

export function getCoupons() {
  return rawCoupons;
}

export function getCouponById(id: string) {
  return rawCoupons.find((c) => c.id === id);
}

export function toggleCouponStatus(id: string) {
  const coupon = rawCoupons.find((c) => c.id === id);
  if (coupon) coupon.ativo = !coupon.ativo;
}
