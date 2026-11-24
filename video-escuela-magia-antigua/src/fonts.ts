// Tipografías con licencia SIL Open Font License (uso comercial permitido).
import '@fontsource/cinzel/500.css';
import '@fontsource/cinzel/600.css';
import '@fontsource/cinzel/700.css';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/cormorant-garamond/400-italic.css';
import '@fontsource/cormorant-garamond/500-italic.css';
import '@fontsource/cormorant-garamond/600-italic.css';
import {continueRender, delayRender} from 'remotion';

const SAMPLE = 'ÁÉÍÓÚáéíóúñÑ¿?';
const faces = [
  '500 64px Cinzel',
  '600 64px Cinzel',
  '700 64px Cinzel',
  '400 64px "Cormorant Garamond"',
  '500 64px "Cormorant Garamond"',
  '600 64px "Cormorant Garamond"',
  'italic 400 64px "Cormorant Garamond"',
  'italic 500 64px "Cormorant Garamond"',
  'italic 600 64px "Cormorant Garamond"',
];

const handle = delayRender('Cargando tipografías');
Promise.all(faces.map((f) => document.fonts.load(f, SAMPLE + 'Escuela')))
  .then(() => continueRender(handle))
  .catch((e) => {
    console.error(e);
    continueRender(handle);
  });
