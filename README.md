# TrocaTroco

Plataforma B2B para empresas anunciarem disponibilidade ou necessidade de troco, negociarem entre si em tempo real e concluírem operações com histórico, avaliação e moderação.

O projeto foi construído como um MVP full stack com Next.js 16, React 19, TypeScript e Supabase, com foco em:

- anúncios de oferta e necessidade de troco
- composição monetária detalhada por cédulas e moedas
- solicitações entre empresas
- negociação com chat em tempo real
- conclusão da operação com avaliação bilateral
- painel administrativo e moderação
- regras transacionais e RLS no banco

## Visão Geral

No TrocaTroco, uma empresa pode:

- publicar um anúncio de oferta de troco ou necessidade de troco
- definir a composição do valor por itens monetários
- aceitar ou não solicitações parciais
- receber e responder solicitações de outras empresas
- negociar em uma conversa dedicada
- concluir a operação e avaliar a outra parte
- consultar perfis públicos e reputação de outras empresas

O sistema também possui:

- autenticação com Supabase Auth
- recuperação de senha por email
- diretório público de empresas
- histórico de negociações concluídas
- denúncias e tickets
- fluxo administrativo para análise cadastral e moderação

## Principais Funcionalidades

### Área da empresa

- dashboard operacional
- criação e gestão de anúncios
- listagem de solicitações enviadas e recebidas
- listagem de negociações ativas e concluídas
- perfil público da própria empresa
- atualização automática de páginas relevantes via Supabase Realtime

### Marketplace de anúncios

- listagem pública de anúncios
- filtros por tipo de anúncio
- página de detalhe do anúncio
- controle de remanescente após solicitações aceitas

### Negociação e avaliação

- chat entre empresas
- mensagens de sistema para eventos relevantes
- encerramento da operação
- avaliação com comentário
- bloqueio do chat livre após finalização
- manutenção do histórico para ambas as partes

### Administração e moderação

- análise cadastral
- acompanhamento de tickets e denúncias
- moderação de negociações e avaliações

## Stack

- Next.js 16.2.4
- React 19.2.4
- TypeScript 6.0.3
- Tailwind CSS 4
- Supabase SSR
- Supabase Realtime
- PostgreSQL via Supabase
- Lucide React

## Arquitetura

### Frontend

- App Router do Next.js
- páginas server-rendered com componentes client onde necessário
- ações de servidor para operações críticas
- navegação autenticada para a área da empresa

### Backend

- Supabase como banco, autenticação e realtime
- Row Level Security para proteger dados por empresa e papel
- funções SQL `SECURITY DEFINER` para fluxos críticos e transacionais
- migrations versionadas em `supabase/migrations`

### Regras operacionais relevantes

- criação de anúncio em fluxo atômico
- aceite de solicitação em fluxo atômico
- reconciliação do valor remanescente e da composição do anúncio
- finalização de negociação após avaliação
- atualização automática das páginas ligadas a anúncios, solicitações, negociações e avaliações

## Estrutura do Projeto

```text
src/
	app/                Rotas da aplicação
	modules/            Domínios da aplicação (anúncios, auth, negociações etc.)
	lib/                Helpers de ambiente, sessão e Supabase
supabase/
	migrations/         Migrations SQL versionadas
	config.toml         Configuração local do Supabase CLI
docs/                 Documentação funcional e arquitetural
```

Principais domínios em `src/modules`:

- `anuncios`
- `auth`
- `cadastro`
- `empresas`
- `negociacoes`
- `solicitacoes`
- `tickets`
- `admin`

## Rotas Principais

### Públicas

- `/`
- `/login`
- `/cadastro`
- `/recuperar-senha`
- `/redefinir-senha`
- `/anuncios`
- `/anuncios/[anuncio_id]`
- `/empresas`
- `/empresas/[empresa_id]`

### Área autenticada da empresa

- `/dashboard`
- `/anunciar`
- `/meus-anuncios`
- `/solicitacoes`
- `/negociacoes`
- `/negociacoes/[negociacao_id]`
- `/tickets`
- `/status-cadastral`

### Administração

- `/admin`
- `/admin/analise-cadastral`
- `/admin/moderacao-negociacoes`
- `/admin/moderacao-avaliacoes`
- `/admin/tickets`

## Requisitos

