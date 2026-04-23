# Fase 4 — Estados e transições (final)

## 1. Objetivo
Definir os estados de domínio das principais entidades do TrocaTroco e as transições permitidas entre esses estados.

---

## 2. Empresa / Submissao cadastral

## 2.1 Estado operacional da empresa
### Estados
- em_analise
- aprovada
- reprovada

### Transições
- em_analise → aprovada
- em_analise → reprovada
- reprovada → em_analise *(quando houver correção e reenvio)*

### Observações
- a aprovação libera a operação
- a reprovação mantém a empresa na plataforma, mas sem operação
- o status da empresa acompanha a submissão vigente mais recente

## 2.2 Estado da submissao cadastral
### Estados
- em_analise
- aprovada
- reprovada

### Observações
- representam o estado daquela submissão específica
- o histórico das submissões anteriores permanece preservado

---

## 3. Anuncio

## 3.1 Estados do anuncio
### Estados
- ativo
- em_negociacao
- concluido
- cancelado
- expirado

## 3.2 Regras de transição

### Publicação
- anúncio recém-publicado e válido → ativo

### Ativo → em_negociacao
Quando:
- não existe mais remanescente disponível
- e existe pelo menos uma negociação em andamento vinculada ao valor total comprometido

### Ativo → concluido
Quando:
- não houver valor remanescente
- não houver negociação pendente em aberto
- a operação estiver encerrada
- e as duas avaliações obrigatórias da negociação final já tiverem sido enviadas

### Ativo → cancelado
Quando:
- a empresa autora ou regra administrativa encerra o anúncio manualmente

### Ativo → expirado
Quando:
- a validade do anúncio termina

### Em_negociacao → concluido
Quando:
- não houver valor remanescente
- não houver negociação pendente em aberto
- a operação estiver encerrada
- e as duas avaliações obrigatórias da negociação final já tiverem sido enviadas

### Em_negociacao → ativo
Quando:
- uma negociação aceita é cancelada
- e o anúncio ainda pode voltar a ter remanescente disponível

### Regra especial
Se o anúncio já estiver formalmente concluído:
- o cancelamento tardio de uma negociação não reabre o anúncio
- nova operação exige novo anúncio

---

## 4. Solicitacao

## 4.1 Estados da solicitacao
### Estados
- pendente
- aceita
- recusada
- cancelada
- expirada

## 4.2 Regras de transição
- criada → pendente
- pendente → aceita
- pendente → recusada
- pendente → cancelada *(pela solicitante dentro da janela de 15 minutos)*
- pendente → expirada *(quando o prazo de resposta se encerra)*

### Observações
- aceite cria negociação
- recusa encerra a solicitação sem chat
- pendência não reserva saldo
- cancelamento só existe para a solicitante e dentro da regra definida

---

## 5. Negociacao

## 5.1 Estados da negociacao
### Estados
- em_andamento
- operacao_encerrada
- finalizada
- cancelada

## 5.2 Regras de transição
- criada após aceite → em_andamento
- em_andamento → operacao_encerrada
- operacao_encerrada → finalizada
- em_andamento → cancelada

### Significado dos estados
#### em_andamento
- negociação ativa
- chat disponível
- moderação pode ser acionada

#### operacao_encerrada
- parte operacional terminou
- avaliações obrigatórias ficam habilitadas
- ainda não houve o fechamento final do ciclo

#### finalizada
- ambas as partes já avaliaram
- ciclo da negociação terminou completamente

#### cancelada
- negociação interrompida antes da finalização do ciclo

## 5.3 Status de moderacao da negociacao
### Estados
- nao_acionada
- acionada
- em_acompanhamento
- encerrada

### Regras
- negociação inicia em `nao_acionada`
- ao chamar moderador → `acionada`
- quando moderador estiver efetivamente atuando → `em_acompanhamento`
- quando a mediação for encerrada → `encerrada`

### Observação
`status_moderacao` é um ciclo paralelo de acompanhamento, não substitui o estado principal da negociação.

---

## 6. Ticket de moderacao

## 6.1 Estados do ticket
### Estados
- aberto
- em_analise
- encerrado

## 6.2 Regras de transição
- denúncia registrada → aberto
- aberto → em_analise
- em_analise → encerrado

### Observações
- ticket é usado para contextos externos à negociação
- toda denúncia válida gera ticket

---

## 7. Avaliacao

## 7.1 Estado funcional da avaliacao
A avaliação nasce após `operacao_encerrada` e antes de `finalizada`.

### Regras
- avaliação é obrigatória
- nota é obrigatória
- comentário é opcional
- a nota entra na reputação assim que a avaliação é enviada

### Observação
No nível de domínio, a avaliação pode ser tratada como “enviada” a partir da sua criação.

---

## 8. Moderacao do comentario da avaliacao

## 8.1 Estados do comentario
### Estados
- pendente_moderacao
- aprovado
- barrado

## 8.2 Regras
Se houver comentário:
- comentário enviado → `pendente_moderacao`
- `pendente_moderacao` → `aprovado`
- `pendente_moderacao` → `barrado`

Se não houver comentário:
- `texto_comentario = null`
- `status_comentario = null`

### Observações
- não existe estado `sem_comentario`
- a resposta da empresa avaliada só pode existir após comentário publicado

---

## 9. Timeline / eventos
A timeline não tem máquina de estados própria.
Ela registra eventos gerados pelas transições das outras entidades.

### Exemplos de eventos
- empresa_submetida
- empresa_aprovada
- empresa_reprovada
- anuncio_publicado
- solicitacao_enviada
- solicitacao_aceita
- solicitacao_recusada
- negociacao_criada
- operacao_encerrada
- negociacao_finalizada
- ticket_aberto
- avaliacao_enviada
- comentario_aprovado

---

## 10. Regras de consistencia entre estados

## 10.1 Solicitacao aceita
Se uma solicitação está `aceita`:
- deve existir uma negociação correspondente

## 10.2 Solicitacao recusada, cancelada ou expirada
Se uma solicitação está:
- recusada
- cancelada
- expirada

então:
- não deve existir negociação criada a partir dela

## 10.3 Negociacao em operacao_encerrada
Se uma negociação está `operacao_encerrada`:
- as avaliações devem poder ser criadas

## 10.4 Negociacao finalizada
Se uma negociação está `finalizada`:
- ambas as avaliações obrigatórias já foram enviadas

## 10.5 Anuncio ativo
Se um anúncio está `ativo`:
- deve possuir remanescente disponível

## 10.6 Comentario aprovado
Se um comentário está `aprovado`:
- ele pode aparecer publicamente
- a empresa avaliada pode responder

---

## 11. Observação final
Os estados definidos aqui são estados de domínio.
Estados de interface, mensagens e UX já foram tratados na Fase 3.
