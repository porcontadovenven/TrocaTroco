# Documento Mestre — TrocaTroco

## 1. Propósito

O **TrocaTroco** é uma plataforma web B2B que conecta empresas que possuem troco disponível a empresas que precisam de troco.

A plataforma organiza a descoberta, a solicitação, a negociação, a comunicação oficial, a moderação e a reputação entre empresas.

---

## 2. O que a plataforma é

- um marketplace B2B de troco entre empresas
- um ambiente oficial para anúncio, solicitação, aceite, conversa e avaliação
- uma camada de confiança operacional entre empresas

---

## 3. O que a plataforma não é

- não recebe dinheiro
- não processa pagamento
- não faz custódia
- não garante liquidação financeira

---

## 4. Público-alvo

A plataforma atende empresas com CNPJ ativo, incluindo MEI.

No MVP, a estrutura será:
- 1 empresa = 1 conta = 1 usuário responsável principal

---

## 5. Pilares do produto

O produto é estruturado sobre os seguintes pilares:
- cadastro e aprovação de empresa
- anúncios de oferta e necessidade
- solicitações estruturadas
- aceite ou recusa
- chat oficial após aceite
- histórico da negociação
- denúncia e moderação
- avaliações e reputação pública
- perfil público da empresa

---

## 6. Tipos de anúncio

Existem dois tipos de anúncio:
- **oferta de troco**
- **necessidade de troco**

Todo anúncio deve possuir:
- valor
- composição
- local/região
- disponibilidade
- validade

A composição é obrigatória em todos os anúncios.

---

## 7. Regras da oferta de troco

Ao criar uma oferta, a empresa ofertante deve definir:
- valor total da oferta
- composição do troco
- se aceita troca na própria empresa ou não
- se aceita somente valor integral ou também valor parcial

A oferta pode funcionar em dois modos:
- somente valor integral
- valor integral ou parcial

Se a oferta aceitar valor parcial, a empresa solicitante poderá escolher um valor menor e definir a composição desejada.

A empresa ofertante terá a decisão final de aceitar ou recusar.

---

## 8. Regras da necessidade de troco

Ao criar uma necessidade, a empresa publica:
- valor desejado
- composição desejada

A lógica de local da troca deve seguir a mesma regra da oferta:
- a troca só poderá acontecer em um de dois locais possíveis
- na empresa A ou na empresa B

Não haverá local neutro, terceiro ponto ou combinação livre de outro local no MVP.

---

## 9. Local da troca

A lógica de local da troca ficará restrita a dois possíveis locais:
- empresa ofertante
- empresa solicitante

Na oferta:
- se a empresa ofertante aceitar troca em sua própria empresa, a operação poderá ocorrer lá
- se ela não aceitar, deverá se deslocar até a empresa solicitante

Na necessidade:
- a operação deverá ocorrer entre os dois endereços das empresas envolvidas
- nunca em local neutro ou terceiro ponto no MVP

---

## 10. Solicitação e aceite

A solicitação será estruturada e objetiva.

Ela não terá mensagem livre.

Na solicitação, a empresa interessada deverá informar:
- o valor desejado, quando aplicável
- a composição desejada, quando aplicável
- o meio de pagamento que pretende utilizar

A empresa autora do anúncio terá prazo inicial de até 12 horas para responder.

A empresa solicitante poderá cancelar a solicitação pendente em até 15 minutos após o envio.

Um mesmo anúncio poderá receber múltiplas solicitações pendentes ao mesmo tempo.

---

## 11. Regra de saldo

O saldo só será reservado no momento do aceite.

Solicitações pendentes não reservam saldo.

Se uma operação aceita for cancelada e o anúncio ainda estiver ativo, o valor retorna ao saldo disponível.

Se o anúncio já tiver sido finalizado, ele não reabre automaticamente. Nesse caso, será necessário criar um novo anúncio.