- Node.js 20+
- npm
- projeto Supabase configurado
- Supabase CLI para trabalhar com migrations localmente ou aplicar no remoto

## Variáveis de Ambiente

Use `.env.example` como base e complemente com as variáveis obrigatórias.

### Obrigatórias

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### SMTP para recuperação de senha

```env
SUPABASE_AUTH_SMTP_HOST=smtp.resend.com
SUPABASE_AUTH_SMTP_PORT=465
SUPABASE_AUTH_SMTP_USER=resend
SUPABASE_AUTH_SMTP_PASS=
SUPABASE_AUTH_SMTP_ADMIN_EMAIL=no-reply@seu-dominio.com
SUPABASE_AUTH_SMTP_SENDER_NAME=TrocaTroco
```

Observações:

- `SUPABASE_SERVICE_ROLE_KEY` é necessária para operações server-side administrativas usadas pela aplicação.
- `NEXT_PUBLIC_APP_URL` deve apontar para a URL pública correta em produção.
- em produção, a aplicação exige `APP_URL` ou `NEXT_PUBLIC_APP_URL` definido.

## Instalação

```bash
npm install
```

## Execução Local

### 1. Configure o ambiente

```bash
cp .env.example .env
```

Preencha as variáveis do projeto Supabase e a chave `SUPABASE_SERVICE_ROLE_KEY`.

### 2. Inicie a aplicação

```bash
npm run dev
```

A aplicação ficará disponível em:

```text
http://localhost:3000
```

## Scripts Disponíveis

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run format
```

## Banco de Dados e Migrations

As migrations ficam em `supabase/migrations` e cobrem:

- schema inicial
- expiração de solicitações
- realtime para negociações e fluxos da empresa
- slug público de empresa
- hardening de RLS e policies
- RPCs transacionais para criação de anúncio, aceite de solicitação e abertura de ticket
- reconciliação da composição remanescente dos anúncios

Para aplicar migrations com Supabase CLI:

```bash
supabase db push
```

Para ambiente local com Supabase:

```bash
supabase start
```

O arquivo `supabase/config.toml` já está preparado para desenvolvimento local com:

- API em `54321`
- banco em `54322`
- Studio em `54323`
- Inbucket em `54324`

## Segurança

O projeto possui cabeçalhos de segurança configurados em `next.config.ts`, incluindo:

- Content Security Policy
- HSTS
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

Além disso:

- o banco usa RLS
- operações críticas usam funções SQL restritas
- o desenvolvimento libera `unsafe-eval` apenas fora de produção para compatibilidade com o runtime do React em dev

## Realtime

O produto usa Supabase Realtime para reduzir a necessidade de recarga manual em fluxos importantes.

Atualmente, a atualização automática cobre eventos relacionados a:

- `anuncios`
- `solicitacoes`
- `negociacoes`
- `avaliacoes`
- `empresas` em páginas públicas específicas

## Fluxos Cobertos pelo Produto

- cadastro e login de empresa
- aprovação cadastral
- publicação de anúncio
- solicitação sobre anúncio
- aceite e recusa de solicitação
- chat de negociação
- encerramento da operação
- avaliação bilateral
- histórico de negociação
- perfil público e reputação
- tickets e denúncias
- moderação administrativa

## Documentação Complementar

O repositório possui documentação extensa em `docs/`, incluindo:

- PRD
- arquitetura e implementação
- modelagem de domínio e dados
- regras de consistência e cálculos
- estados e transições
- fluxos de navegação
- mapa de telas
- backlog funcional

Arquivos de referência relevantes:

- `docs/documento_mestre_trocatroco.md`
- `docs/arquitetura_e_implementacao.md`
- `docs/modelagem_dominio_e_dados.md`
- `docs/regras_de_consistencia_e_calculos.md`
- `docs/fluxos_de_navegacao.md`

## Status Atual

O projeto já contempla o MVP operacional completo do TrocaTroco, incluindo os fluxos centrais de anúncio, solicitação, negociação, avaliação e administração.

As evoluções recentes reforçaram especialmente:

- consistência transacional do aceite de solicitação
- correção do remanescente e da composição dos anúncios
- histórico visível de eventos na negociação
- atualização automática das telas mais sensíveis sem necessidade constante de F5

## Licença

Uso interno do projeto TrocaTroco.
