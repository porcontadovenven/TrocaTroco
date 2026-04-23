type SupabaseEnv = {
  url: string;
  anonKey: string;
  appUrl?: string;
};

type SupabaseAdminEnv = {
  url: string;
  serviceRoleKey: string;
};

function normalizarAppUrl(valor?: string) {
  return valor?.trim().replace(/\/$/, "") || undefined;
}

export function getSupabaseEnv(): SupabaseEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const appUrl = normalizarAppUrl(
    process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL,
  );

  const missing = [
    ["NEXT_PUBLIC_SUPABASE_URL", url],
    ["NEXT_PUBLIC_SUPABASE_ANON_KEY", anonKey],
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Variaveis de ambiente ausentes do Supabase: ${missing.join(", ")}.`,
    );
  }

  return {
    url: url as string,
    anonKey: anonKey as string,
    appUrl,
  };
}

export function getAppUrlObrigatoriaEmProducao() {
  const { appUrl } = getSupabaseEnv();

  if (appUrl) return appUrl;

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "APP_URL ou NEXT_PUBLIC_APP_URL deve estar definido em produção.",
    );
  }

  return undefined;
}

export function getSupabaseAdminEnv(): SupabaseAdminEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const missing = [
    ["NEXT_PUBLIC_SUPABASE_URL", url],
    ["SUPABASE_SERVICE_ROLE_KEY", serviceRoleKey],
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Variaveis de ambiente ausentes do Supabase Admin: ${missing.join(", ")}.`,
    );
  }

  return {
    url: url as string,
    serviceRoleKey: serviceRoleKey as string,
  };
}