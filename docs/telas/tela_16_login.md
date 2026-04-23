# Tela 15 — Login

## 1. Nome da tela
Login

## 2. Objetivo
Permitir que empresas já cadastradas acessem a plataforma e sejam direcionadas para a área correta conforme seu estado cadastral e perfil de acesso.

## 3. Acesso
Público

## 4. Origem de navegação
O usuário pode chegar nesta tela por:
- Home
- tentativa de acessar recurso que exige autenticação
- links públicos da plataforma
- fluxo de retorno de cadastro

## 5. Tipo de tela
Tela pública de autenticação.

## 6. Estrutura lógica da tela
A tela deve conter, em nível funcional:

- identificação da área de login
- campos de autenticação
- ação principal de entrar
- atalho para cadastro de empresa
- feedback de autenticação

## 7. Regras gerais da tela
- a tela deve autenticar empresas já cadastradas
- ela também deve servir como ponto de entrada para quem ainda não tem conta
- após login, o redirecionamento depende do estado da empresa:
  - em análise
  - aprovada
  - reprovada
- o usuário administrativo também pode entrar por aqui, se este for o fluxo adotado

## 8. O que precisa existir nesta tela

### Conteúdo mínimo
- título da tela
- campo de identificação de acesso
- campo de senha
- ação de **Entrar**
- link para **Cadastro de empresa**

### Conteúdo adicional recomendado
- mensagem curta para quem ainda não tem conta
- mensagem de erro de autenticação, quando necessário

## 9. Ações principais
- Entrar
- Ir para cadastro de empresa

## 10. Validações visíveis
- credenciais inválidas devem gerar erro claro
- acesso autenticado deve levar à área correta
- usuário sem autenticação não deve entrar em áreas privadas

## 11. Estados principais da tela

### Estado 1 — Preenchimento normal
O usuário vê:
- campos de autenticação
- botão de entrar
- link para cadastro

### Estado 2 — Erro de autenticação
O usuário vê:
- mensagem de credenciais inválidas ou falha de acesso

### Estado 3 — Login com sucesso
O usuário é redirecionado conforme o contexto:
- empresa em análise → **Status cadastral / aprovação**
- empresa aprovada → **Dashboard**
- empresa reprovada → **Status cadastral / aprovação**
- admin/moderação → **Painel administrativo**

## 12. Estados de interface
- preenchimento normal
- carregando autenticação
- erro no login
- sucesso com redirecionamento

## 13. Feedbacks visíveis
- mensagem clara em caso de credenciais inválidas
- mensagem de erro temporário, se a autenticação falhar por motivo técnico
- redirecionamento consistente após login com sucesso

## 14. Saídas / navegação de saída
A partir do Login, o usuário pode seguir para:
- **Status cadastral / aprovação**
- **Dashboard**
- **Painel administrativo**
- **Cadastro de empresa**

## 15. Regras de negócio refletidas na tela
- autenticação não libera automaticamente a operação
- a operação depende também do estado cadastral da empresa
- o login é um ponto de entrada tanto para empresa comum quanto para admin, se o fluxo do sistema for unificado

## 16. Observações
Este documento define a lógica funcional da tela.
Ele não fixa layout visual, estrutura estética, posicionamento final de blocos ou design de interface.
