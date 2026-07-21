import { Calendar, Car, Hash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoItem } from "@/components/dashboard/info-item";
import type { Vehicle } from "@/lib/drivers";

export function VehicleInfoCard({ veiculo }: { veiculo: Vehicle }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Veículo</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <InfoItem icon={Hash} label="Placa" value={veiculo.placa} />
          <InfoItem icon={Car} label="Modelo" value={veiculo.modelo} />
          <InfoItem icon={Calendar} label="Ano" value={veiculo.ano} />
        </dl>
      </CardContent>
    </Card>
  );
}
