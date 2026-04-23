# Tela 2 — Status cadastral / aprovação

## 1. Nome da tela
Status cadastral / aprovação

## 2. Objetivo
Permitir que a empresa acompanhe sua situação cadastral dentro da plataforma e entenda se já pode operar no marketplace ou se ainda depende de análise/correção.

## 3. Acesso
Empresa logada

## 4. Origem de navegação
A empresa pode chegar nesta tela por:
- envio concluído do cadastro
- login na plataforma
- dashboard, quando aplicável
- navegação interna da área da empresa

## 5. Tipo de tela
Tela de acompanhamento cadastral e liberação operacional.

## 6. Estrutura lógica da tela
A tela deve conter, em nível funcional:

- identificação clara do status cadastral atual
- texto explicativo sobre o que aquele status significa
- bloco de próximos passos
- ações disponíveis conforme o estado
- acesso contextual para seguir o fluxo correto

## 7. Regras gerais da tela
- a tela precisa refletir o estado cadastral real da empresa
- a empresa pode estar em análise, aprovada ou reprovada
- a operação no marketplace depende da aprovação cadastral
- a empresa logada, mas não aprovada, pode navegar em áreas básicas, mas não pode operar
- em caso de reprovação, a tela deve apontar o que precisa ser corrigido

## 8. Estados principais da tela

### Estado 1 — Cadastro em análise
A empresa deve ver:
- status: **Cadastro em análise**
- mensagem de que o cadastro foi enviado e está aguardando validação
- informação de que a operação ainda não está liberada

Ações disponíveis:
- visualizar dados já enviados
- navegar na área básica da conta

Ações indisponíveis:
- publicar anúncio
- enviar solicitação
- negociar
- usar recursos operacionais do marketplace

### Estado 2 — Cadastro aprovado
A empresa deve ver:
- status: **Aprovada**
- mensagem de confirmação de aprovação
- indicação de que a operação foi liberada

Ações disponíveis:
- acessar o dashboard operacional
- iniciar uso normal da plataforma

### Estado 3 — Cadastro reprovado
A empresa deve ver:
- status: **Reprovada**
- mensagem de reprovação
- indicação dos dados ou pontos que precisam ser corrigidos
- informação de que a operação segue bloqueada

Ações disponíveis:
- abrir fluxo de ajuste cadastral
- reenviar para análise depois da correção

## 9. O que precisa existir nesta tela

### Conteúdo mínimo
- título da tela
- badge ou indicador de status
- mensagem contextual do estado atual
- bloco de orientação sobre próximos passos
- ação principal compatível com o estado
- acesso aos dados da empresa, quando aplicável

## 10. Ações principais
- Ir para dashboard
- Ver dados da empresa
- Corrigir cadastro
- Reenviar para análise

## 11. Validações visíveis
- ações operacionais devem ficar bloqueadas enquanto a empresa não estiver aprovada
- a ação de corrigir cadastro só deve aparecer quando houver reprovação
- a ação de ir para o dashboard operacional só deve aparecer quando houver aprovação

## 12. Estados de interface
- carregando status cadastral
- status exibido com sucesso
- erro ao carregar status
- estado bloqueado operacionalmente
- estado sem pendências quando aprovado

## 13. Feedbacks visíveis
- status em análise deve comunicar espera
- status aprovado deve comunicar liberação
- status reprovado deve comunicar correção necessária
- erro de carregamento deve informar que não foi possível obter o status no momento

## 14. Saídas / navegação de saída

### Se estiver em análise
- navegar para áreas básicas da conta
- visualizar dados enviados

### Se estiver aprovada
- seguir para **Dashboard**

### Se estiver reprovada
- seguir para o fluxo de ajuste/reenvio cadastral

## 15. Regras de negócio refletidas na tela
- a aprovação cadastral é a condição que libera a operação no marketplace
- o status cadastral define o que a empresa pode ou não pode fazer
- reprovação não exclui a empresa da plataforma; ela mantém acesso básico e pode tentar novamente

## 16. Observações
Este documento define a lógica funcional da tela.
Ele não fixa layout visual, estrutura estética, posicionamento final de blocos ou design de interface.
