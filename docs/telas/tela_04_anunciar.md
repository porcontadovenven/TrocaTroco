# Tela 4 — /anunciar

## 1. Nome da tela
/anunciar

## 2. Objetivo
Funcionar como ponto central para iniciar a criação de um anúncio, permitindo que a empresa escolha entre oferta de troco e necessidade de troco e siga para o fluxo correto.

## 3. Acesso
Empresa logada e aprovada

## 4. Origem de navegação
A empresa pode chegar nesta tela por:
- Dashboard
- Meus anúncios
- atalhos internos da área operacional

## 5. Tipo de tela
Tela de entrada para criação de anúncio.

## 6. Estrutura lógica da tela
A tela deve conter, em nível funcional:

- título da área de criação
- explicação curta sobre o que a empresa fará ali
- escolha entre os dois tipos de anúncio
- direcionamento para o fluxo correspondente

## 7. Regras gerais da tela
- a criação de anúncio começa sempre por esta tela
- esta tela não é o formulário final de anúncio
- a empresa precisa escolher primeiro se deseja publicar:
  - oferta de troco
  - necessidade de troco
- só depois dessa escolha ela segue para o preenchimento em etapas

## 8. O que precisa existir nesta tela

### Conteúdo mínimo
- título da página
- descrição curta
- opção **Oferta de troco**
- opção **Necessidade de troco**
- explicação resumida de cada opção
- ação para seguir ao próximo passo

## 9. Ações principais
- Escolher **Oferta de troco**
- Escolher **Necessidade de troco**
- Continuar para o fluxo correspondente
- Voltar para a área anterior, quando aplicável

## 10. Validações visíveis
- a empresa não deve avançar sem escolher um tipo de anúncio
- o sistema deve deixar claro qual opção está selecionada antes do avanço
- o acesso deve estar bloqueado para empresa não aprovada

## 11. Estados principais da tela

### Estado 1 — Escolha ainda não feita
A empresa vê:
- as duas opções disponíveis
- explicação de cada tipo
- ação principal ainda indisponível ou condicionada à seleção

### Estado 2 — Oferta selecionada
A empresa vê:
- opção de oferta marcada
- confirmação visual da escolha
- caminho liberado para o fluxo de publicação de oferta

### Estado 3 — Necessidade selecionada
A empresa vê:
- opção de necessidade marcada
- confirmação visual da escolha
- caminho liberado para o fluxo de publicação de necessidade

## 12. Estados de interface
- carregando tela
- seleção normal
- erro ao abrir fluxo
- bloqueado para empresa não aprovada
- sucesso no redirecionamento para o formulário correto

## 13. Feedbacks visíveis
- mensagem orientando a escolha do tipo de anúncio
- destaque visual da opção selecionada
- mensagem de erro se o fluxo não puder ser iniciado
- mensagem de bloqueio se a empresa não puder operar

## 14. Saídas / navegação de saída

### Se escolher oferta
- seguir para o fluxo de preenchimento de **anúncio de oferta**

### Se escolher necessidade
- seguir para o fluxo de preenchimento de **anúncio de necessidade**

### Se voltar
- retornar ao **Dashboard** ou à origem anterior, quando aplicável

## 15. Regras de negócio refletidas na tela
- existem dois tipos de anúncio: oferta e necessidade
- ambos partem de um ponto central comum
- a escolha do tipo vem antes do preenchimento do anúncio
- oferta e necessidade têm fluxos de preenchimento diferentes

## 16. Observações
Este documento define a lógica funcional da tela.
Ele não fixa layout visual, estrutura estética, posicionamento final de blocos ou design de interface.
