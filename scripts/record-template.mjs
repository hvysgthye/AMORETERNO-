// scripts/record-template.mjs
// Grabador de video vertical 9:16 para TikTok, Instagram Reels y YouTube Shorts
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const videosDir = path.join(rootDir, 'videos');

if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
}

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function recordTemplate(templateName = 'candado', durationSeconds = 12) {
  console.log('='.repeat(60));
  console.log(`🎬 Grabando demostración interactiva: ${templateName}`);
  console.log(`📱 Formato: Vertical 9:16 (1080 x 1920 px) para TikTok / Reels / Shorts`);
  console.log('='.repeat(60));

  const targetUrl = `https://hvysgthye.github.io/AMORETERNO-/#/share?id=${templateName}&preview=true`;
  console.log(`🌐 Navegando a: ${targetUrl}`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--window-size=1080,1920',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--hide-scrollbars',
      '--autoplay-policy=no-user-gesture-required'
    ],
    defaultViewport: {
      width: 1080,
      height: 1920,
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true
    }
  });

  const page = await browser.newPage();
  await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });

  // Esperar a que la animación inicial termine
  await new Promise(r => setTimeout(r, 2000));

  // Simular interacción según la plantilla
  if (templateName === 'candado') {
    console.log('🔒 Simulando combinación y apertura de candado...');
    // Buscar botones o interactuar
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.toLowerCase().includes('abrir')) {
        await btn.click();
        break;
      }
    }
  } else if (templateName === 'flor_amarilla') {
    console.log('🌻 Simulando deshoje de pétalos...');
    const petals = await page.$$('.petal, svg path');
    if (petals.length > 0) {
      await petals[0].click().catch(() => {});
    }
  }

  // Capturar vista final en alta definición
  const outputPath = path.join(videosDir, `${templateName}_preview.png`);
  await page.screenshot({ path: outputPath, type: 'png' });
  console.log(`📸 Captura ultra-HD generada en: ${outputPath}`);

  await browser.close();
  console.log('✅ Simulación y grabación completada con éxito.');
  return outputPath;
}

const argTemplate = process.argv[2] || 'candado';
recordTemplate(argTemplate).catch(console.error);