Quando a oferta aceitar valor parcial, o saldo remanescente deverá ficar visível.

---

## 12. Regra de múltiplos atendimentos

Um mesmo anúncio poderá atender várias empresas ao mesmo tempo, desde que ainda exista saldo disponível.

Enquanto houver saldo remanescente, o anúncio poderá continuar recebendo novas solicitações.

---

## 13. Status do anúncio

Os status do anúncio são:
- ativo
- em negociação
- concluído
- cancelado
- expirado

Regras principais:
- **ativo**: existe saldo disponível
- **em negociação**: todo o saldo da oferta já foi aceito e está em negociação
- **concluído**: a operação foi encerrada e ambas as empresas avaliaram
- **cancelado**: encerrado pela empresa autora ou por regra administrativa
- **expirado**: perdeu a validade

Se houver saldo restante, mesmo com negociações em andamento, o status principal continuará sendo **ativo**.

---

## 14. Chat oficial

O chat é o canal oficial da negociação.

Ele só será aberto após o aceite da solicitação.

O chat deve:
- registrar a comunicação entre as partes
- manter histórico
- permitir acionamento de moderação

---

## 15. Denúncia, moderação e mediação

Quando houver denúncia:
- será aberto um ticket
- o caso será investigado pela administração/moderação
- será criado um canal de comunicação até o encerramento do caso

Em negociações já aceitas, as partes poderão denunciar ou chamar moderador dentro do próprio chat.

O moderador entrará no mesmo chat, com acesso ao histórico anterior, conversará com ambas as partes e tomará uma decisão ou solução para o caso.

No MVP, não haverá status específico de disputa.

---

## 16. Aprovação administrativa de empresas

No MVP, toda aprovação será manual.

A empresa poderá ser aprovada quando apresentar:
- CNPJ ativo e confirmado
- endereço
- telefone
- email
- nome do representante
- dados cadastrais em conformidade e atualizados

A empresa poderá ser reprovada quando houver:
- dados insuficientes
- dados inexistentes
- dados incorretos
- dados incompatíveis com as informações enviadas para validação

Em caso de reprovação, a plataforma deverá indicar o que precisa ser ajustado para novo envio.

---

## 17. Avaliações e reputação

Avaliações e reputação entram no MVP.

A avaliação terá:
- nota
- comentário

A avaliação só poderá existir após a negociação concluída.

Todas as avaliações terão o mesmo peso.

A reputação pública será baseada em:
- média simples das notas
- volume total de avaliações

Comentários só poderão ficar públicos após aprovação de administração ou moderação.

A empresa avaliada poderá responder aos comentários.

---

## 18. Perfil público da empresa

Cada empresa terá uma página pública própria.

Essa página deverá exibir, entre outros elementos públicos permitidos:
- foto da empresa
- nome da empresa
- média das avaliações
- volume de avaliações
- comentários aprovados
- respostas da empresa
- verificações cadastrais visíveis
- anúncios ativos
- detalhes públicos relevantes, como data de criação, percentual de avaliações positivas e último acesso
- botão de denunciar

A reputação deverá poder ser filtrada por:
- positivas
- neutras
- negativas

---

## 19. Privacidade

Dados sensíveis não serão públicos.

Isso inclui, por exemplo:
- documentos enviados
- dados internos de validação
- informações sensíveis de cadastro
- dados financeiros
- contatos privados não destinados à exibição
- qualquer dado que comprometa segurança, privacidade ou operação interna

---

## 20. Pontos ainda em aberto

Permanecem em aberto:
- a lista exata de itens obrigatórios para declarar o MVP pronto
- o que ficará para a v1.1 ou versão posterior

---

## 21. Fora de escopo já definido

Não fazem parte da função da plataforma:
- processamento de pagamento
- intermediação financeira
- custódia
- garantia de liquidação
- livre escolha de qualquer local de troca fora das regras definidas
- status formal separado de disputa no MVP
