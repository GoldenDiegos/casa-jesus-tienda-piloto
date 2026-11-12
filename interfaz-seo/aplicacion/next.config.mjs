const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
if (basePath && !/^\/(?:[A-Za-z0-9_-]+)(?:\/[A-Za-z0-9_-]+)*$/.test(basePath)) throw new Error('NEXT_PUBLIC_BASE_PATH debe ser una subruta como /tienda, sin barra final.');
const nextConfig = {
  basePath,
  env: {NEXT_PUBLIC_BASE_PATH: basePath},
  ...(process.env.CASA_JESUS_QA === '1' ? {distDir: '.next-qa'} : {}),
  ...(process.env.CASA_JESUS_STATIC === '1' ? {output: 'export', trailingSlash: true, turbopack: {root: process.env.CASA_JESUS_ROOT}} : {}),
};
export default nextConfig;
