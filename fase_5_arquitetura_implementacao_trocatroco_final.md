# Fase 5 — Arquitetura e Implementação (Final)

## 1. Objetivo
Transformar a definição funcional e a modelagem lógica do TrocaTroco em uma estrutura técnica implementável, clara e estável.

Este documento deve ser tratado como a referência operacional da construção do projeto.

---

## 2. O que fica congelado nesta fase

### 2.1 Regras críticas
As seguintes regras devem ser tratadas como fechadas:
- empresa só opera se estiver aprovada
- solicitação pendente não reserva saldo
- aceite cria negociação
- chat só existe após aceite
- moderação da negociação acontece no próprio chat
- ticket é usado apenas para contexto externo à negociação
- avaliação é obrigatória
- nota é obrigatória
- comentário é opcional
- comentário só fica público após moderação
- a nota entra na reputação assim que a avaliação é enviada
- o anúncio só conclui quando:
  - não houver valor remanescente
  - não houver negociação pendente em aberto
  - a operação estiver encerrada
  - e as duas avaliações obrigatórias da negociação final já tiverem sido enviadas
- necessidade também suporta atendimento parcial
- cada empresa possui apenas 1 usuário principal ativo no MVP

### 2.2 Estrutura macro do sistema
- uma aplicação web única
- uma base relacional principal
- um fluxo público
- um fluxo de empresa
- um fluxo administrativo
- chat dentro da negociação
- painel admin no mesmo app

### 2.3 Padrão de implementação
Toda implementação deve seguir:
`regra → banco → tipo/interface → serviço → tela → validação`

---

## 3. Rotas oficiais do projeto

## 3.1 Públicas
- `/`
- `/login`
- `/cadastro`
- `/anuncios`
- `/anuncios/[anuncio_id]`
- `/empresas/[empresa_id]`

## 3.2 Empresa autenticada
- `/status-cadastral`
- `/dashboard`
- `/anunciar`
- `/meus-anuncios`
- `/solicitacoes`
- `/negociacoes/[negociacao_id]`

## 3.3 Administração
- `/admin`
- `/admin/analise-cadastral`
- `/admin/tickets`
- `/admin/moderacao-avaliacoes`

### Regra
Essas rotas devem ser tratadas como oficiais no MVP.
Mudanças de slug ou organização só devem acontecer por decisão explícita.

---

## 4. Estrutura real do app

## 4.1 Estrutura base obrigatória
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

## 4.2 Organização recomendada por responsabilidade

### `src/app/`
Rotas e páginas do App Router.

### `src/components/`
Componentes reutilizáveis de interface.

### `src/modules/`
Módulos de negócio separados por domínio:
- cadastro
- anuncios
- solicitacoes
- negociacoes
- avaliacoes
- admin

### `src/services/`
Serviços de regra de negócio e orquestração.

### `src/lib/`
Integrações técnicas:
- supabase
- auth
- helpers de servidor
- clientes internos

### `src/types/`
Tipos e interfaces do projeto.

### `src/constants/`
Enums, constantes de domínio e chaves estáticas.

### `src/hooks/`
Hooks do frontend, apenas quando fizer sentido.

---

## 5. Estratégia de regras de negócio

## 5.1 O que vai para o banco
Devem ficar no banco:
- tabelas
- enums
- chaves estrangeiras
- unicidades
- checks básicos
- índices
- integridade relacional

## 5.2 O que vai para a aplicação
Devem ficar na aplicação:
- transições de estado
- regras de aceite e recusa
- criação da negociação
- atualização de remanescente
- autorização por contexto
- encerramento operacional
- finalização da negociação
- cálculo de visão de dashboard
- orquestração da moderação

## 5.3 O que evitar no MVP
Evitar:
- triggers complexas de negócio
- regras críticas espalhadas entre muitas camadas
- lógica principal escondida em automações difíceis de rastrear

### Regra prática
No MVP, a regra de negócio deve ficar **principalmente na camada de serviço do servidor**, com o banco garantindo integridade estrutural.

---

## 6. Schema físico inicial

## 6.1 Tabelas obrigatórias da primeira implementação
- `empresas`
- `usuarios`
- `submissoes_cadastrais`
- `verificacoes_cadastrais`
- `anuncios`
- `itens_composicao_anuncio`
- `solicitacoes`
- `itens_composicao_solicitacao`
- `negociacoes`
- `mensagens_negociacao`
- `avaliacoes`
- `tickets_moderacao`
- `eventos_ticket_moderacao`
- `eventos_timeline`

