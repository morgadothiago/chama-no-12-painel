import { getBandeiras, getPrecosDinamicos } from "@/lib/prices";
import { fetchTarifaPadrao } from "@/lib/api-pricing";
import { TarifaPadraoForm } from "@/components/dashboard/tarifa-padrao-form";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusPill } from "@/components/dashboard/status-pill";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const DIAS_LABEL: Record<string, string> = {
  seg: "Seg", ter: "Ter", qua: "Qua", qui: "Qui", sex: "Sex", sab: "Sáb", dom: "Dom",
};

const FALLBACK_TARIFA = { taxaBase: 5, valorPorKm: 2.5, valorPorMinuto: 0.5, valorMinimo: 10 };

export default async function PrecoPage() {
  const tarifaApi = await fetchTarifaPadrao();
  const bandeiras = getBandeiras();
  const precosDinamicos = getPrecosDinamicos();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Preços" description="Configure as tarifas e preços do aplicativo" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tarifa Padrão</CardTitle>
            <CardDescription>
              Valores base das corridas — reflete direto nos apps do motorista e do passageiro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TarifaPadraoForm defaultValues={tarifaApi ?? FALLBACK_TARIFA} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Bandeiras de Tarifa</CardTitle>
            <CardDescription>
              Percentuais adicionais por horário — ainda não é lido pelos apps (só vitrine)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Bandeira</TableHead>
                  <TableHead>Adicional</TableHead>
                  <TableHead>Horários</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bandeiras.map((bandeira) => (
                  <TableRow key={bandeira.nome}>
                    <TableCell className="font-medium">{bandeira.nome}</TableCell>
                    <TableCell>
                      {bandeira.percentualAdicional > 0
                        ? `${bandeira.percentualAdicional}%`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {bandeira.horarios.map((h, i) => (
                        <span key={i} className="block">
                          {h.inicio}–{h.fim}{" "}
                          <span className="text-xs">
                            ({h.dias.map((d) => DIAS_LABEL[d]).join(", ")})
                          </span>
                        </span>
                      ))}
                    </TableCell>
                    <TableCell>
                      <StatusPill
                        tone={bandeira.ativo ? "success" : "neutral"}
                        label={bandeira.ativo ? "Ativo" : "Inativo"}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preços Dinâmicos</CardTitle>
          <CardDescription>
            Fatores multiplicadores aplicados em horários específicos — ainda não é lido pelos
            apps (só vitrine)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Nome</TableHead>
                <TableHead>Fator</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Dias</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {precosDinamicos.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                    Nenhum preço dinâmico configurado
                  </TableCell>
                </TableRow>
              ) : (
                precosDinamicos.map((preco) => (
                  <TableRow key={preco.id}>
                    <TableCell className="font-medium">{preco.nome}</TableCell>
                    <TableCell>{preco.fatorMultiplicador}x</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {preco.horarioInicio}–{preco.horarioFim}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {preco.diasSemana.map((d) => DIAS_LABEL[d]).join(", ")}
                    </TableCell>
                    <TableCell>
                      <StatusPill
                        tone={preco.ativo ? "success" : "neutral"}
                        label={preco.ativo ? "Ativo" : "Inativo"}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
