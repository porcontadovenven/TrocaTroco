import type { NextConfig } from "next";

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
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nqetigprgmkvoyxygqty.supabase.co",
      },
    ],
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
