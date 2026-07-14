import { PageHeader } from "@/components/shared/page-header";
import { CouponForm } from "@/components/dashboard/coupon-form";

export default function NovoCupomPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Novo cupom"
        description="O cupom fica ativo assim que criado."
        backHref="/dashboard/cupons"
        backLabel="Voltar para cupons"
      />

      <div className="max-w-lg">
        <CouponForm />
      </div>
    </div>
  );
}
