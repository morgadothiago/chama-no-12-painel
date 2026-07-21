import { IdCard, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoItem } from "@/components/dashboard/info-item";
import type { Driver } from "@/lib/drivers";

export function DriverInfoCard({ driver }: { driver: Driver }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Contato</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <InfoItem icon={Mail} label="Email" value={driver.email} />
          <InfoItem icon={Phone} label="Telefone" value={driver.telefone} />
          <InfoItem icon={IdCard} label="CNH" value={driver.cnh} />
        </dl>
      </CardContent>
    </Card>
  );
}
