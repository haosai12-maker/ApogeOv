import { loadProducts } from "./load-products";

export type { Product, ProductType } from "./products-catalog";

/** Productos con imágenes .webp leídas desde public/images/products/ */
export const products = loadProducts();

export const heroImage = "/images/hero.webp";
