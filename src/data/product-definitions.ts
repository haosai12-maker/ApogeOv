import type { ProductType } from "./products-catalog";

export type ProductDefinition = {
  num: number;
  type: ProductType;
  name: string;
  price: string;
  fabric: string;
  description: string;
};

const teeDescription = () =>
  `Tela burda premium de alto gramaje. Más resistente que el algodón estándar. Amplio rango de tallas para el ajuste perfecto. Entrega 2-4 días hábiles. Cambios por defectos de fábrica.`;

const comboShortDescription = () =>
  `Conjunto camisa + pantaloneta oversized en tela burda de alto gramaje. Más resistente que el algodón estándar. Amplio rango de tallas para el ajuste perfecto. Estilo relajado y moderno para cualquier ocasión. Entrega 2-4 días hábiles.`;

const comboHoodieDescription = () =>
  `Camiseta en tela burda de alto gramaje + sudadera en algodón perchado. Durabilidad excepcional sin sacrificar suavidad. Corte oversized para un estilo relajado y moderno. Perfecto para cualquier ocasión. Alta calidad y confort en cada uso. Entrega 2-4 días hábiles.`;

export const productDefinitions: ProductDefinition[] = [
  { num: 1, type: "tee", name: "Camiseta Oversize", price: "75.000", fabric: "Solo camiseta", description: teeDescription() },
  { num: 2, type: "tee", name: "Camiseta Oversize", price: "75.000", fabric: "Solo camiseta", description: teeDescription() },
  { num: 7, type: "tee", name: "Camiseta Oversize", price: "75.000", fabric: "Solo camiseta", description: teeDescription() },
  { num: 9, type: "tee", name: "Camiseta Oversize", price: "75.000", fabric: "Solo camiseta", description: teeDescription() },
  { num: 3, type: "combo-short", name: "Combo Camiseta + Pantaloneta", price: "115.000", fabric: "Combo oversize", description: comboShortDescription() },
  { num: 4, type: "combo-short", name: "Combo Camiseta + Pantaloneta", price: "115.000", fabric: "Combo oversize", description: comboShortDescription() },
  { num: 5, type: "combo-short", name: "Combo Camiseta + Pantaloneta", price: "115.000", fabric: "Combo oversize", description: comboShortDescription() },
  { num: 6, type: "combo-short", name: "Combo Camiseta + Pantaloneta", price: "115.000", fabric: "Combo oversize", description: comboShortDescription() },
  { num: 8, type: "combo-hoodie", name: "Combo Camiseta + Sudadera", price: "125.000", fabric: "Combo oversize", description: comboHoodieDescription() },
  { num: 10, type: "combo-hoodie", name: "Combo Camiseta + Sudadera", price: "125.000", fabric: "Combo oversize", description: comboHoodieDescription() },
];
