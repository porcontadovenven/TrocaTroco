# Tela 1 — Cadastro de empresa

## 1. Nome da tela
Cadastro de empresa

## 2. Objetivo
Permitir que uma empresa inicie seu cadastro na plataforma, preenchendo os dados necessários para envio à análise administrativa.

## 3. Acesso
Público

## 4. Origem de navegação
A empresa pode chegar nesta tela por:
- Home
- Login

## 5. Tipo de tela
Tela de cadastro em etapas.

## 6. Estrutura lógica da tela
A tela deve conter, em nível funcional:

- identificação da etapa atual
- indicador de progresso entre as etapas
- bloco principal com os campos da etapa atual
- ações de navegação entre etapas
- ação final de envio do cadastro
- atalho para login

## 7. Regras gerais da tela
- o cadastro será feito em etapas
- todos os campos são obrigatórios
- o cadastro deve ser concluído de uma vez
- não haverá opção de “salvar e continuar depois”
- o CNPJ será o primeiro campo da etapa de dados da empresa
- a empresa só poderá enviar o cadastro após completar todas as etapas
- a etapa de revisão deve permitir voltar e corrigir dados antes do envio

## 8. Etapas da tela

### Etapa 1 — Dados da empresa
Campos obrigatórios:
- CNPJ
- razão social / nome empresarial
- endereço
- telefone
- email

### Etapa 2 — Dados do responsável
Campos obrigatórios:
- nome completo
- CPF
- telefone
- email
- cargo / função
- vínculo atual com a empresa cadastrada

### Etapa 3 — Revisão
A etapa final deve mostrar um resumo completo do que foi preenchido, separado por blocos:
- dados da empresa
- dados do responsável

Nesta etapa, a empresa poderá:
- revisar todas as informações
- voltar para a etapa da empresa
- voltar para a etapa do responsável
- corrigir qualquer dado
- clicar em **Enviar cadastro**

## 9. O que precisa existir nesta tela

### Conteúdo mínimo
- título da tela
- texto curto explicando a finalidade do cadastro
- indicador de progresso das etapas
- campos da etapa atual
- mensagens de validação quando necessário
- ação de continuar
- ação de voltar
- ação de enviar cadastro, na etapa final
- link para login

## 10. Ações principais
- Continuar
- Voltar
- Enviar cadastro
- Ir para login

## 11. Validações visíveis
- campo obrigatório não preenchido deve impedir o avanço
- campo com formato inválido deve exibir erro visível
- o sistema não deve permitir envio final com pendências de validação
- a etapa de revisão não substitui validação; ela apenas confirma os dados antes do envio

## 12. Estados principais da tela
- preenchimento normal
- erro de validação de campo
- erro no envio
- envio com sucesso

## 13. Feedbacks visíveis
- campo inválido mostra erro no próprio campo ou logo abaixo
- campo obrigatório não preenchido bloqueia avanço para a próxima etapa
- erro no envio mostra mensagem clara de falha
- envio com sucesso leva para o estado/tela de **cadastro em análise**

## 14. Saídas / navegação de saída

### Durante o fluxo
- **Continuar** leva para a próxima etapa
- **Voltar** leva para a etapa anterior
- **Ir para login** leva para a tela de Login

### No fim do fluxo
- **Enviar cadastro** registra o envio
- depois do envio, a empresa é levada para a tela/estado de **status cadastral / aprovação**

## 15. Regras de negócio refletidas na tela
- a empresa inicia cadastro de forma pública
- o cadastro ainda não aprova a empresa automaticamente
- após o envio, a empresa entra em **cadastro em análise**
- o envio do cadastro não libera operação no marketplace
- a aprovação continuará dependendo da análise administrativa

## 16. Observações
Este documento define a lógica funcional da tela.
Ele não fixa layout visual, estrutura estética, posicionamento final de blocos ou design de interface.
