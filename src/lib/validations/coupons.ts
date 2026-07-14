import { z } from "zod";

export const couponFormSchema = z.object({
  codigo: z.string().min(3, "Código deve ter ao menos 3 caracteres").toUpperCase(),
  tipoDesconto: z.enum(["percentual", "fixo"]),
  valor: z.number().min(0, "Valor deve ser positivo"),
});

export type CouponFormInput = z.infer<typeof couponFormSchema>;
