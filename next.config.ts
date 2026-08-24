import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "mecaimportacoes.com.br" },
      { protocol: "https", hostname: "lustraomega.com.br" },
      { protocol: "https", hostname: "www.fabiosilvacontabilidade.com.br" },
      { protocol: "https", hostname: "vizsil-contabilidade.vercel.app" },
      { protocol: "https", hostname: "negossocios.store" },
      { protocol: "https", hostname: "cdn.jsdelivr.net" },
    ],
  },
};

export default nextConfig;
