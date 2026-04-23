# Checklist de Implementação — TrocaTroco (Ajustado)

## Como usar corretamente

Este checklist deve ser usado como **roteiro de execução**, e não como uma lista para marcar tudo em paralelo.

A lógica correta é:
- avançar por fases pequenas
- trabalhar por blocos funcionais
- fechar um bloco antes de abrir o próximo
- validar cada bloco antes de seguir

---

## Regra central de execução

Sempre implementar nesta ordem:

```text
regra → banco → tipo/interface → serviço → tela → validação
```

### Exemplo prático
- definir a regra da solicitação
- criar a estrutura no banco
- criar types e interfaces
- criar função de serviço
- criar página ou componente
- testar o fluxo

---

## Ordem oficial de construção

```text
1. Projeto base
2. Banco e schema
3. Auth e permissões
4. Cadastro + aprovação
5. Anúncios
6. Solicitações
7. Negociação + chat
8. Avaliação + reputação
9. Tickets externos + admin
10. Refinos e testes finais
```

---

# Bloco 1 — Projeto base

## Objetivo do bloco
Criar a fundação técnica do projeto para permitir o início da implementação real.

## O que precisa existir para esse bloco estar concluído
- projeto Next.js criado
- TypeScript funcionando
- Tailwind configurado
- Supabase instalado e conectado
- variáveis de ambiente configuradas
- aplicação rodando localmente
- estrutura inicial de pastas organizada
- primeiro commit limpo realizado

## Checklist
- [x] criar pasta raiz do projeto
- [x] abrir no VS Code
- [x] iniciar repositório Git
- [x] configurar `.gitignore`
- [x] criar projeto Next.js + TypeScript
- [x] instalar e configurar Tailwind
- [x] instalar SDK do Supabase
- [x] configurar variáveis de ambiente
- [x] testar se a aplicação sobe localmente
- [x] organizar estrutura inicial de pastas
- [x] fazer primeiro commit com a base limpa

## O que testar no final
- [x] o projeto sobe sem erro
- [x] Tailwind funciona
- [x] Supabase está configurado corretamente
- [x] a estrutura inicial está organizada

---

# Bloco 2 — Banco e schema

## Objetivo do bloco
Criar a base física de dados do sistema a partir da Fase 4.

## O que precisa existir para esse bloco estar concluído
- projeto Supabase criado
- banco conectado
- enums criados
- tabelas principais criadas
- relacionamentos criados
- índices principais criados
- constraints principais criadas

## Checklist
- [x] criar projeto Supabase
- [x] ligar o app ao Supabase
- [x] transformar o modelo relacional da Fase 4 em schema físico
- [x] criar enums
- [x] criar tabela `empresas`
- [x] criar tabela `usuarios`
- [x] criar tabela `submissoes_cadastrais`
- [x] criar tabela `verificacoes_cadastrais`
- [x] criar tabela `anuncios`
- [x] criar tabela `itens_composicao_anuncio`
- [x] criar tabela `solicitacoes`
- [x] criar tabela `itens_composicao_solicitacao`
- [x] criar tabela `negociacoes`
- [x] criar tabela `mensagens_negociacao`
- [x] criar tabela `tickets_moderacao`
- [x] criar tabela `eventos_ticket_moderacao`
- [x] criar tabela `avaliacoes`
- [x] criar tabela `eventos_timeline`
- [x] criar foreign keys
- [x] criar índices principais
- [x] criar constraints principais

## O que testar no final
- [x] schema sobe sem erro
- [x] relações funcionam
- [x] constraints críticas estão válidas
- [x] 1 usuário principal por empresa está coberto conforme a estratégia adotada

---

# Bloco 3 — Auth e permissões

## Objetivo do bloco
Garantir autenticação, sessão e acesso correto por perfil.

## O que precisa existir para esse bloco estar concluído
- login funcionando
- usuário vinculado corretamente à empresa
- rotas protegidas
- papéis funcionando
- acesso bloqueado corretamente por perfil

## Checklist
- [x] configurar Supabase Auth
- [x] criar fluxo de login
- [x] associar usuário à empresa
- [x] definir papéis de acesso
- [x] criar guardas de rota
- [x] bloquear áreas por perfil
- [x] validar acesso de visitante
- [x] validar acesso de empresa não aprovada
- [x] validar acesso de empresa aprovada
- [x] validar acesso admin/moderação

