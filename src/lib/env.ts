type SupabaseEnv = {
  url: string;
  anonKey: string;
  appUrl?: string;
};

export function getSupabaseEnv(): SupabaseEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || process.env.APP_URL?.trim() || undefined;

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