# Tela 8 — Tela da negociação

## 1. Nome da tela
Tela da negociação

## 2. Objetivo
Concentrar, em uma única tela, todo o contexto operacional da negociação, incluindo os dados do acordo, o chat oficial entre as partes e a etapa posterior de avaliação.

## 3. Acesso
- Empresa logada e aprovada participante da negociação
- Admin / moderação, quando houver necessidade de supervisão, auditoria ou intervenção

## 4. Origem de navegação
O usuário pode chegar nesta tela por:
- Solicitações
- Dashboard, quando houver negociação em andamento
- links/contextos internos da operação
- painel administrativo, no caso de admin / moderação

## 5. Tipo de tela
Tela operacional central da negociação.

## 6. Estrutura lógica da tela
A tela deve conter, em nível funcional:

- identificação da negociação
- contexto do anúncio que originou a negociação
- identificação das empresas envolvidas
- resumo do acordo operacional
- área de chat oficial
- ação de denunciar / chamar moderador
- ação de concluir negociação
- bloco de avaliação, quando a negociação estiver concluída

## 7. Regras gerais da tela
- a negociação só existe após o aceite da solicitação
- o chat só existe dentro do contexto da negociação
- apenas empresas participantes e admin/moderação podem acessar a negociação
- a avaliação só deve aparecer após a conclusão da negociação
- a mesma tela deve atender as fases de:
  - negociação em andamento
  - moderação acionada, quando houver
  - negociação concluída
  - avaliação da contraparte

## 8. O que precisa existir nesta tela

### Conteúdo mínimo
- título ou identificação da negociação
- identificação do anúncio relacionado
- identificação das duas empresas envolvidas
- tipo da operação
- valor negociado
- composição negociada, quando aplicável
- local da troca
- meio de pagamento informado
- status atual da negociação
- bloco do chat oficial
- ação de denunciar / chamar moderador

### Conteúdo condicional
#### Se a negociação estiver em andamento
- ação de concluir negociação
- chat operacional ativo

#### Se a moderação tiver sido acionada
- indicação de caso em acompanhamento
- presença do moderador no mesmo contexto do chat

#### Se a negociação estiver concluída
- chat preservado como histórico
- ação de avaliar contraparte
- bloco de avaliação habilitado

## 9. Ações principais
- Enviar mensagem no chat
- Denunciar / chamar moderador
- Concluir negociação
- Avaliar contraparte, quando aplicável
- Visualizar histórico da operação

## 10. Validações visíveis
- usuário que não participa da negociação não deve acessá-la
- chat não deve existir antes do aceite
- ação de concluir negociação só deve aparecer quando a operação estiver em andamento
- ação de avaliar só deve aparecer após a conclusão
- admin/moderação pode acessar o histórico completo e intervir quando necessário

## 11. Estados principais da tela

### Estado 1 — Negociação em andamento
O usuário vê:
- contexto completo da negociação
- chat ativo
- dados da operação
- ação de denunciar/chamar moderador
- ação de concluir negociação

### Estado 2 — Moderação acionada
O usuário vê:
- negociação em andamento com indicação de acompanhamento
- mesmo chat da negociação
- entrada do moderador, quando aplicável
- histórico preservado

### Estado 3 — Negociação concluída
O usuário vê:
- operação encerrada
- chat preservado como histórico
- etapa de avaliação habilitada

### Estado 4 — Avaliação disponível / em uso
O usuário vê:
- ação para avaliar contraparte
- campos de nota e comentário, quando entrar na etapa de avaliação
- confirmação depois do envio da avaliação

## 12. Estados de interface
- carregando negociação
- erro ao carregar negociação
- sem permissão
- sucesso com contexto operacional exibido
- chat sem mensagens ainda
- erro no envio de mensagem
- erro ao concluir negociação
- erro ao enviar avaliação

## 13. Feedbacks visíveis
- mensagem clara quando a negociação for concluída
- indicação visual de que a avaliação só pode acontecer após a conclusão
- aviso visível quando a moderação for acionada
- mensagem de erro quando não for possível carregar ou operar na negociação
- confirmação ao enviar mensagem, concluir operação ou enviar avaliação

## 14. Saídas / navegação de saída
- retorno para **Solicitações**, quando vier desse contexto
- retorno para **Dashboard**
- continuidade dentro da própria tela durante a operação
- após concluir, permanência na própria tela com etapa de avaliação disponível

## 15. Regras de negócio refletidas na tela
- negociação + chat + avaliação foram unificados em uma única tela
- a aceitação da solicitação cria a negociação
- a denúncia/moderação acontece dentro do contexto da negociação
- a conclusão encerra a etapa operacional e abre a etapa de reputação
- a avaliação continua vinculada à negociação concluída

## 16. Observações
Este documento define a lógica funcional da tela.
Ele não fixa layout visual, estrutura estética, posicionamento final de blocos ou design de interface.
