import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type PageHeaderProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  actions?: React.ReactNode;
};

/**
 * Header padrão de página do painel: título + descrição opcional + link de
 * "voltar" opcional + slot de ações à direita. Usado em todas as telas do
 * módulo de motoristas para manter tipografia e espaçamento consistentes.
 */
export function PageHeader({ title, description, backHref, backLabel, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col gap-2">
        {backHref && (
          <Link
            href={backHref}
            className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            {backLabel ?? "Voltar"}
          </Link>
        )}
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>

      {actions && <div className="flex flex-wrap items-start gap-2 sm:justify-end">{actions}</div>}
    </div>
  );
}
