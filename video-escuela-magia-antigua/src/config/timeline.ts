import data from './timeline.json';

export const timeline = data;
export const FPS = data.fps;
export const DURATION_FRAMES = Math.round(data.duration * data.fps);
export type SceneId = keyof typeof data.scenes;
export const sceneRange = (id: SceneId) => data.scenes[id] as [number, number];
export const ev = data.events;
export const sec = (s: number) => Math.round(s * FPS);
