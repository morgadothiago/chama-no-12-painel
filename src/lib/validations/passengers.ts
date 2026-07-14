import { z } from "zod";

export const passengerFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
  telefone: z.string().min(1, "Telefone é obrigatório"),
});

export type PassengerFormInput = z.infer<typeof passengerFormSchema>;
