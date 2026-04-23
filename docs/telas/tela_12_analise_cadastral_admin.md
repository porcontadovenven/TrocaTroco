# Tela 11 — Análise cadastral admin

## 1. Nome da tela
Análise cadastral admin

## 2. Objetivo
Permitir que o admin/moderação analise o cadastro de uma empresa, tomando decisão de aprovação ou reprovação com rastreabilidade do histórico de envios e correções.

## 3. Acesso
Admin / moderação

## 4. Origem de navegação
O usuário pode chegar nesta tela por:
- Painel administrativo
- lista de empresas cadastradas
- fila de empresas pendentes de análise

## 5. Tipo de tela
Tela de análise e decisão cadastral.

## 6. Estrutura lógica da tela
A tela deve conter, em nível funcional:

- identificação da empresa analisada
- dados cadastrais enviados
- dados do responsável principal
- status cadastral atual
- histórico de reprovações e reenvios
- ações de aprovação e reprovação
- campo/bloco para registrar motivo da reprovação

## 7. Regras gerais da tela
- a análise cadastral é manual
- a empresa pode estar em análise, aprovada ou reprovada
- o admin deve conseguir entender o estado atual e o histórico do cadastro
- a reprovação deve registrar qual informação precisa ser corrigida
- a aprovação libera a operação da empresa no marketplace

## 8. O que precisa existir nesta tela

### Conteúdo mínimo
- nome da empresa
- CNPJ
- dados da empresa
- dados do responsável
- status atual do cadastro
- histórico de reprovações e reenvios
- ação de **Aprovar**
- ação de **Reprovar**
- campo para justificar ou indicar inconsistência

### Conteúdo adicional recomendado
- data do envio atual
- referência dos envios anteriores
- marcação visual do que foi alterado entre tentativas, se futuramente fizer sentido

## 9. Ações principais
- Aprovar cadastro
- Reprovar cadastro
- Registrar motivo da reprovação
- Voltar para a lista de empresas / fila de análise

## 10. Validações visíveis
- a reprovação não deve acontecer sem registro do motivo
- a aprovação deve atualizar o status da empresa
- o histórico deve permanecer consultável mesmo após nova decisão
- usuários sem perfil administrativo não devem acessar essa tela

## 11. Estados principais da tela

### Estado 1 — Empresa pendente de análise
O admin vê:
- cadastro completo enviado
- status em análise
- ações de aprovar ou reprovar

### Estado 2 — Empresa aprovada
O admin vê:
- status aprovado
- histórico da decisão
- operação já liberada para a empresa

### Estado 3 — Empresa reprovada
O admin vê:
- status reprovado
- motivo registrado
- histórico de retorno/correção, quando houver

### Estado 4 — Empresa reenviada para nova análise
O admin vê:
- novo envio disponível
- histórico anterior preservado
- novo ciclo de análise habilitado

## 12. Estados de interface
- carregando cadastro
- erro ao carregar dados da empresa
- sucesso com dados exibidos
- erro ao aprovar
- erro ao reprovar
- sem permissão

## 13. Feedbacks visíveis
- confirmação de aprovação com atualização de status
- confirmação de reprovação com motivo registrado
- mensagem de erro quando a ação falhar
- indicação visível de histórico anterior quando existir

## 14. Saídas / navegação de saída
- voltar para **Painel administrativo**
- voltar para lista/fila de empresas
- permanecer na própria tela após decisão com status atualizado

## 15. Regras de negócio refletidas na tela
- a aprovação cadastral é manual
- aprovação e reprovação são decisões administrativas formais
- a empresa reprovada pode corrigir e reenviar
- o histórico de reprovações e reenvios deve ser preservado

## 16. Observações
Este documento define a lógica funcional da tela.
Ele não fixa layout visual, estrutura estética, posicionamento final de blocos ou design de interface.
