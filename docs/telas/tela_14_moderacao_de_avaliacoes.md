# Tela 13 — Moderação de avaliações

## 1. Nome da tela
Moderação de avaliações

## 2. Objetivo
Permitir que o admin/moderação analise comentários de avaliações antes da publicação pública no perfil da empresa avaliada.

## 3. Acesso
Admin / moderação

## 4. Origem de navegação
O usuário pode chegar nesta tela por:
- Painel administrativo
- indicadores de comentários pendentes
- fluxo interno de moderação

## 5. Tipo de tela
Tela de moderação de comentários de avaliação.

## 6. Estrutura lógica da tela
A tela deve conter, em nível funcional:

- lista de avaliações/comentários pendentes
- identificação da negociação e das empresas envolvidas
- visualização do comentário submetido
- visualização da nota associada
- ações para aprovar ou barrar o comentário
- histórico básico da decisão, quando aplicável

## 7. Regras gerais da tela
- a nota pode existir no sistema antes da publicação pública do comentário
- o comentário só deve ficar público após moderação
- a decisão administrativa define se o texto pode ou não aparecer no perfil público
- a moderação deve conseguir entender o contexto mínimo da avaliação

## 8. O que precisa existir nesta tela

### Conteúdo mínimo
- identificação da avaliação
- empresa avaliadora
- empresa avaliada
- nota registrada
- comentário submetido
- referência da negociação correspondente
- status da moderação do comentário
- ação de **Aprovar**
- ação de **Barrar / Reprovar**

### Conteúdo adicional recomendado
- data de envio da avaliação
- motivo do bloqueio, quando o comentário for barrado
- histórico básico de decisão, quando relevante

## 9. Ações principais
- Abrir avaliação pendente
- Aprovar comentário
- Barrar comentário
- Registrar motivo do bloqueio, quando aplicável

## 10. Validações visíveis
- comentário não deve ser publicado automaticamente
- a ação administrativa deve atualizar o estado da moderação do comentário
- usuários sem perfil administrativo não devem acessar essa tela
- o contexto da avaliação deve estar suficientemente claro para decisão

## 11. Estados principais da tela

### Estado 1 — Comentários pendentes
O admin vê:
- lista de avaliações aguardando moderação
- acesso ao detalhe do comentário
- ações de decisão

### Estado 2 — Comentário aprovado
O admin vê:
- comentário já liberado para publicação
- estado atualizado da moderação

### Estado 3 — Comentário barrado
O admin vê:
- comentário não publicado
- motivo da decisão, quando registrado
- histórico de moderação preservado

### Estado 4 — Sem comentários pendentes
O admin vê:
- mensagem de fila vazia
- contexto de que não há pendências no momento

## 12. Estados de interface
- carregando avaliações pendentes
- vazio
- erro ao carregar comentários
- sucesso com fila exibida
- erro ao aprovar
- erro ao barrar
- sem permissão

## 13. Feedbacks visíveis
- confirmação ao aprovar comentário
- confirmação ao barrar comentário
- mensagem de erro quando a moderação falhar
- indicação visual do estado de cada comentário

## 14. Saídas / navegação de saída
- voltar para **Painel administrativo**
- permanecer na própria tela após moderação com fila atualizada
- navegar entre lista e detalhe da avaliação

## 15. Regras de negócio refletidas na tela
- avaliações entram no MVP com nota e comentário
- a nota compõe a reputação
- o comentário depende de moderação para ficar público
- a empresa avaliada só responde depois que o comentário é publicado

## 16. Observações
Este documento define a lógica funcional da tela.
Ele não fixa layout visual, estrutura estética, posicionamento final de blocos ou design de interface.
