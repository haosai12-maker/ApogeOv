# Imágenes del sitio

Sube aquí las fotos que quieras usar en la landing. Astro las sirve tal cual desde la carpeta `public/`.

## Carpetas

| Carpeta | Uso |
|---------|-----|
| `hero/` | Imagen principal del banner |
| `categories/` | Las 3 cards de categorías (Tees, Hoodies, Buggys) |
| `products/` | Fotos de productos (Nuevos Drops + modal) |

## Cómo subir fotos

1. Copia tus archivos (`.jpg`, `.jpeg`, `.png`, `.webp`) en la carpeta que corresponda.
2. Usa nombres simples, sin espacios: `oversized-tee-essential.jpg`
3. En `src/data/landing.ts` cambia la URL por la ruta local.

## Cómo referenciarlas en el código

Siempre empieza con `/images/` (no escribas `public/`):

```ts
// Ejemplo en src/data/landing.ts
image: "/images/products/oversized-tee-essential.jpg"
```

```html
<!-- En un .astro -->
<img src="/images/hero/banner.jpg" alt="..." />
```

## Productos actuales (carpetas)

Cada producto vive en su propia carpeta:

- `products/producto1/` … `products/producto10/`
- El catálogo está en `src/data/products-catalog.ts`
- No renombres las carpetas; solo agrega o reemplaza fotos `.webp` dentro de cada una

## Hero y categorías

- `hero/banner.jpg` → campo `heroImage` en `landing.ts`
- `categories/oversized-tees.jpg`
- `categories/hoodies.jpg`
- `categories/buggys.jpg`

## Tamaño recomendado

- **Hero:** 1920×1080 px o similar (horizontal)
- **Productos / categorías:** 800×1000 px (vertical 4:5)

Formato preferido: **WebP** o **JPEG** optimizado (&lt; 500 KB por imagen si es posible).
