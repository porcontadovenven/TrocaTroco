## TrocaTroco

Aplicação MVP construída com Next.js, TypeScript, Tailwind CSS e Supabase.

## Scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
```

## Desenvolvimento

Inicie o servidor com `npm run dev` e acesse `http://localhost:3000`.

## Ambiente

Configure o `.env` a partir do `.env.example`.

Para recuperação de senha, defina `NEXT_PUBLIC_APP_URL` com a URL pública da aplicação.

Se o projeto usar recuperação de senha por email, configure o SMTP no Supabase Auth. O `.env.example` já deixa os campos de referência para uso com Resend.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase

## Banco de dados

As migrations ficam em `supabase/migrations`.
