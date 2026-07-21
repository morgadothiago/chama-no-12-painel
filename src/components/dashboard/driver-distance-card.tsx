import { MapPin, Navigation } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusPill } from "@/components/dashboard/status-pill";
import { estimateTravelMinutes } from "@/lib/geo";
import { getMockPassengerRequest, getDistanceToPassengerKm, type Driver } from "@/lib/drivers";

function formatCoord(value: number) {
  return value.toFixed(4);
}

export function DriverDistanceCard({ driver }: { driver: Driver }) {
  const passenger = getMockPassengerRequest(driver);
  const distance = getDistanceToPassengerKm(driver);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">Distância até o passageiro</CardTitle>
          <StatusPill tone="neutral" label="Estimativa local · sem Google Maps" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {!driver.localizacaoAtual || !passenger || distance === null ? (
          <p className="text-sm text-muted-foreground">
            {driver.status === "ativo"
              ? "Localização do motorista indisponível no momento."
              : "Disponível apenas para motoristas ativos e em rota."}
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <dt className="flex items-center gap-1.5 text-muted-foreground">
                  <Navigation className="size-3.5" />
                  Motorista
                </dt>
                <dd className="font-medium">
                  {formatCoord(driver.localizacaoAtual.lat)}, {formatCoord(driver.localizacaoAtual.lng)}
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="size-3.5" />
                  {passenger.nome}
                </dt>
                <dd className="font-medium">
                  {formatCoord(passenger.localizacao.lat)}, {formatCoord(passenger.localizacao.lng)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Distância / tempo estimado</dt>
                <dd className="text-lg font-semibold">
                  {distance.toFixed(1)} km · ~{estimateTravelMinutes(distance)} min
                </dd>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Cálculo em linha reta (Haversine), sem considerar rotas reais de ruas ou trânsito.
              A integração com o Google Maps (Distance Matrix API) para rotas e mapa visual fica
              para uma próxima fase.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