## Perfis que precisam funcionar
- [x] visitante
- [x] empresa logada em análise
- [x] empresa logada aprovada
- [x] admin
- [x] moderador
- [x] admin/moderador

## O que testar no final
- [x] login funciona
- [x] cada perfil cai na área correta
- [x] empresa não aprovada não opera
- [x] visitante não entra em área privada
- [x] admin não mistura fluxo com empresa comum

---

# Bloco 4 — Cadastro + aprovação

## Objetivo do bloco
Fechar o fluxo cadastral ponta a ponta.

## O que precisa existir para esse bloco estar concluído
- cadastro em etapas funcionando
- submissão salva corretamente
- status cadastral funcionando
- reprovação funcionando
- reenvio funcionando
- análise admin funcionando
- aprovação liberando operação

## Checklist
- [ ] implementar Cadastro de empresa
- [ ] salvar submissão cadastral
- [ ] implementar Status cadastral / aprovação
- [ ] implementar reenvio após reprovação
- [ ] implementar Análise cadastral admin
- [ ] implementar aprovação
- [ ] implementar reprovação com motivo
- [ ] atualizar status da empresa conforme submissão vigente

## O que testar no final
- [ ] cadastro envia
- [ ] empresa em análise fica bloqueada
- [ ] reprovação mostra contexto correto
- [ ] empresa reprovada consegue reenviar
- [ ] aprovação libera dashboard

---

# Bloco 5 — Anúncios

## Objetivo do bloco
Permitir criação, descoberta e acompanhamento de anúncios.

## O que precisa existir para esse bloco estar concluído
- criação de oferta funcionando
- criação de necessidade funcionando
- composição funcionando
- listagem pública funcionando
- detalhe do anúncio funcionando
- meus anúncios funcionando
- remanescente e status funcionando

## Checklist
- [ ] implementar `/anunciar`
- [ ] implementar criação de anúncio de oferta
- [ ] implementar criação de anúncio de necessidade
- [ ] implementar composição do anúncio
- [ ] implementar `/anuncios`
- [ ] implementar Detalhe do anúncio
- [ ] implementar Meus anúncios
- [ ] implementar status do anúncio
- [ ] implementar remanescente do anúncio

## O que testar no final
- [ ] anúncio publica corretamente
- [ ] oferta e necessidade funcionam
- [ ] remanescente é calculado
- [ ] descoberta pública funciona
- [ ] detalhe do anúncio muda conforme contexto

---

# Bloco 6 — Solicitações

## Objetivo do bloco
Fechar o fluxo de envio, recebimento e decisão sobre solicitações.

## O que precisa existir para esse bloco estar concluído
- solicitação criada
- lista unificada de solicitações funcionando
- aceite funcionando
- recusa funcionando
- cancelamento válido funcionando
- expiração funcionando

## Checklist
- [ ] criar solicitação
- [ ] implementar tela Solicitações
- [ ] separar contexto de enviadas e recebidas
- [ ] implementar aceite
- [ ] implementar recusa
- [ ] implementar cancelamento dentro da janela válida
- [ ] implementar expiração
- [ ] refletir status corretamente

## O que testar no final
- [ ] solicitação enviada aparece para quem enviou
- [ ] solicitação recebida aparece para autora do anúncio
- [ ] aceite cria negociação
- [ ] recusa encerra sem chat
- [ ] cancelamento respeita a janela
- [ ] expiração funciona

---

# Bloco 7 — Negociação + chat

## Objetivo do bloco
Fechar o núcleo operacional após o aceite.

## O que precisa existir para esse bloco estar concluído
- negociação criada após aceite
- tela da negociação funcionando
- chat persistido
- realtime funcionando
- chamada de moderador funcionando
- encerramento operacional funcionando
- finalização após avaliações preparada

## Checklist
- [ ] criar negociação após aceite
- [ ] implementar Tela da negociação
- [ ] persistir mensagens
- [ ] atualizar mensagens em tempo real
- [ ] implementar ação chamar moderador
- [ ] implementar `status_moderacao`
- [ ] implementar encerramento operacional
- [ ] implementar finalização após avaliações

## O que testar no final
- [ ] solicitação aceita cria negociação
- [ ] chat salva mensagens
- [ ] realtime funciona
- [ ] moderador entra no mesmo contexto
- [ ] operação encerra corretamente

---

# Bloco 8 — Avaliação + reputação

## Objetivo do bloco
Fechar o ciclo reputacional após a negociação.

