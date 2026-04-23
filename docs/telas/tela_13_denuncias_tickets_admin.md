# Tela 12 — Denúncias / tickets admin

## 1. Nome da tela
Denúncias / tickets admin

## 2. Objetivo
Permitir que o admin/moderação acompanhe, analise e encerre os tickets originados por denúncias feitas na plataforma.

## 3. Acesso
Admin / moderação

## 4. Origem de navegação
O usuário pode chegar nesta tela por:
- Painel administrativo
- indicadores de tickets pendentes
- fluxo interno de moderação

## 5. Tipo de tela
Tela de acompanhamento e tratamento de denúncias.

## 6. Estrutura lógica da tela
A tela deve conter, em nível funcional:

- lista de tickets
- status de cada ticket
- referência do caso vinculado
- acesso ao detalhe do ticket
- acesso ao contexto vinculado, quando necessário
- ação de registrar solução/decisão
- ação de encerrar ticket

## 7. Regras gerais da tela
- toda denúncia válida gera um ticket
- o ticket deve ser rastreável
- o admin precisa entender a qual empresa, perfil ou negociação o caso está vinculado
- o ticket pode estar aberto, em análise ou encerrado
- o admin deve conseguir registrar a solução do caso antes do encerramento

## 8. O que precisa existir nesta tela

### Conteúdo mínimo
- identificação do ticket
- data de abertura
- origem da denúncia
- empresa(s) envolvida(s)
- vínculo do caso:
  - perfil
  - anúncio
  - negociação
  - chat
- status do ticket
- ação para abrir detalhe do ticket

### No detalhe do ticket
- resumo da denúncia
- contexto relacionado
- histórico do caso
- ação para registrar decisão/solução
- ação para encerrar ticket
- acessos contextuais para negociação/chat, quando aplicável

## 9. Ações principais
- Abrir ticket
- Registrar decisão/solução
- Encerrar ticket
- Acessar contexto vinculado ao caso
- Filtrar tickets por status, quando aplicável

## 10. Validações visíveis
- ticket não deve ser encerrado sem registro mínimo da solução, se essa for a regra operacional adotada
- status do ticket deve ser sempre visível
- o vínculo do ticket com o caso deve estar claro para o admin
- usuários sem perfil administrativo não devem acessar essa tela

## 11. Estados principais da tela

### Estado 1 — Ticket aberto
O admin vê:
- caso recém-registrado
- contexto inicial da denúncia
- possibilidade de iniciar análise

### Estado 2 — Ticket em análise
O admin vê:
- caso em acompanhamento
- possibilidade de acessar negociação/chat vinculado
- possibilidade de registrar solução

### Estado 3 — Ticket encerrado
O admin vê:
- caso finalizado
- decisão/solução registrada
- histórico preservado

### Estado 4 — Lista com múltiplos tickets
O admin vê:
- tickets em diferentes estados
- possibilidade de filtrar ou priorizar

## 12. Estados de interface
- carregando tickets
- vazio
- sem resultados por filtro
- erro ao carregar tickets
- sucesso com tickets exibidos
- erro ao registrar solução
- erro ao encerrar ticket
- sem permissão

## 13. Feedbacks visíveis
- confirmação ao registrar decisão/solução
- confirmação ao encerrar ticket
- mensagem de erro quando a ação falhar
- indicação visual do status atual do ticket

## 14. Saídas / navegação de saída
- voltar para **Painel administrativo**
- abrir contexto vinculado do caso
- permanecer na própria tela após atualizar o ticket
- navegar entre lista e detalhe do ticket

## 15. Regras de negócio refletidas na tela
- denúncia e ticket fazem parte da operação formal de moderação
- a moderação pode acompanhar casos ligados a perfil, negociação ou conversa
- a solução do caso deve ficar registrada
- o histórico do ticket deve ser preservado

## 16. Observações
Este documento define a lógica funcional da tela.
Ele não fixa layout visual, estrutura estética, posicionamento final de blocos ou design de interface.
