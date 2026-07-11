# Chama nº 12 — Painel Administrativo (Dashboard) — Status

Última atualização: 11/07/2026

## ✅ Funcionando (integrado com a API real)

### Acesso
- Login do administrador, autenticado direto contra a API.

### Motoristas
- Listagem de motoristas com dados reais.
- Cadastro de novo motorista pelo painel.
- Visualização de detalhes (dados, veículo, endereço, métricas, histórico de corridas).
- Edição de dados do motorista.
- Aprovar ou rejeitar cadastro.
- Ativar ou desativar conta.
- Revisar (aprovar/rejeitar) cada documento enviado (CNH, CRLV, foto do veículo).

### Visão geral
- Painel inicial (dashboard) com métricas reais vindas da API.

## ⚠️ Ainda não integrado (tela pronta, dados de exemplo)

- **Passageiros**: listagem e detalhe usam dados fictícios — não há endpoint de passageiros na API ainda.
- **Cupons de desconto**: tela pronta, dados fictícios — sem endpoint na API.
- **Preços e tarifas**: tela pronta, dados fictícios — sem endpoint na API.

## Observação importante

As telas marcadas como "ainda não integrado" têm a interface pronta e funcional visualmente, mas os dados exibidos são fixos (não vêm do banco). Para ficarem reais, é preciso primeiro criar os endpoints correspondentes na API.
