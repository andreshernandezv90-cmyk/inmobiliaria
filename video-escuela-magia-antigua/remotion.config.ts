import {Config} from '@remotion/cli/config';

// Navegador preinstalado (sin descarga). Cambia la ruta si renderizas en otra máquina
// o elimina la línea para que Remotion use su propio Chrome Headless Shell.
const localShell =
  '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
import fs from 'node:fs';
if (fs.existsSync(localShell)) {
  Config.setBrowserExecutable(localShell);
}

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
// WebGL por software (SwiftShader) para escenas Three.js sin GPU.
Config.setChromiumOpenGlRenderer('swangle');
Config.setConcurrency(4);
Config.setCodec('h264');
Config.setCrf(16);
Config.setPixelFormat('yuv420p');
Config.setAudioCodec('aac');
Config.setAudioBitrate('320k');
