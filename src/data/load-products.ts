import fs from "node:fs";
import path from "node:path";
import { productImagePath } from "../lib/images";
import { productDefinitions } from "./product-definitions";
import type { Product, ProductType } from "./products-catalog";

const PRODUCTS_ROOT = path.join(process.cwd(), "public", "images", "products");

const teeDetails = [
  "Tela burda premium",
  "Alto gramaje",
  "Más resistente que algodón estándar",
  "Garantía por defectos de fábrica",
];

const comboShortDetails = [
  "Camiseta + pantaloneta oversized",
  "Tela burda de alto gramaje",
  "Corte amplio y moderno",
  "Envío 2-4 días hábiles",
];

const comboHoodieDetails = [
  "Camiseta en tela burda + sudadera en algodón perchado",
  "Corte oversized para estilo relajado",
  "Durabilidad excepcional y suavidad",
  "Perfecto para cualquier ocasión",
];

function detailsFor(type: ProductType): string[] {
  if (type === "tee") return teeDetails;
  if (type === "combo-short") return comboShortDetails;
  return comboHoodieDetails;
}

/** Lee los .webp reales de cada carpeta producto{N} */
function readWebpImages(folder: string): string[] {
  const dir = path.join(PRODUCTS_ROOT, folder);
  if (!fs.existsSync(dir)) {
    console.warn(`[products] Carpeta no encontrada: ${dir}`);
    return [];
  }

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".webp"))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "es"))
    .map((filename) => productImagePath(folder, filename));
}

export function loadProducts(): Product[] {
  return productDefinitions.map((def) => {
    const folder = `producto${def.num}`;
    const images = readWebpImages(folder);

    return {
      id: `producto-${def.num}`,
      folder,
      type: def.type,
      name: def.name,
      price: def.price,
      fabric: def.fabric,
      image: images[0] ?? "",
      images,
      description: def.description,
      details: detailsFor(def.type),
      sizes: ["S", "M", "L", "XL"],
      colors: [],
      colorLabels: [],
    };
  });
}
