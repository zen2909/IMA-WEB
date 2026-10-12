import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Halaman publik membaca data yang bisa berubah kapan saja lewat panel admin,
  // dan seluruh /admin bergantung pada cookies(). Prerender di sini hanya
  // berisiko menyajikan data basi, jadi semua dirender saat request.
  cacheComponents: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
