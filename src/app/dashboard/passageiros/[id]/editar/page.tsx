import { notFound } from "next/navigation";
import { fetchPassengerById } from "@/lib/api-passengers";
import { PageHeader } from "@/components/shared/page-header";
import { PassengerForm } from "@/components/dashboard/passenger-form";

export default async function EditarPassageiroPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const passenger = await fetchPassengerById(id);

  if (!passenger) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Editar passageiro"
        description={`Atualize os dados de ${passenger.nome}.`}
        backHref={`/dashboard/passageiros/${passenger.id}`}
        backLabel={`Voltar para ${passenger.nome}`}
      />

      <div className="max-w-2xl">
        <PassengerForm
          passengerId={passenger.id}
          defaultValues={{
            nome: passenger.nome,
            email: passenger.email,
            telefone: passenger.telefone,
          }}
        />
      </div>
    </div>
  );
}