## O que precisa existir para esse bloco estar concluído
- avaliação obrigatória funcionando
- nota obrigatória funcionando
- comentário opcional funcionando
- reputação numérica atualizando no envio
- moderação do comentário funcionando
- perfil público refletindo reputação corretamente

## Checklist
- [ ] criar avaliação obrigatória
- [ ] exigir nota
- [ ] aceitar comentário opcional
- [ ] salvar comentário como `null` quando não existir
- [ ] atualizar reputação numérica no envio
- [ ] implementar moderação do comentário
- [ ] aprovar comentário
- [ ] barrar comentário
- [ ] implementar resposta da empresa avaliada
- [ ] refletir tudo no Perfil da empresa

## O que testar no final
- [ ] avaliação exige nota
- [ ] comentário opcional funciona
- [ ] reputação numérica sobe no envio
- [ ] comentário só aparece após aprovação
- [ ] resposta só aparece depois de comentário publicado

---

# Bloco 9 — Tickets externos + admin

## Objetivo do bloco
Fechar a moderação externa e o painel administrativo principal.

## O que precisa existir para esse bloco estar concluído
- painel admin funcionando
- tickets externos funcionando
- moderação de avaliações funcionando
- acessos protegidos funcionando

## Checklist
- [ ] implementar Painel administrativo
- [ ] implementar Denúncias / tickets admin
- [ ] abrir ticket externo
- [ ] registrar andamento
- [ ] encerrar ticket
- [ ] implementar Moderação de avaliações
- [ ] proteger toda a área admin

## O que testar no final
- [ ] ticket externo abre corretamente
- [ ] admin visualiza tickets
- [ ] admin registra solução
- [ ] admin encerra ticket
- [ ] comentário é moderado corretamente
- [ ] empresa comum não entra em rota admin

---

# Bloco 10 — Refinos e testes finais

## Objetivo do bloco
Consolidar o MVP funcionando com estabilidade mínima.

## O que precisa existir para esse bloco estar concluído
- estados de interface mínimos implementados
- componentes base reutilizáveis prontos
- fluxo P0 validado de ponta a ponta
- testes críticos executados
- refinamentos mínimos aplicados

## Checklist
- [ ] implementar estados de carregando
- [ ] implementar estados de vazio
- [ ] implementar estados de erro
- [ ] implementar estados de sucesso
- [ ] implementar estados de bloqueado
- [ ] implementar estados de sem permissão
- [ ] criar componentes mínimos reutilizáveis
- [ ] revisar fluxo P0 ponta a ponta
- [ ] corrigir bugs críticos
- [ ] validar permissões finais

## O que testar no final
- [ ] fluxo cadastro → aprovação → anúncio → solicitação → negociação → avaliação funciona
- [ ] admin consegue operar
- [ ] reputação está correta
- [ ] regras críticas do domínio estão respeitadas
- [ ] não há falha crítica impedindo o uso do MVP

---

# Regras de execução para não se perder

## 1. Seguir por fases pequenas
Não tentar fazer o checklist inteiro de uma vez.

Usar assim:
- primeiro a base técnica
- depois banco + auth + permissão
- depois o fluxo P0
- depois os refinamentos

## 2. Trabalhar por blocos funcionais
Sempre pegar **um bloco por vez**.

## 3. Sequência obrigatória em cada bloco
```text
regra → banco → tipo/interface → serviço → tela → validação
```

## 4. Não misturar tudo
Evitar fazer ao mesmo tempo:
- tela
- chat
- banco
- admin
- reputação

**Regra prática: 1 fluxo principal por vez**

## 5. Definir “pronto” para cada etapa
Antes de começar um bloco, responder:
- o que precisa existir para isso estar concluído?
- quais regras precisam funcionar?
- o que vou testar no final?

## 6. Commits pequenos e frequentes
Exemplos:
- `feat: cria schema inicial de empresas e usuarios`
- `feat: implementa login com supabase auth`
- `feat: cria fluxo de submissao cadastral`

## 7. Validar sempre ao terminar cada bloco
Terminou uma parte? Testa logo.

## 8. Priorizar o núcleo antes do visual
Primeiro fazer funcionar:
- regra
- estado
- persistência
- permissão

Depois refinar:
- layout
- animação
- visual fino

---

# Regra principal do projeto

> **Nunca codar por impulso. Sempre implementar a partir do que já foi definido nas Fases 3, 4 e 5.**

---

# Resumo final

Este checklist deve ser usado como:
- guia sequencial
- dividido em blocos
- um fluxo por vez
- com validação ao final de cada bloco
