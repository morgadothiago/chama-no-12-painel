import { notFound } from "next/navigation";
import { fetchDriverById } from "@/lib/api-drivers";
import { PageHeader } from "@/components/shared/page-header";
import { DriverForm } from "@/components/dashboard/driver-form";

export default async function EditarMotoristaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const driver = await fetchDriverById(id);

  if (!driver) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Editar motorista"
        description={`Atualize os dados de ${driver.nome}.`}
        backHref={`/dashboard/motoristas/${driver.id}`}
        backLabel={`Voltar para ${driver.nome}`}
      />

      <div className="max-w-2xl">
        <DriverForm
          mode="edit"
          driverId={driver.id}
          defaultValues={{
            nome: driver.nome,
            email: driver.email,
            telefone: driver.telefone,
            cnh: driver.cnh,
            veiculo: driver.veiculo,
            endereco: driver.endereco,
          }}
        />
      </div>
    </div>
  );
}
