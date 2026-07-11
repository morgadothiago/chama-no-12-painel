import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Vehicle } from "@/lib/drivers";

export function VehicleInfoCard({ veiculo }: { veiculo: Vehicle }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Veículo</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted-foreground">Placa</dt>
            <dd className="font-medium">{veiculo.placa}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Modelo</dt>
            <dd className="font-medium">{veiculo.modelo}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Ano</dt>
            <dd className="font-medium">{veiculo.ano}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
