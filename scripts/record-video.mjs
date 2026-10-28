// scripts/record-video.mjs
// Grabador de video vertical 9:16 ultra-HD para TikTok, Instagram Reels y YouTube Shorts
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const videosDir = path.join(rootDir, 'videos');

if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
}

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const FFMPEG_PATH = ffmpegInstaller.path;

const TEMPLATES = {
  candado: {
    name: 'Candado del Amor 3D',
    url: 'https://hvysgthye.github.io/AMORETERNO-/#/share?id=candado&preview=true',
    durationSec: 10,
    interact: async (page) => {
      await new Promise(r => setTimeout(r, 2000));
      // Buscar botón de abrir
      const buttons = await page.$$('button');
      for (const btn of buttons) {
        const text = await page.evaluate(el => el.textContent, btn);
        if (text && text.toLowerCase().includes('abrir')) {
          console.log('🔓 Abriendo candado interactivo con combinación secreta...');
          await btn.click();
          break;
        }
      }
    },
    caption: `Le programé una página web con un candado que solo abre con la fecha en que nos conocimos... 🥺❤️🔒

Sorprende a tu persona favorita con una dedicatoria que guardará para siempre.
✨ Personaliza la tuya gratis en: https://hvysgthye.github.io/AMORETERNO-/

#amor #parejas #novios #candadodelamor #regalosoriginales #amoreterno #dedicatoria #viral #sanvalentin #aniversario #fyp #parati`
  },
  'flor-amarilla': {
    name: 'Girasol Eterno con Carta Secreta',
    url: 'https://hvysgthye.github.io/AMORETERNO-/#/share?id=flor-amarilla&preview=true',
    durationSec: 10,
    interact: async (page) => {
      await new Promise(r => setTimeout(r, 2000));
      console.log('🌻 Deshojando pétalos del girasol...');
      const petals = await page.$$('.petal, svg path, [class*="petal"]');
      if (petals.length > 0) {
        for (let i = 0; i < Math.min(3, petals.length); i++) {
          await petals[i].click().catch(() => {});
          await new Promise(r => setTimeout(r, 700));
        }
      }
    },
    caption: `Le di un girasol que nunca se marchita y que esconde una carta de amor entre sus pétalos... 🌻💛✨

Un detalle inolvidable para tu persona especial.
🌼 Crea el tuyo gratis en: https://hvysgthye.github.io/AMORETERNO-/

#floresamarillas #girasol #amor #novios #parejas #regalodeamor #amoreterno #dedicatorias #fyp #parati`
  },
  arbol: {
    name: 'Árbol del Amor con Contador',
    url: 'https://hvysgthye.github.io/AMORETERNO-/#/share?id=arbol&preview=true',
    durationSec: 10,
    interact: async (page) => {
      await new Promise(r => setTimeout(r, 2000));
      console.log('🌳 Regando el árbol y activando floración...');
      const buttons = await page.$$('button');
      if (buttons.length > 0) {
        await buttons[0].click().catch(() => {});
      }
    },
    caption: `Un árbol que florece con cada día juntos y cuenta los segundos exactos a su lado... 🌳💚⏳

Un regalo perfecto para celebrar su aniversario.
🌿 Crea el tuyo gratis en: https://hvysgthye.github.io/AMORETERNO-/

#aniversario #tiempojuntos #amor #parejas #novios #arboldelamor #amoreterno #regalosoriginales #fyp #parati`
  },
  propose: {
    name: 'Propuesta de Matrimonio 3D',
    url: 'https://hvysgthye.github.io/AMORETERNO-/#/share?id=propose&preview=true',
    durationSec: 10,
    interact: async (page) => {
      await new Promise(r => setTimeout(r, 2000));
      console.log('💍 Abriendo cajita de terciopelo con anillo...');
      const buttons = await page.$$('button, [class*="box"]');
      if (buttons.length > 0) {
        await buttons[0].click().catch(() => {});
      }
    },
    caption: `¿Quieres casarte conmigo? 💍 El botón de "No" se escapa de tus dedos hasta que dices que Sí ❤️✨

La propuesta más linda e interactiva.
💎 Crea la tuya en: https://hvysgthye.github.io/AMORETERNO-/

#propuesta #matrimonio #anillodecompromiso #amor #novios #parejas #bodas #amoreterno #fyp #parati`
  }
};

