"use server";

import { revalidatePath } from "next/cache";
import { cancelRide, completeRide } from "@/lib/api-rides";

export async function completeRideAction(id: string) {
  const result = await completeRide(id);
  if (result.success) {
    revalidatePath("/dashboard/corridas");
  }
  return result;
}

export async function cancelRideAction(id: string) {
  const result = await cancelRide(id);
  if (result.success) {
    revalidatePath("/dashboard/corridas");
  }
  return result;
}
