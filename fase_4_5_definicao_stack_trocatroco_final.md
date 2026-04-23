# Fase 4.5 — Definição da Stack do Projeto (Final)

## 1. Objetivo
Definir a base tecnológica oficial do TrocaTroco antes da arquitetura detalhada e da implementação.

Este documento deve ser tratado como a referência técnica inicial do projeto.

---

## 2. Stack oficial do MVP

## 2.1 Aplicação web
- **Next.js 16.x**
- **React 19.2.x**
- **TypeScript 6.0.x**

### Uso no projeto
- área pública
- área autenticada da empresa
- área administrativa
- renderização de páginas
- server actions e route handlers
- integração com banco, auth e realtime

---

## 2.2 Banco de dados
- **PostgreSQL gerenciado via Supabase**

### Uso no projeto
- persistência relacional
- relacionamentos centrais do domínio
- suporte a anúncios, solicitações, negociações, avaliações, tickets e auditoria

---

## 2.3 Autenticação
- **Supabase Auth**

### Regra
- login por email e senha no MVP
- autenticação centralizada no Supabase
- associação de usuário com empresa no banco da aplicação

---

## 2.4 Chat e realtime
- **Supabase Realtime**
- mensagens persistidas em tabela relacional

### Regra
- o chat existe apenas dentro da negociação
- não haverá serviço separado de chat no MVP

---

## 2.5 Storage
- **Supabase Storage**

### Uso
- foto da empresa
- arquivos simples do produto, quando necessário

### Regra
- não implementar anexos complexos no MVP inicial

---

## 2.6 Deploy
- **Vercel** para a aplicação web
- **Supabase** para banco, auth, storage e realtime

---

## 2.7 Estilo
- **Tailwind CSS 4.x**

---

## 2.8 Qualidade de código
- **ESLint** via `eslint-config-next@16`
- **Prettier 3.x**
- **pnpm 10.x**
- **Node.js 24 LTS**

---

## 2.9 Testes recomendados
- **Vitest** para testes de lógica e serviços
- **Playwright** para fluxo principal e rotas críticas

### Observação
Esses testes entram na implementação e validação, mas a stack já fica congelada aqui para evitar ambiguidade depois.

---

## 3. Padrão de execução da stack

## 3.1 Aplicação única
O MVP será construído em **uma única aplicação web**.

Ela concentra:
- público
- empresa
- admin/moderação

### Não fazer no MVP
- não separar frontend e backend em repositórios diferentes
- não criar microserviços
- não criar servidor de chat separado
- não criar painel admin separado

---

## 3.2 Escrita e leitura sensível
No MVP:
- toda escrita deve acontecer no servidor
- toda leitura sensível deve acontecer no servidor
- não haverá escrita direta do cliente no banco

### Onde implementar isso
- Server Actions
- Route Handlers
- serviços internos do app

---

## 3.3 Permissões
A autorização deve ser aplicada primeiro na camada servidor da aplicação.

### Reforço esperado
Antes de produção, as políticas de acesso no banco devem estar coerentes com a autorização da aplicação.

---

## 4. Estrutura técnica congelada

## 4.1 Repositório
- um único repositório
- um único app principal

## 4.2 Diretório-base
Usar `src/` para organizar o projeto.

### Estrutura base recomendada
```text
src/
  app/
  components/
  modules/
  services/
  lib/
  types/
  constants/
  hooks/
```

---

## 4.3 Organização de rotas
As rotas devem viver no App Router do Next.js.

---

## 5. O que fica oficialmente congelado nesta fase

- Next.js 16.x
- React 19.2.x
- TypeScript 6.0.x
- Node 24 LTS
- pnpm 10.x
- Tailwind 4.x
- Supabase Auth
- Supabase Realtime
- Supabase Storage
- PostgreSQL via Supabase
- Vercel
- app único
- servidor centralizando escrita
- sem backend separado no MVP

---

## 6. O que não fica congelado nesta fase

- estrutura fina de pastas por módulo
- convenções internas de componentes visuais
- detalhes finais de testes
- observabilidade avançada
- otimizações de performance
- refinamentos de infra

Esses pontos pertencem à Fase 5 e à Fase 6.

---

## 7. Resultado esperado
Ao final desta fase, o projeto fica pronto para:
- arquitetura detalhada
- schema físico final
- implementação real no VS Code
- uso consistente de Copilot sem ambiguidade de stack

---

## 8. Observação final
Este documento congela a stack inicial do TrocaTroco.
A partir daqui, mudanças de tecnologia só devem acontecer por decisão explícita.
