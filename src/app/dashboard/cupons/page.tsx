import Link from "next/link";
import { Plus } from "lucide-react";
import { fetchCoupons } from "@/lib/api-coupons";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { CouponsTable } from "./_components/coupons-table";

export default async function CuponsPage() {
  const coupons = await fetchCoupons();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Cupons"
        description={`${coupons.length} cupom${coupons.length === 1 ? "" : "ns"} cadastrado${coupons.length === 1 ? "" : "s"}`}
        actions={
          <Button size="sm" nativeButton={false} render={<Link href="/dashboard/cupons/novo" />}>
            <Plus />
            Novo cupom
          </Button>
        }
      />

      <CouponsTable coupons={coupons} />
    </div>
  );
}
