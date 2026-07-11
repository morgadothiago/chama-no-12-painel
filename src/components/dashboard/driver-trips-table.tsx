import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DriverTrip } from "@/lib/drivers";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function DriverTripsTable({ corridas }: { corridas: DriverTrip[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Histórico de corridas</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        {corridas.length === 0 ? (
          <p className="px-4 text-sm text-muted-foreground">
            Este motorista ainda não realizou corridas.
          </p>
        ) : (
          <div className="overflow-hidden px-4">
            <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Data</TableHead>
                    <TableHead>Origem</TableHead>
                    <TableHead>Destino</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Avaliação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {corridas.map((corrida) => (
                    <TableRow key={corrida.id}>
                      <TableCell className="text-muted-foreground">{corrida.data}</TableCell>
                      <TableCell>{corrida.origem}</TableCell>
                      <TableCell>{corrida.destino}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(corrida.valor)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {corrida.avaliacao.toFixed(1)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