## 6.2 Enums obrigatórios
- `papel_usuario`
- `status_empresa`
- `status_submissao_cadastral`
- `tipo_anuncio`
- `status_anuncio`
- `tipo_item_dinheiro`
- `status_solicitacao`
- `local_troca`
- `status_negociacao`
- `status_moderacao_negociacao`
- `tipo_ator_mensagem`
- `status_ticket_moderacao`
- `tipo_origem_ticket_moderacao`
- `status_comentario_avaliacao`

## 6.3 Constraints obrigatórias
- CNPJ único
- 1 usuário principal ativo por empresa
- 1 negociação por solicitação aceita
- 1 avaliação por empresa avaliadora dentro da negociação
- nota entre 1 e 5
- valor remanescente não negativo
- valor total maior que zero
- valor solicitado maior que zero
- quantidade maior que zero

---

## 7. Permissões oficiais

## 7.1 Visitante
Pode acessar:
- `/`
- `/login`
- `/cadastro`
- `/anuncios`
- `/anuncios/[anuncio_id]` em contexto parcial
- `/empresas/[empresa_id]`

Não pode:
- operar no marketplace
- acessar rotas autenticadas
- acessar admin

## 7.2 Empresa logada em análise
Pode acessar:
- `/status-cadastral`

Pode ter acesso básico de sessão, mas não opera:
- não cria anúncio
- não envia solicitação
- não negocia

## 7.3 Empresa aprovada
Pode acessar:
- `/dashboard`
- `/anunciar`
- `/meus-anuncios`
- `/solicitacoes`
- `/negociacoes/[negociacao_id]`
- `/empresas/[empresa_id]` no próprio contexto e no contexto público

## 7.4 Admin ou moderação
Pode acessar:
- `/admin`
- `/admin/analise-cadastral`
- `/admin/tickets`
- `/admin/moderacao-avaliacoes`

Além disso:
- pode entrar em negociações quando houver necessidade administrativa
- pode acessar histórico do chat no contexto permitido

---

## 8. Estratégia de autenticação e autorização

## 8.1 Autenticação
- feita via Supabase Auth
- login por email e senha
- sessão controlada pelo app

## 8.2 Autorização
- feita no servidor
- baseada em:
  - papel do usuário
  - vínculo com empresa
  - status da empresa
  - vínculo da empresa com o contexto da negociação ou solicitação

## 8.3 Regra obrigatória
Não permitir escrita direta do cliente no banco para regras críticas do domínio.

---

## 9. Estratégia do chat

## 9.1 Regra oficial
- mensagens persistidas em `mensagens_negociacao`
- atualização em tempo real via Supabase Realtime
- histórico preservado
- moderador entra no mesmo contexto do chat

## 9.2 O que não fazer
- não criar serviço de chat separado
- não criar infraestrutura de mensagens paralela
- não criar ticket interno para a negociação

---

## 10. Sequência oficial de implementação do MVP

## Bloco 1
- projeto base

## Bloco 2
- banco e schema

## Bloco 3
- auth e permissões

## Bloco 4
- cadastro + aprovação

## Bloco 5
- anúncios

## Bloco 6
- solicitações

## Bloco 7
- negociação + chat

## Bloco 8
- avaliação + reputação

## Bloco 9
- tickets externos + admin

## Bloco 10
- refinos e testes finais

### Regra
Não abrir vários blocos ao mesmo tempo.
Fechar um antes de iniciar o próximo.

---

## 11. Critério de pronto por bloco
Todo bloco só pode ser considerado concluído quando tiver:
- regra implementada
- persistência funcionando
- tela principal funcionando
- permissão correta
- validação manual executada

---

## 12. O que fica propositalmente em aberto
Continuam em aberto:
- refinamento visual fino
- abstrações avançadas de componente
- observabilidade avançada
- otimizações de performance
- automações extras de infra

Esses pontos não travam o início da construção do MVP.

---

## 13. Resultado esperado
Ao final desta fase, o projeto deve estar amarrado o suficiente para:
- começar a implementação real no VS Code
- usar Copilot com menos ambiguidade
- evitar mudanças improvisadas no meio da construção

---

## 14. Observação final
A partir deste documento, o projeto deve ser implementado com foco em:
- consistência
- blocos pequenos
- validação frequente
- fidelidade às Fases 3, 4 e 4.5
