import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";
import { fetchDriverById, fetchDriverTrips } from "@/lib/api-drivers";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { DriverAvatar } from "@/components/dashboard/driver-avatar";
import { DriverInfoCard } from "@/components/dashboard/driver-info-card";
import { VehicleInfoCard } from "@/components/dashboard/vehicle-info-card";
import { DriverMetricsCard } from "@/components/dashboard/driver-metrics-card";
import { DriverDocumentsCard } from "@/components/dashboard/driver-documents-card";
import { DriverTripsTable } from "@/components/dashboard/driver-trips-table";
import { DriverStatusActions } from "@/components/dashboard/driver-status-actions";
import { DriverDistanceCard } from "@/components/dashboard/driver-distance-card";

export default async function MotoristaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const driver = await fetchDriverById(id);
  const trips = await fetchDriverTrips(id);

  if (!driver) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        backHref="/dashboard/motoristas"
        backLabel="Voltar para motoristas"
        title={
          <span className="flex items-center gap-2.5">
            <DriverAvatar nome={driver.nome} avatarUrl={driver.avatarUrl} className="size-9" />
            {driver.nome}
            <StatusBadge status={driver.status} />
          </span>
        }
        description={driver.email}
        actions={
          <>
            <Button
              size="sm"
              variant="outline"
              nativeButton={false}
              render={<Link href={`/dashboard/motoristas/${driver.id}/editar`} />}
            >
              <Pencil />
              Editar
            </Button>
            <DriverStatusActions driver={driver} />
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <DriverInfoCard driver={driver} />
          <VehicleInfoCard veiculo={driver.veiculo} />
          <DriverTripsTable corridas={trips} />
        </div>

        <div className="flex flex-col gap-4">
          <DriverMetricsCard metrics={driver.metrics} />
          <DriverDistanceCard driver={driver} />
          <DriverDocumentsCard driverId={driver.id} documentos={driver.documentos} />
        </div>
      </div>
    </div>
  );
}
