import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { fetchDrivers } from "@/lib/api-drivers";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { DriversTable } from "./_components/drivers-table";
import { DriversTableSkeleton } from "./_components/drivers-table-skeleton";

async function DriversTableSection() {
  const drivers = await fetchDrivers();
  return <DriversTable drivers={drivers} />;
}

export default async function MotoristasPage() {
  const drivers = await fetchDrivers();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Motoristas"
        description={`${drivers.length} motorista${drivers.length === 1 ? "" : "s"} cadastrado${drivers.length === 1 ? "" : "s"}`}
        actions={
          <Button nativeButton={false} render={<Link href="/dashboard/motoristas/novo" />}>
            <Plus />
            Novo motorista
          </Button>
        }
      />

      <Suspense fallback={<DriversTableSkeleton />}>
        <DriversTableSection />
      </Suspense>
    </div>
  );
}
