import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Mail, Pencil, Phone, Route, Wallet } from "lucide-react";
import { fetchPassengerById } from "@/lib/api-passengers";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PassengerStatusActions } from "@/components/dashboard/passenger-status-actions";
import { PassengerStatusBadge } from "@/components/dashboard/passenger-status-badge";
import { InfoItem } from "@/components/dashboard/info-item";
import { MetricTile } from "@/components/dashboard/metric-tile";
import { cn } from "@/lib/utils";

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
            <PassengerStatusBadge status={passenger.status} />
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
              <InfoItem icon={Mail} label="Email" value={passenger.email} />
              <InfoItem icon={Phone} label="Telefone" value={passenger.telefone} />
              <InfoItem
                icon={Calendar}
                label="Cadastro"
                value={new Date(passenger.cadastroEm).toLocaleDateString("pt-BR")}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Histórico de corridas ({passenger.corridas.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <div className="overflow-hidden px-4">
                <div className="overflow-hidden rounded-xl ring-1 ring-border">
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
                              <span
                                className={cn(
                                  "text-sm font-medium",
                                  trip.avaliacao >= 4
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : trip.avaliacao >= 2
                                      ? "text-amber-600 dark:text-amber-400"
                                      : "text-red-600 dark:text-red-400",
                                )}
                              >
                                {trip.avaliacao.toFixed(1)}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resumo</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <MetricTile
                label="Total de corridas"
                value={passenger.totalCorridas}
                icon={Route}
                accent="blue"
              />
              <MetricTile
                label="Total gasto"
                value={`R$ ${passenger.totalGasto.toFixed(2)}`}
                icon={Wallet}
                accent="emerald"
              />
              <MetricTile
                label="Última corrida"
                value={
                  passenger.ultimaCorrida
                    ? new Date(passenger.ultimaCorrida + "T12:00:00").toLocaleDateString("pt-BR")
                    : "—"
                }
                icon={Calendar}
                accent="neutral"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
