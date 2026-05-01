import type { NextConfig } from "next";

const IS_DEVELOPMENT = process.env.NODE_ENV !== "production";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_HOST = SUPABASE_URL ? new URL(SUPABASE_URL).hostname : undefined;
const SUPABASE_ORIGIN = SUPABASE_URL ? new URL(SUPABASE_URL).origin : undefined;

const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "object-src 'none'",
  "frame-src 'none'",
  `script-src 'self' 'unsafe-inline'${IS_DEVELOPMENT ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  ["img-src 'self' data: blob:", SUPABASE_ORIGIN, "https://*.supabase.co"].filter(Boolean).join(" "),
  ["connect-src 'self'", SUPABASE_ORIGIN, SUPABASE_ORIGIN?.replace("https://", "wss://"), "https://*.supabase.co", "wss://*.supabase.co"].filter(Boolean).join(" "),
].join("; ");

const SECURITY_HEADERS = [
  // Previne clickjacking: impede que o site seja embutido em iframes
  { key: "X-Frame-Options", value: "DENY" },
  // Previne MIME-sniffing: o browser respeita o Content-Type declarado
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Controla informações de referência enviadas em requests cross-origin
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Desativa APIs sensíveis que a aplicação não usa
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  // Força HTTPS por 1 ano (HSTS)
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  // Restringe origens permitidas para scripts, conexões e frames
  { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: SUPABASE_HOST
      ? [
          {
            protocol: "https",
            hostname: SUPABASE_HOST,
          },
        ]
      : [],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: SECURITY_HEADERS,
      },
    ];
  },
};

export default nextConfig;
