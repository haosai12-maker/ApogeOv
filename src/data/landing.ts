import { loadProducts } from "./load-products";

export type { Product, ProductType } from "./products-catalog";

/** Productos con imágenes .webp leídas desde public/images/products/ */
export const products = loadProducts();

export const heroImage =
  "https://images.unsplash.com/photo-1649114383220-c4f0f0dbafbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHx1cmJhbiUyMHN0cmVldHdlYXIlMjBvdmVyc2l6ZWQlMjBjbG90aGluZyUyMG1lbiUyMGNpdHklMjBzdHJlZXR8ZW58MXx8fHwxNzgwMTY0NzY5fDA&ixlib=rb-4.1.0&q=80&w=1080";
