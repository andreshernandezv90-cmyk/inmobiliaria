/**
 * IDENTIDAD VISUAL — colores, tipografías y logotipos.
 * Para usar logotipos oficiales, coloca los archivos en /public/brand/ y
 * escribe aquí su nombre (p. ej. 'brand/llave-logo.png'). Si es null se usa el
 * logotipo tipográfico provisional generado en código.
 */
export const colors = {
  black: '#070504',
  ink: '#120c08',
  gold: '#c9a45c',
  goldLight: '#ead9a6',
  goldDeep: '#8a6a32',
  ivory: '#f3ead6',
  parchment: '#d9c39a',
  brown: '#5a3d24',
  flame: '#ffb35c',
} as const;

export const fonts = {
  display: "'Cinzel', 'Cormorant Garamond', serif",
  serif: "'Cormorant Garamond', 'Cinzel', serif",
} as const;

export const logos = {
  /** Logotipo de La Llave de la Bruja (PNG/SVG con fondo transparente). */
  llave: null as string | null,
  /** Logotipo de El Grimorio de la Bruja. */
  grimorio: null as string | null,
};
