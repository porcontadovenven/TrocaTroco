# Fase 4 — Regras de consistência e cálculos (final)

## 1. Objetivo
Definir as regras operacionais e os cálculos de consistência que sustentam o modelo de dados do MVP.

---

## 2. Saldo e remanescente do anuncio

## 2.1 Regra central
Solicitação pendente não reserva saldo.
A reserva operacional do valor acontece apenas no aceite.

## 2.2 Regra de consumo
Quando uma solicitação é aceita:
- o valor aceito deixa de ficar disponível para novas solicitações
- o remanescente do anúncio deve ser atualizado

## 2.3 Regra de devolução
Quando uma negociação aceita é cancelada:
- o valor pode voltar para o remanescente do anúncio
- desde que o anúncio ainda não tenha sido formalmente concluído

## 2.4 Regra de não reabertura automática
Se o anúncio já estiver concluído:
- o cancelamento tardio de uma negociação não reabre o anúncio
- nova operação exige novo anúncio

---

## 3. Regras do anuncio de oferta

## 3.1 Composicao obrigatoria
Toda oferta deve possuir composição obrigatória.

## 3.2 Regra de local
A oferta define se aceita troca na própria empresa ou não.

### Consequência
- se aceitar na própria empresa, a troca pode ocorrer em `empresa_autora`
- se não aceitar, a autora deverá se deslocar até `empresa_solicitante`

## 3.3 Regra de valor integral ou parcial
A oferta define:
- apenas valor integral
- ou integral ou parcial

### Consequência
Se parcial for permitido:
- a solicitante pode pedir valor menor
- deve informar composição desejada

---

## 4. Regras do anuncio de necessidade

## 4.1 Composicao obrigatoria
Toda necessidade deve possuir composição obrigatória.

## 4.2 Regra de local
A troca deve ocorrer em apenas um de dois locais:
- `empresa_autora`
- `empresa_solicitante`

## 4.3 Atendimento parcial
O anúncio de necessidade também suporta atendimento parcial.

### Consequências
- a necessidade pode ser atendida em partes
- o remanescente da necessidade precisa ser calculado
- o anúncio continua ativo enquanto houver remanescente
- o encerramento final só ocorre quando não houver remanescente, não houver negociação pendente em aberto, a operação estiver encerrada e as duas avaliações obrigatórias da negociação final já tiverem sido enviadas

---

## 5. Regras da solicitacao

## 5.1 Coexistencia
Múltiplas solicitações pendentes podem coexistir sobre o mesmo anúncio.

## 5.2 Prazo de resposta
A solicitação pendente pode expirar após o prazo de resposta definido.

## 5.3 Cancelamento pela solicitante
A solicitante pode cancelar a própria solicitação:
- se ela ainda estiver pendente
- e dentro da janela de 15 minutos

## 5.4 Meio de pagamento
Toda solicitação deve registrar o meio de pagamento pretendido.

## 5.5 Local da troca
Toda solicitação operacional deve registrar o local da troca dentro das duas possibilidades válidas:
- `empresa_autora`
- `empresa_solicitante`

## 5.6 Empresa destinataria derivada
A solicitação não precisa persistir uma coluna própria de empresa destinatária.
Ela pode ser derivada a partir do anúncio.

---

## 6. Regras da negociacao

## 6.1 Criacao
A negociação só existe após o aceite.

## 6.2 Chat
O chat só existe dentro da negociação.

## 6.3 Moderacao
Na negociação:
- existe a ação `chamar moderador`
- a mediação ocorre no mesmo chat
- não é aberto ticket para o fluxo interno da negociação
- o acompanhamento deve ser refletido por `status_moderacao`

## 6.4 Encerramento operacional
A negociação pode ser encerrada operacionalmente antes da finalização completa do ciclo.

## 6.5 Finalizacao
A negociação só pode ser considerada finalizada depois que ambas as partes tiverem avaliado.

---

## 7. Regras da avaliacao

## 7.1 Condicao de criacao
A avaliação só pode ser criada após o encerramento operacional da negociação.

## 7.2 Estrutura obrigatoria
Toda avaliação do MVP possui:
- nota obrigatória
- comentário opcional

## 7.3 Comentario opcional
Se não houver comentário:
- `texto_comentario = null`
- `status_comentario = null`

Se houver comentário:
- nasce como `pendente_moderacao`
- depois pode virar `aprovado` ou `barrado`

## 7.4 Nota impacta reputacao imediatamente
A nota já entra na reputação assim que a avaliação é enviada.

## 7.5 Camada publica textual
O comentário só entra na camada pública após moderação.

## 7.6 Resposta da empresa avaliada
Só pode existir:
- após o comentário estar publicado

---

## 8. Calculo de reputacao publica

## 8.1 Media
A reputação pública deve usar média simples das notas.

## 8.2 Volume
Deve exibir volume total de avaliações.

## 8.3 Peso
Todas as avaliações têm o mesmo peso.

## 8.4 Separacao entre nota e comentario
A reputação numérica:
- considera as notas imediatamente após envio

A reputação textual pública:
- considera apenas comentários aprovados

---

## 9. Perfil publico da empresa

## 9.1 Fontes do perfil
O perfil público é composto por:
- dados públicos da empresa
- verificações visíveis
- reputação
- comentários aprovados
- respostas da empresa
- anúncios ativos

## 9.2 Dados privados
Não devem ser públicos:
- documentos enviados
- dados internos de validação
- dados financeiros
- contatos privados não destinados à exibição
- informações sensíveis

---

## 10. Ticket de moderacao

## 10.1 Geracao
Toda denúncia externa válida gera ticket.

## 10.2 Vinculo
O ticket deve apontar para o contexto do caso:
- perfil_empresa
- administrativo
- outro_contexto

## 10.3 Resolucao
O ticket deve permitir registrar:
- andamento
- decisão ou solução
- encerramento

---

## 11. Timeline e rastreabilidade

## 11.1 Regra geral
Eventos importantes devem ser registrados em timeline ou auditoria.

## 11.2 Eventos minimos recomendados
- cadastro enviado
- aprovação ou reprovação
- anúncio publicado
- solicitação enviada
- aceite ou recusa
- criação da negociação
- chamada de moderador
- encerramento operacional
- envio das avaliações
- finalização da negociação
- abertura de ticket externo
- moderação do comentário

---

## 12. Permissoes estruturais

## 12.1 Visitante
- pode explorar Home, /anuncios, Detalhe do anúncio em modo parcial e Perfil da empresa
- não pode operar

## 12.2 Empresa logada não aprovada
- pode acessar contexto básico da conta
- não pode operar no marketplace

## 12.3 Empresa logada e aprovada
- pode operar normalmente no marketplace

## 12.4 Admin ou moderacao
- pode acessar fluxo administrativo
- pode analisar empresas
- pode acessar tickets externos
- pode moderar avaliações
- pode entrar em negociações e chats quando chamado ou quando necessário

---

## 13. Observação final
As regras deste documento devem orientar:
- constraints de banco
- validações de backend
- autorização
- consistência entre entidades
- comportamento transacional do MVP
