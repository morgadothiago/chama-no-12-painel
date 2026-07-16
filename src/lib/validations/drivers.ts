import { z } from "zod";

export const driverStatusSchema = z.enum(["ativo", "inativo", "pendente", "rejeitado"]);

export type DriverStatus = z.infer<typeof driverStatusSchema>;

export const vehicleSchema = z.object({
  placa: z.string().min(1, "Placa é obrigatória"),
  modelo: z.string().min(1, "Modelo é obrigatório"),
  ano: z.number().int().min(1990).max(2100),
});

export const addressSchema = z.object({
  cep: z.string().min(1, "CEP é obrigatório"),
  logradouro: z.string().min(1, "Logradouro é obrigatório"),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().min(1, "Bairro é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  uf: z.string().length(2, "UF deve ter 2 letras"),
});

export const driverMetricsSchema = z.object({
  corridas: z.number().int().nonnegative(),
  avaliacaoMedia: z.number().min(0).max(5),
  ganhos: z.number().nonnegative(),
});

export const documentTipoSchema = z.enum(["cnh", "crlv", "foto_veiculo"]);
export type DocumentTipo = z.infer<typeof documentTipoSchema>;

export const documentStatusSchema = z.enum(["aprovado", "pendente", "rejeitado"]);
export type DocumentStatus = z.infer<typeof documentStatusSchema>;

export const driverDocumentSchema = z.object({
  tipo: documentTipoSchema,
  status: documentStatusSchema,
  enviadoEm: z.string().min(1),
});

export const driverTripSchema = z.object({
  id: z.string().min(1),
  data: z.string().min(1),
  origem: z.string().min(1),
  destino: z.string().min(1),
  valor: z.number().nonnegative(),
  avaliacao: z.number().min(0).max(5),
});

// Coordenadas mock (sem Google Maps por enquanto) usadas para calcular a
// distância aproximada motorista → passageiro via Haversine (ver src/lib/geo.ts).
export const latLngSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const driverSchema = z.object({
  id: z.string().min(1),
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
  telefone: z.string().min(1, "Telefone é obrigatório"),
  cnh: z.string().min(1, "CNH é obrigatória"),
  status: driverStatusSchema,
  avatarUrl: z.string().nullable(),
  veiculo: vehicleSchema,
  endereco: addressSchema,
  metrics: driverMetricsSchema,
  documentos: z.array(driverDocumentSchema),
  corridas: z.array(driverTripSchema),
  localizacaoAtual: latLngSchema.nullable(),
});

export type DriverFormValues = z.infer<typeof driverSchema>;

// Schema for the create/edit driver form (basic info + vehicle only).
// Status, metrics, documentos and corridas are managed separately/by the system.
export const driverFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
  telefone: z.string().min(1, "Telefone é obrigatório"),
  cnh: z.string().min(1, "CNH é obrigatória"),
  veiculo: vehicleSchema,
  endereco: addressSchema,
});

export type DriverFormInput = z.infer<typeof driverFormSchema>;
