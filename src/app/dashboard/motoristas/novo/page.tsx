import { PageHeader } from "@/components/shared/page-header";
import { DriverForm } from "@/components/dashboard/driver-form";

export default function NovoMotoristaPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Novo motorista"
        description="O motorista será cadastrado com status pendente até a aprovação."
        backHref="/dashboard/motoristas"
        backLabel="Voltar para motoristas"
      />

      <div className="max-w-2xl">
        <DriverForm mode="create" />
      </div>
    </div>
  );
}
