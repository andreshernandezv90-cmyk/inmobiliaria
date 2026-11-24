/**
 * TEXTOS EN PANTALLA — edítalos aquí.
 * Los tiempos de aparición están en src/config/timeline.json y en cada escena.
 */
export const content = {
  s1: {line: 'Hay conocimientos que esperan ser descubiertos'},
  s2: {line: 'La Llave de la Bruja vuelve a abrir sus puertas'},
  s3: {
    lines: [
      'Cada símbolo tiene una historia',
      'Cada ritual tiene un significado',
      'Cada intención tiene un propósito',
    ],
  },
  s4: {
    eyebrow: 'La Llave de la Bruja presenta',
    titleTop: 'Escuela de',
    titleBottom: 'Magia Antigua',
    body: 'Conoce las raíces de la magia, aprende sobre símbolos y rituales y comienza a escribir tu propio grimorio.',
  },
  s5: {
    modules: {number: '3', label: 'Módulos'},
    weeks: {number: '12', label: 'Semanas'},
  },
  s6: {
    main: 'Tu siguiente capítulo comienza aquí',
    secondary: '¿Quieres conocer el temario y los detalles?',
    ctaPrefix: 'Escríbenos',
    ctaWord: 'LLAVE',
  },
  brand: {
    name: 'La Llave de la Bruja',
    school: 'Escuela de Magia Antigua',
    parent: 'Una marca de El Grimorio de la Bruja',
  },
} as const;
