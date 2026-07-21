"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FileCheck2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusPill, type StatusTone } from "@/components/dashboard/status-pill";
import type { DriverDocument, DocumentTipo } from "@/lib/drivers";
import { simulateDocumentUploadAction } from "@/app/dashboard/motoristas/actions";

const DOCUMENT_LABELS: Record<DocumentTipo, string> = {
  cnh: "CNH",
  crlv: "CRLV",
  foto_veiculo: "Foto do veículo",
};

const STATUS_CONFIG: Record<DriverDocument["status"], { label: string; tone: StatusTone }> = {
  aprovado: { label: "Aprovado", tone: "success" },
  pendente: { label: "Pendente", tone: "warning" },
  rejeitado: { label: "Rejeitado", tone: "danger" },
};

export function DriverDocumentsCard({
  driverId,
  documentos,
}: {
  driverId: string;
  documentos: DriverDocument[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingTipo, setPendingTipo] = useState<DocumentTipo | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSimulateUpload(tipo: DocumentTipo) {
    setError(null);
    setPendingTipo(tipo);
    startTransition(async () => {
      const result = await simulateDocumentUploadAction(driverId, tipo);
      if (!result.success) {
        setError(result.error);
      }
      router.refresh();
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Documentos</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {documentos.map((documento) => {
          const config = STATUS_CONFIG[documento.status];
          const isThisPending = isPending && pendingTipo === documento.tipo;

          return (
            <div
              key={documento.tipo}
              className="flex flex-col gap-2 rounded-xl ring-1 ring-border p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-2.5">
                <FileCheck2 className="size-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{DOCUMENT_LABELS[documento.tipo]}</span>
                  <span className="text-xs text-muted-foreground">
                    Enviado em {documento.enviadoEm}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusPill tone={config.tone} label={config.label} />
                {documento.status !== "aprovado" && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={isPending}
                    onClick={() => handleSimulateUpload(documento.tipo)}
                  >
                    {isThisPending && <Loader2 className="animate-spin" />}
                    Simular envio
                  </Button>
                )}
              </div>
            </div>
          );
        })}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  );
}
