import type {CamKey} from '../three/World';

/**
 * MOVIMIENTOS DE CÁMARA por escena (tiempo global en segundos).
 * pos = posición de cámara, look = punto al que mira, fov = apertura vertical.
 * Mundo: el grimorio está centrado en el origen (lomo a la izquierda,
 * cerradura a la derecha), las velas detrás (z negativa).
 */
export const shots: Record<string, CamKey[]> = {
  // El despertar: acercamiento lento a la llave sobre el grimorio cerrado
  s1: [
    {t: 0, pos: [0.35, 2.75, 6.4], look: [0, 1.45, 0], fov: 46},
    {t: 5.6, pos: [0.15, 2.05, 4.35], look: [-0.05, 1.12, -0.1], fov: 46},
  ],
  // La llave: vuela hasta la cerradura, gira, el broche cede y el libro se abre
  s2: [
    {t: 5.0, pos: [1.7, 2.3, 4.2], look: [0.4, 0.8, 0], fov: 44},
    {t: 6.8, pos: [2.55, 1.55, 4.3], look: [1.7, 0.3, 0], fov: 38},
    {t: 7.95, pos: [2.45, 1.45, 3.9], look: [1.65, 0.3, 0], fov: 38},
    {t: 9.65, pos: [0.25, 5.2, 4.6], look: [-0.95, 0.2, -0.4], fov: 46},
    {t: 10.7, pos: [0.15, 5.0, 4.2], look: [-1.0, 0.2, -0.5], fov: 46},
  ],
  // El conocimiento: vela que se enciende + hierbas
  s3a: [
    {t: 10.0, pos: [3.55, 1.0, 0.35], look: [2.5, 1.05, -2.4], fov: 40},
    {t: 13.5, pos: [3.15, 0.95, 0.05], look: [2.45, 1.0, -2.4], fov: 40},
  ],
  // tintero, pluma y pergaminos
  s3b: [
    {t: 13.1, pos: [-0.75, 1.6, 5.1], look: [-2.45, 0.55, 2.4], fov: 40},
    {t: 16.6, pos: [-1.2, 1.35, 4.6], look: [-2.5, 0.5, 2.35], fov: 40},
  ],
  // la pluma traza un sigilo en el grimorio
  s3c: [
    {t: 16.2, pos: [0.55, 3.0, 1.75], look: [0.0, 0.25, 0.05], fov: 44},
    {t: 19.9, pos: [0.4, 2.65, 1.45], look: [0.0, 0.25, 0.0], fov: 44},
  ],
  // Presentación: vista cenital que desciende girando
  s4: [
    {t: 19.3, pos: [-0.6, 8.2, 2.6], look: [-0.7, 0.2, -0.6], fov: 50},
    {t: 29.3, pos: [0.2, 6.6, 1.6], look: [-0.7, 0.2, -0.7], fov: 50},
  ],
  // Programa: las páginas pasan (capítulos)
  s5: [
    {t: 28.7, pos: [0.4, 2.9, 3.1], look: [-0.95, 0.3, -0.3], fov: 46},
    {t: 34.6, pos: [0.1, 2.55, 2.6], look: [-1.0, 0.3, -0.35], fov: 46},
  ],
  // Llamada a la acción: llave sobre el grimorio abierto, velas encendidas
  s6: [
    {t: 34.0, pos: [1.3, 3.6, 5.3], look: [-0.45, 0.7, -1.0], fov: 46},
    {t: 44.5, pos: [0.45, 2.5, 3.55], look: [-0.35, 0.65, -0.9], fov: 46},
  ],
};
