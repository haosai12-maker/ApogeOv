/// <reference types="astro/client" />
/// <reference types="astro/astro-jsx" />

/**
 * Usa los tipos HTML de Astro en lugar de React para plantillas .astro
 * (corrige errores "class" vs "className" en el IDE).
 */
declare global {
  namespace JSX {
    type Element = astroHTML.JSX.Element;
    type ElementChildrenAttribute = astroHTML.JSX.ElementChildrenAttribute;
    interface IntrinsicAttributes extends astroHTML.JSX.IntrinsicAttributes {}
    interface IntrinsicElements extends astroHTML.JSX.IntrinsicElements {}
  }
}

export {};
