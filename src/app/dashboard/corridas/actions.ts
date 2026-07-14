"use server";

import { revalidatePath } from "next/cache";
import { completeRide } from "@/lib/api-rides";

export async function completeRideAction(id: string) {
  const result = await completeRide(id);
  if (result.success) {
    revalidatePath("/dashboard/corridas");
  }
  return result;
}
