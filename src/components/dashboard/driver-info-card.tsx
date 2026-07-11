import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Driver } from "@/lib/drivers";

export function DriverInfoCard({ driver }: { driver: Driver }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Contato</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-medium">{driver.email}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Telefone</dt>
            <dd className="font-medium">{driver.telefone}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">CNH</dt>
            <dd className="font-medium">{driver.cnh}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
