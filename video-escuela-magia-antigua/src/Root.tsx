import {Composition} from 'remotion';
import './fonts';
import {Main} from './Main';
import {DURATION_FRAMES, FPS} from './config/timeline';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="EscuelaMagiaAntigua"
    component={Main}
    durationInFrames={DURATION_FRAMES}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
