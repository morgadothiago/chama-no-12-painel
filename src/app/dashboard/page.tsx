import { getServerSession } from "next-auth";
import { Users, UserCheck, ClockAlert } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { fetchDrivers } from "@/lib/api-drivers";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/dashboard/stat-card";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const drivers = await fetchDrivers();

  const total = drivers.length;
  const ativos = drivers.filter((driver) => driver.status === "ativo").length;
  const pendentes = drivers.filter((driver) => driver.status === "pendente").length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Bem-vindo, ${session?.user.name}`}
        description={session?.user.email}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total de motoristas" value={total} icon={Users} accent="neutral" />
        <StatCard label="Motoristas ativos" value={ativos} icon={UserCheck} accent="emerald" />
        <StatCard label="Aprovações pendentes" value={pendentes} icon={ClockAlert} accent="amber" />
      </div>
    </div>
  );
}
