# Chama nº 12 — Especificação da API (Painel Ops / Motoristas)

Status: rascunho gerado a partir do MVP mockado do painel administrativo (`web/`).
Objetivo: documentar os endpoints que o backend real precisa expor para substituir,
1:1, as funções mock hoje em `src/lib/drivers.ts` + `src/app/dashboard/motoristas/actions.ts`.

> Este documento cobre **apenas o painel ops de motoristas** (o que já está
> implementado e demonstrável). A seção [10. Fora de escopo](#10-fora-de-escopo-inferido)
> lista o que existe no domínio (app do passageiro, corridas em tempo real) mas
> ainda não foi modelado nem mockado — precisa de spec própria antes de implementar.

---

## 1. Visão geral

- **Auth:** hoje é NextAuth (Credentials) com um único usuário admin mockado
  (`src/lib/users.ts`). O backend real precisa expor login por email/senha e
  emitir um token de sessão (JWT ou sessão opaca) que o NextAuth possa validar
  via `authorize()`.
- **Formato de resposta sugerido** (padrão, para manter consistência):
  ```json
  { "success": true, "data": { ... }, "meta": { "page": 1, "total": 8, "limit": 20 } }
  ```
  Erros:
  ```json
  { "success": false, "error": { "code": "DRIVER_NOT_FOUND", "message": "Motorista não encontrado." } }
  ```
- **Todas as rotas abaixo exigem sessão autenticada** (painel interno, não
  público). Não há ainda diferenciação de papéis (role) no mock — só existe
  "admin". Se o cliente confirmar múltiplos perfis (ex: operador vs.
  admin financeiro), isso precisa entrar no backlog de auth antes do RBAC.

---

## 2. Modelos de dados

### Driver

```ts
type Driver = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cnh: string;
  status: "ativo" | "inativo" | "pendente";
  avatarUrl: string | null;
  veiculo: { placa: string; modelo: string; ano: number };
  metrics: { corridas: number; avaliacaoMedia: number; ganhos: number };
  documentos: DriverDocument[];
  corridas: DriverTrip[];
  localizacaoAtual: { lat: number; lng: number } | null;
};
```

### DriverDocument

```ts
type DriverDocument = {
  tipo: "cnh" | "crlv" | "foto_veiculo";
  status: "aprovado" | "pendente" | "rejeitado";
  enviadoEm: string; // ISO date
  // Campos que o mock NÃO tem, mas o backend real vai precisar:
  // arquivoUrl: string;      // onde o arquivo foi armazenado (S3/GCS/etc)
  // revisadoPor?: string;    // id do admin que aprovou/rejeitou
  // motivoRejeicao?: string;
};
```

### DriverTrip (histórico de corridas)

```ts
type DriverTrip = {
  id: string;
  data: string;      // ISO date
  origem: string;
  destino: string;
  valor: number;
  avaliacao: number; // 0–5
};
```
No mock isso é só um resumo por motorista. No modelo real, `DriverTrip`
provavelmente é uma *view* read-only de uma tabela `rides`/`corridas`
compartilhada com o domínio de passageiro — não deve ser escrita por este
painel, só lida.

### Vehicle / DriverMetrics / LatLng

```ts
type Vehicle = { placa: string; modelo: string; ano: number };
type DriverMetrics = { corridas: number; avaliacaoMedia: number; ganhos: number };
type LatLng = { lat: number; lng: number };
```
`DriverMetrics` no mock é estático. No backend real isso deveria ser
**calculado** (agregação sobre `rides`), não um campo editável.

---

## 3. Auth

| Mock atual | Endpoint real |
|---|---|
| `findUserByEmail` + `bcrypt.compareSync` em `src/lib/users.ts` | `POST /api/v1/auth/login` — `{ email, password }` → `{ token, user: { id, name, email } }` |
| N/A | `POST /api/v1/auth/logout` (opcional, se sessão for stateful) |
| N/A | `GET /api/v1/auth/me` — valida token, retorna usuário atual (usado pelo NextAuth `session` callback se migrar para JWT vindo do backend) |

---

## 4. Motoristas — CRUD e listagem

### `GET /api/v1/drivers`
Substitui `getDrivers()` + filtro client-side em `drivers-table.tsx`.

Query params:
- `search` (string, opcional) — busca por nome (hoje é client-side, mover pro backend quando a lista crescer)
- `status` (`ativo` | `inativo` | `pendente`, opcional)
- `page`, `limit` (paginação — o mock não pagina, mas com dado real vai precisar)

Resposta: `{ success: true, data: Driver[], meta: { page, total, limit } }`

### `GET /api/v1/drivers/:id`
Substitui `getDriverById(id)`. 404 (`DRIVER_NOT_FOUND`) se não existir —
hoje isso vira `notFound()` do Next.js.

### `POST /api/v1/drivers`
Substitui `createDriver()` em `src/lib/drivers.ts`, chamado por
`createDriverAction`.

Body (mesmo shape de `driverFormSchema` em `src/lib/validations/drivers.ts`):
```json
{
  "nome": "string, obrigatório",
  "email": "string, email válido, obrigatório",
  "telefone": "string, obrigatório",
  "cnh": "string, obrigatório",
  "veiculo": { "placa": "string", "modelo": "string", "ano": "number 1990-2100" }
}
```

Regras de negócio (já implementadas no mock e devem ser mantidas no backend):
- **Todo motorista novo nasce com `status: "pendente"`** — nunca ativo direto.
  Esse é o "gate de aprovação" do produto.
- Os 3 documentos (`cnh`, `crlv`, `foto_veiculo`) são criados automaticamente
  com `status: "pendente"`.
- `metrics` nasce zerado (`corridas: 0, avaliacaoMedia: 0, ganhos: 0`).
- `localizacaoAtual` nasce `null` (motorista pendente não está em rota).

Resposta: `201` com `Driver` criado.

### `PATCH /api/v1/drivers/:id`
Substitui `updateDriver()`, chamado por `updateDriverAction`. Mesmo body do
create. **Não permite alterar `status`, `metrics`, `documentos`, `corridas`
ou `localizacaoAtual`** — isso é responsabilidade dos endpoints abaixo, para
manter o histórico de auditoria separado de edição de cadastro.

---

## 5. Aprovação / status do motorista

Hoje isso é feito por três Server Actions (`approveDriverAction`,
`rejectDriverAction`, `toggleActiveAction`) — no backend real, virariam
endpoints dedicados de transição de estado (mais fácil de auditar do que um
`PATCH status` genérico):

### `POST /api/v1/drivers/:id/approve`
`pendente → ativo`. Deve validar que os documentos obrigatórios estão
`aprovado` antes de permitir (o mock **não** valida isso hoje — é uma lacuna
a corrigir no backend real, não só copiar o comportamento mockado).

### `POST /api/v1/drivers/:id/reject`
**Atenção — divergência intencional do mock:** hoje `rejectDriverAction`
**remove o motorista** (`removeDriver`, hard delete) do array em memória, só
pra simplificar o MVP sem banco. **Isso não deve ir para produção assim.**
Recomendação: rejeitar deveria ser um **soft delete / mudança de status**
(ex: `status: "rejeitado"` — precisaria virar um 4º valor no enum, hoje é só
`ativo | inativo | pendente`) preservando o registro para auditoria/histórico
de tentativas de cadastro. Decisão de produto a confirmar com o cliente antes
de implementar no backend.

Body sugerido: `{ "motivo"?: string }` (hoje não existe campo de motivo no
mock — o `AlertDialog` de confirmação não coleta um motivo, só confirma a
ação).

### `POST /api/v1/drivers/:id/activate` e `POST /api/v1/drivers/:id/deactivate`
Substitui `toggleActiveAction` (que hoje é um único endpoint que inverte
`ativo ⇄ inativo`). Sugestão: separar em dois verbos explícitos no backend
para ficar mais auditável/idempotente do que um "toggle".

---

## 6. Documentos

### `PATCH /api/v1/drivers/:id/documents/:tipo`
Substitui `setDocumentStatus()`, chamado por `simulateDocumentUploadAction`.

No mock, "simular envio" só marca o documento como `aprovado` direto — não
existe upload de arquivo real. No backend real isso precisa virar **dois**
endpoints:

1. `POST /api/v1/drivers/:id/documents/:tipo/upload` — recebe o arquivo
   (multipart/form-data), armazena (S3/GCS/etc), seta `status: "pendente"`
   e grava `arquivoUrl`.
2. `PATCH /api/v1/drivers/:id/documents/:tipo` — endpoint de revisão manual
   pelo admin: `{ "status": "aprovado" | "rejeitado", "motivo"?: string }`.

O botão "Simular envio" do painel hoje cobre os dois passos de uma vez só
porque não há storage real — ao integrar, ele devia virar só um shortcut de
teste/dev, não o fluxo de produção.

---

## 7. Histórico de corridas

### `GET /api/v1/drivers/:id/trips`
Substitui o array mock `corridas` dentro de `Driver`. Deve ser **paginado**
(hoje o mock mostra só 2–6 corridas fixas por motorista) e vir do módulo de
`rides`/corridas (que ainda não existe — ver seção 10). Sugestão de query
params: `page`, `limit`, `from`, `to` (filtro por data).

Resposta: `{ success: true, data: DriverTrip[], meta: { page, total, limit } }`

`DriverMetrics.corridas/avaliacaoMedia/ganhos` no `GET /drivers/:id`
deveriam ser agregações desse mesmo módulo, não campos soltos.

---

## 8. Localização e distância motorista → passageiro

Implementado no painel como **mock local**, sem Google Maps
(`src/lib/geo.ts`, `getMockPassengerRequest`/`getDistanceToPassengerKm` em
`src/lib/drivers.ts`, componente `DriverDistanceCard`). Cálculo é Haversine
(linha reta) sobre coordenadas fixas — não reflete rota real de rua/trânsito.
Isso foi combinado explicitamente para ficar para uma fase futura.

Quando entrar a integração real:

### `PATCH /api/v1/drivers/:id/location`
Endpoint que o **app do motorista** (mobile, fora deste repo) chamaria
periodicamente para atualizar `localizacaoAtual`. Considerar:
- Se o volume de updates for alto, isso não deveria ser HTTP request-response
  puro — avaliar WebSocket ou um serviço de geolocalização dedicado
  (ex: pub/sub) em vez de escrever no banco a cada poucos segundos.
- Body: `{ "lat": number, "lng": number }`.

### `GET /api/v1/drivers/:id/distance?rideId=...`
Endpoint que, dado uma corrida/solicitação ativa, calcula a distância
motorista → ponto de embarque do passageiro. Duas opções de implementação:
1. **Fase 1 (equivalente ao mock atual):** Haversine no backend, sem custo,
   sem API key — só troca o "passageiro mock" por um `pickupLocation` real
   vindo de uma corrida solicitada.
2. **Fase 2 (Google Maps real):** chamar a **Distance Matrix API** ou
   **Directions API** do Google **a partir do backend** (nunca do client, pra
   não expor a API key e poder cachear/rate-limitar). Requer:
   - `GOOGLE_MAPS_API_KEY` como env var **do backend**, billing ativado.
   - Decisão: cachear resultado por N segundos para não estourar quota/custo
     em cada refresh do painel.

O card do painel (`DriverDistanceCard`) já está com a UI pronta pra receber
`distanciaKm`/`tempoEstimadoMin` reais assim que o endpoint existir — só
troca o cálculo local pela chamada à API.

---

## 9. Tabela-resumo: mock → endpoint

| Função mock (`src/lib/drivers.ts` / `actions.ts`) | Endpoint real |
|---|---|
| `getDrivers()` | `GET /drivers` |
| `getDriverById(id)` | `GET /drivers/:id` |
| `createDriver()` / `createDriverAction` | `POST /drivers` |
| `updateDriver()` / `updateDriverAction` | `PATCH /drivers/:id` |
| `setDriverStatus(id, "ativo")` / `approveDriverAction` | `POST /drivers/:id/approve` |
| `removeDriver()` / `rejectDriverAction` | `POST /drivers/:id/reject` (repensar hard delete → soft) |
| `setDriverStatus` (toggle) / `toggleActiveAction` | `POST /drivers/:id/activate` \| `/deactivate` |
| `setDocumentStatus()` / `simulateDocumentUploadAction` | `POST /drivers/:id/documents/:tipo/upload` + `PATCH /drivers/:id/documents/:tipo` |
| array `corridas` embutido no `Driver` | `GET /drivers/:id/trips` (paginado) |
| `getMockPassengerRequest` / `getDistanceToPassengerKm` | `GET /drivers/:id/distance?rideId=...` (fase 2: Google Maps) |
| N/A (não existe update de GPS no mock) | `PATCH /drivers/:id/location` |

---

## 10. Fora de escopo (inferido, não implementado)

O painel hoje só cobre o **módulo de gestão de motoristas**. O produto
"Chama nº 12" claramente também precisa (existe um app de passageiro em
`passageiro_app/` no monorepo, fora deste diretório) de um domínio de
**corridas em tempo real** que ainda não foi mockado nem especificado aqui:

- Entidade `Passenger` (hoje só existe como mock efêmero dentro do painel).
- Fluxo de solicitação de corrida (`POST /rides`), matching motorista↔passageiro,
  aceite/recusa pelo motorista, status da corrida (solicitada → aceita → em
  andamento → concluída/cancelada).
- Pagamento da corrida.
- Notificações push / real-time (provavelmente WebSocket) para ambos os apps.

Esses pontos precisam de uma spec própria (não dá pra derivar com segurança
só do que foi mockado no painel ops) antes de virar backend — recomendo tratar
como uma segunda rodada de spec quando o cliente validar o MVP atual.

---

## 11. Apresentação ao cliente — o que já é demonstrável hoje

Todo o fluxo abaixo funciona ponta a ponta no painel com **dados mockados em
memória** (sem banco — reinicia ao restartar o servidor):

1. Login (`/login`) com `admin@example.com` / `admin123`.
2. Dashboard (`/dashboard`) com cards de total/ativos/pendentes.
3. Lista de motoristas (`/dashboard/motoristas`) com busca, filtro por status,
   ações em massa via menu por linha, e botão "Novo motorista".
4. Cadastro de motorista (`/dashboard/motoristas/novo`) — nasce `pendente`.
5. Detalhe do motorista (`/dashboard/motoristas/:id`):
   - Aprovar / Rejeitar (se `pendente`) ou Ativar / Inativar (se não).
   - Editar dados (`/dashboard/motoristas/:id/editar`).
   - Documentos com status por tipo + "Simular envio".
   - Histórico de corridas.
   - Distância até um "passageiro" mockado (cálculo local, sem Google Maps).

Ao apresentar, vale deixar explícito pro cliente que: (a) não há persistência
real ainda, (b) rejeição hoje remove o registro (a decidir se isso é o
comportamento final), (c) distância é uma simulação local, não GPS/Maps real.
