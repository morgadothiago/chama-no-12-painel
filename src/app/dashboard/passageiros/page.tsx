import { Suspense } from "react";
import { fetchPassengers } from "@/lib/api-passengers";
import type { Passenger } from "@/lib/passengers";
import { PageHeader } from "@/components/shared/page-header";
import { PassengersTable } from "./_components/passengers-table";
import { PassengersTableSkeleton } from "./_components/passengers-table-skeleton";

function PassengersTableSection({ passengers }: { passengers: Passenger[] }) {
  return <PassengersTable passengers={passengers} />;
}

export default async function PassageirosPage() {
  const passengers = await fetchPassengers();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Passageiros"
        description={`${passengers.length} passageiro${passengers.length === 1 ? "" : "s"} cadastrado${passengers.length === 1 ? "" : "s"}`}
      />

      <Suspense fallback={<PassengersTableSkeleton />}>
        <PassengersTableSection passengers={passengers} />
      </Suspense>
    </div>
  );
}
