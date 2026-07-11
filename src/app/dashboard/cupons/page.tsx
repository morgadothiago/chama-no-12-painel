import { Suspense } from "react";
import { getCoupons } from "@/lib/coupons";
import { PageHeader } from "@/components/shared/page-header";
import { CouponsTable } from "./_components/coupons-table";
import { CouponsTableSkeleton } from "./_components/coupons-table-skeleton";

function CouponsTableSection() {
  const coupons = getCoupons();
  return <CouponsTable coupons={coupons} />;
}

export default function CuponsPage() {
  const coupons = getCoupons();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Cupons"
        description={`${coupons.length} cupom${coupons.length === 1 ? "" : "ns"} cadastrado${coupons.length === 1 ? "" : "s"}`}
      />

      <Suspense fallback={<CouponsTableSkeleton />}>
        <CouponsTableSection />
      </Suspense>
    </div>
  );
}
