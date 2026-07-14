import { Suspense } from "react";
import { fetchRides } from "@/lib/api-rides";
import { PageHeader } from "@/components/shared/page-header";
import { RidesTable } from "./_components/rides-table";
import { RidesTableSkeleton } from "./_components/rides-table-skeleton";

async function RidesTableSection() {
  const rides = await fetchRides();
  return <RidesTable rides={rides} />;
}

export default async function CorridasPage() {
  const rides = await fetchRides();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Corridas"
        description={`${rides.length} corrida${rides.length === 1 ? "" : "s"}`}
      />

      <Suspense fallback={<RidesTableSkeleton />}>
        <RidesTableSection />
      </Suspense>
    </div>
  );
}
