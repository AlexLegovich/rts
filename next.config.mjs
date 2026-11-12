/** @type {import('next').NextConfig} */
const nextConfig = {
  // Можно собрать в отдельную папку (NEXT_DIST_DIR=...), не мешая запущенному dev-серверу.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    // Браузеры получат AVIF/WebP (легче JPEG), старые — JPEG.
    formats: ["image/avif", "image/webp"],
    // Разрешённые значения quality у <Image> (обязательно с Next.js 16).
    qualities: [75, 80],
  },
};

export default nextConfig;