async function recordVideo(templateKey = 'candado') {
  const normalizedKey = templateKey.replace(/_/g, '-');
  const config = TEMPLATES[normalizedKey] || TEMPLATES[templateKey] || TEMPLATES.candado;
  const videoFileName = `${normalizedKey}_video_916.mp4`;
  const outputVideoPath = path.join(videosDir, videoFileName);
  const captionFilePath = path.join(videosDir, `${templateKey}_caption.txt`);

  console.log('='.repeat(65));
  console.log(`🎬 GRABANDO VIDEO VERTICAL 9:16`);
  console.log(`📌 Plantilla: ${config.name}`);
  console.log(`📱 Formato: 1080 x 1920 (TikTok, Reels, Shorts)`);
  console.log(`📁 Video: ${outputVideoPath}`);
  console.log('='.repeat(65));

  // Guardar archivo de texto con el caption y hashtags
  fs.writeFileSync(captionFilePath, config.caption, 'utf-8');
  console.log(`📝 Texto y hashtags listos en: ${captionFilePath}`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--window-size=1080,1920',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--hide-scrollbars',
      '--disable-gpu',
      '--run-all-compositor-stages-before-draw',
      '--disable-background-timer-throttling'
    ],
    defaultViewport: {
      width: 1080,
      height: 1920,
      deviceScaleFactor: 1,
      isMobile: true,
      hasTouch: true
    }
  });

  const page = await browser.newPage();
  console.log(`🌐 Abriendo plantilla: ${config.url}`);
  await page.goto(config.url, { waitUntil: 'networkidle2', timeout: 35000 });

  // Forzar refresco continuo del compositor de Chrome para captura fluida a 24-30 fps
  await page.evaluate(() => {
    const marker = document.createElement('div');
    marker.style.position = 'fixed';
    marker.style.bottom = '0';
    marker.style.right = '0';
    marker.style.width = '1px';
    marker.style.height = '1px';
    marker.style.opacity = '0.01';
    marker.style.pointerEvents = 'none';
    marker.style.zIndex = '99999';
    document.body.appendChild(marker);
    function tick(time) {
      marker.style.transform = `translateZ(0) rotate(${time % 360}deg)`;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });

  const recorder = new PuppeteerScreenRecorder(page, {
    fps: 24,
    ffmpeg_Path: FFMPEG_PATH,
    videoFrame: {
      width: 1080,
      height: 1920
    },
    aspectRatio: '9:16'
  });

  console.log('🎥 Grabando pantalla en alta resolución vertical...');
  await recorder.start(outputVideoPath);

  // Iniciar interacción simulada
  if (config.interact) {
    await config.interact(page);
  }

  // Mantener la grabación activa por el tiempo configurado
  const waitTime = (config.durationSec || 10) * 1000;
  await new Promise(r => setTimeout(r, waitTime));

  console.log('⏹️ Finalizando grabación y codificando MP4...');
  await recorder.stop();
  await browser.close();

  if (fs.existsSync(outputVideoPath)) {
    const stats = fs.statSync(outputVideoPath);
    const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);
    console.log('='.repeat(65));
    console.log(`🎉 ¡VIDEO GENERADO EXITOSAMENTE!`);
    console.log(`📹 Archivo: ${outputVideoPath}`);
    console.log(`📦 Peso: ${sizeMb} MB`);
    console.log(`📝 Texto listo para copiar: ${captionFilePath}`);
    console.log('='.repeat(65));
    return { videoPath: outputVideoPath, captionPath: captionFilePath, sizeMb };
  } else {
    throw new Error('No se generó el archivo de video.');
  }
}

const templateArg = process.argv[2] || 'candado';
recordVideo(templateArg).catch(console.error);
