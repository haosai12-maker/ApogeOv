# AURA Streetwear — E-commerce Landing Page

Landing page de e-commerce (streetwear) con **Astro** (HTML estático) y **pnpm**.

Diseño original: [Figma — E-commerce Landing Page Design](https://www.figma.com/design/IxfLHJcvZM35xnD0TOnFXD/E-commerce-Landing-Page-Design).

## Requisitos

- [Node.js](https://nodejs.org/) 18.18+
- [pnpm](https://pnpm.io/) 9+

## Instalación

```bash
pnpm install
```

## Desarrollo

```bash
pnpm dev
```

Abre [http://localhost:4321](http://localhost:4321).

## Producción

```bash
pnpm build
pnpm preview
```

## Tipos / errores en el editor

El proyecto incluye `src/global.d.ts` (tipos JSX de Astro) y `@astrojs/ts-plugin`. Si ves errores de `className` en archivos `.astro`:

1. Instala la extensión **Astro** (`astro-build.astro-vscode`).
2. `Ctrl+Shift+P` → **TypeScript: Select Workspace Version** → **Use Workspace Version**.
3. `Ctrl+Shift+P` → **Developer: Reload Window**.
4. Confirma con `pnpm check` (debe mostrar **0 errors**).

## Imágenes propias

Sube tus fotos en **`public/images/`** (ver `public/images/README.md`):

- `public/images/hero/` — banner
- `public/images/categories/` — categorías
- `public/images/products/` — productos
- `public/images/lookbook/` — galería

En `src/data/landing.ts` usa rutas como `/images/products/mi-foto.jpg`.

## Estructura

- `public/images/` — Fotos estáticas que tú subes
- `src/pages/` — Rutas Astro
- `src/layouts/` — Layout HTML base
- `src/components/LandingPage.astro` — Composición de la landing
- `src/components/landing/` — Secciones (nav, hero, productos, etc.)
- `src/components/Icon.astro` — Iconos SVG
- `src/lib/landing-utils.ts` — Utilidades de clases/estilos
- `src/data/` — Datos de productos y lookbook
- `src/styles/` — Estilos globales (Tailwind v4)
- `default_shadcn_theme.css` — Variables de tema (colores, radius)
