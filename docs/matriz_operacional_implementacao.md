# Fase 5 — Matriz Operacional para Implementação

## 1. Objetivo
Traduzir a Fase 5 para um formato operacional, direto e utilizável durante a implementação com Copilot.

---

## 2. Fonte da verdade durante a implementação
Ao implementar qualquer bloco, usar como referência:

1. Fase 3 — Design funcional
2. Fase 4 — Domínio e dados
3. Fase 4.5 — Stack
4. Fase 5 — Arquitetura e implementação

Se houver conflito:
- a regra de negócio da Fase 4 prevalece sobre improviso
- a rota e a estrutura da Fase 5 prevalecem sobre sugestão automática do agente

---

## 3. Ordem fixa de trabalho por bloco
Sempre seguir esta sequência:

```text
regra → banco → tipo/interface → serviço → tela → validação
```

---

## 4. O que não pode ser inventado durante a implementação
Não inventar:
- novas rotas
- novos status
- novos papéis de acesso
- novas entidades
- novas regras de remanescente
- novas regras de moderação
- novas exceções para conclusão do anúncio
- múltiplos usuários principais por empresa

---

## 5. Tabelas mínimas por ordem de criação

### Primeiro grupo
- empresas
- usuarios
- submissoes_cadastrais

### Segundo grupo
- anuncios
- itens_composicao_anuncio

### Terceiro grupo
- solicitacoes
- itens_composicao_solicitacao

### Quarto grupo
- negociacoes
- mensagens_negociacao

### Quinto grupo
- avaliacoes

### Sexto grupo
- tickets_moderacao
- eventos_ticket_moderacao

### Sétimo grupo
- verificacoes_cadastrais
- eventos_timeline

---

## 6. Serviços mínimos obrigatórios

### Cadastro
- criar_empresa_e_submissao
- reprovar_submissao
- aprovar_submissao
- reenviar_submissao

### Anúncios
- criar_anuncio
- listar_anuncios_publicos
- listar_meus_anuncios
- obter_detalhe_anuncio

### Solicitações
- criar_solicitacao
- aceitar_solicitacao
- recusar_solicitacao
- cancelar_solicitacao
- expirar_solicitacao

### Negociação
- criar_negociacao_a_partir_do_aceite
- enviar_mensagem_negociacao
- chamar_moderador
- encerrar_operacao_negociacao
- finalizar_negociacao

### Avaliação
- enviar_avaliacao
- aprovar_comentario_avaliacao
- barrar_comentario_avaliacao
- responder_comentario_publicado

### Tickets externos
- abrir_ticket_externo
- registrar_evento_ticket
- encerrar_ticket

---

## 7. Telas mínimas por ordem de construção

### Primeiro grupo
- Login
- Cadastro de empresa
- Status cadastral
- Análise cadastral admin

### Segundo grupo
- Dashboard
- /anunciar
- /anuncios
- Detalhe do anúncio
- Meus anúncios

### Terceiro grupo
- Solicitações

### Quarto grupo
- Tela da negociação

### Quinto grupo
- Perfil da empresa
- Moderação de avaliações
- Tickets admin
- Painel administrativo

---

## 8. Validações manuais obrigatórias por fluxo

### Cadastro + aprovação
- cadastro envia
- submissão fica em análise
- reprovação funciona
- reenvio funciona
- aprovação libera operação

### Anúncios
- oferta cria corretamente
- necessidade cria corretamente
- remanescente existe
- descoberta pública funciona

### Solicitações
- pendente não reserva saldo
- aceite cria negociação
- recusa encerra corretamente
- cancelamento respeita janela

### Negociação
- chat só aparece após aceite
- moderador entra no mesmo chat
- encerramento operacional muda o estado correto

### Avaliação
- avaliação exige nota
- comentário pode ser nulo
- nota entra na reputação no envio
- comentário só aparece após aprovação

### Tickets externos
- ticket externo abre
- ticket registra andamento
- ticket encerra

---

## 9. Regra de commit
Commits devem ser pequenos e por bloco funcional.

Exemplos:
- `feat: cria schema inicial de empresas e usuarios`
- `feat: implementa login com supabase auth`
- `feat: implementa fluxo de submissao cadastral`
- `feat: cria servico de solicitacao com aceite e recusa`

---

## 10. Critério de segurança para Copilot
Se o Copilot sugerir:
- nova rota não documentada
- novo nome de tabela
- status diferente do aprovado
- abstração grande não pedida
- backend separado
- lógica divergente das fases

A sugestão deve ser recusada ou adaptada para o padrão já congelado.

---

## 11. Regra final
Implementar sempre com foco em:
- bloco pequeno
- regra fechada
- validação ao final
- sem improviso
- sem abrir várias frentes ao mesmo tempo
