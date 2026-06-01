/**
 * URL pública para .webp en public/images/products/{carpeta}/.
 * Usa encodeURI (no encodeURIComponent): las comas del nombre deben quedar literales
 * para que el servidor estático de Vite/Astro resuelva el archivo en disco.
 */
export function productImagePath(folder: string, filename: string): string {
  return `/images/products/${folder}/${encodeURI(filename)}`;
}
