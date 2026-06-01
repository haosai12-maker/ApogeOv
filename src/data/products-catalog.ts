export type ProductType = "tee" | "combo-short" | "combo-hoodie";

export type Product = {
  id: string;
  folder: string;
  type: ProductType;
  name: string;
  price: string;
  fabric: string;
  image: string;
  images: string[];
  description: string;
  details: string[];
  sizes: string[];
  colors: string[];
  colorLabels: string[];
};
