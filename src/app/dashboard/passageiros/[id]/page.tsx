import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";
import { fetchPassengerById } from "@/lib/api-passengers";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PassengerStatusActions } from "@/components/dashboard/passenger-status-actions";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  ativo: {
    label: "Ativo",
    className: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
  inativo: {
    label: "Inativo",
    className: "bg-muted text-muted-foreground",
  },
  bloqueado: {
    label: "Bloqueado",
    className: "bg-red-500/10 text-red-600 dark:bg-red-500/15 dark:text-red-400",
  },
  excluido: {
    label: "Excluído",
    className: "bg-muted text-muted-foreground",
  },
};

export default async function PassageiroDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const passenger = await fetchPassengerById(id);

  if (!passenger) {
    notFound();
  }

  const statusConfig = STATUS_CONFIG[passenger.status];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        backHref="/dashboard/passageiros"
        backLabel="Voltar para passageiros"
        title={
          <span className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
              {passenger.nome.charAt(0).toUpperCase()}
            </span>
            {passenger.nome}
            <Badge
              variant="outline"
              className={cn("border-transparent font-medium", statusConfig.className)}
            >
              {statusConfig.label}
            </Badge>
          </span>
        }
        description={passenger.email}
        actions={
          <>
            <Button
              size="sm"
              variant="outline"
              nativeButton={false}
              render={<Link href={`/dashboard/passageiros/${passenger.id}/editar`} />}
            >
              <Pencil />
              Editar
            </Button>
            <PassengerStatusActions passenger={passenger} />
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informações do passageiro</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Nome</p>
                <p className="text-sm font-medium">{passenger.nome}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{passenger.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Telefone</p>
                <p className="text-sm font-medium">{passenger.telefone}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Cadastro</p>
                <p className="text-sm font-medium">
                  {new Date(passenger.cadastroEm).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Histórico de corridas ({passenger.corridas.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Data</TableHead>
                    <TableHead>Origem</TableHead>
                    <TableHead>Destino</TableHead>
                    <TableHead>Motorista</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Avaliação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {passenger.corridas.length === 0 ? (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                        Nenhuma corrida realizada
                      </TableCell>
                    </TableRow>
                  ) : (
                    passenger.corridas.map((trip) => (
                      <TableRow key={trip.id}>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(trip.data + "T12:00:00").toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell className="text-sm">{trip.origem}</TableCell>
                        <TableCell className="text-sm">{trip.destino}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{trip.motorista}</TableCell>
                        <TableCell className="font-medium">R$ {trip.valor.toFixed(2)}</TableCell>
                        <TableCell>
                          <span className={cn(
                            "text-sm font-medium",
                            trip.avaliacao >= 4 ? "text-emerald-600" : trip.avaliacao >= 2 ? "text-amber-600" : "text-red-600"
                          )}>
                            {trip.avaliacao.toFixed(1)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resumo</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <span className="text-sm text-muted-foreground">Total de corridas</span>
                <span className="text-lg font-semibold">{passenger.totalCorridas}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <span className="text-sm text-muted-foreground">Total gasto</span>
                <span className="text-lg font-semibold">R$ {passenger.totalGasto.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Última corrida</span>
                <span className="text-sm font-medium">
                  {passenger.ultimaCorrida
                    ? new Date(passenger.ultimaCorrida + "T12:00:00").toLocaleDateString("pt-BR")
                    : "—"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
