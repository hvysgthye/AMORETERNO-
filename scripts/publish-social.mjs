// scripts/publish-social.mjs
// Motor de publicación automática a YouTube Shorts, Instagram Reels y TikTok
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Cargar variables de entorno desde .env si existe
const envPath = path.join(rootDir, '.env');
const env = {};
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...values] = trimmed.split('=');
      if (key && values.length) {
        env[key.trim()] = values.join('=').trim().replace(/^["']|["']$/g, '');
      }
    }
  });
}

const WEBHOOK_URL = process.env.SOCIAL_WEBHOOK_URL || env.SOCIAL_WEBHOOK_URL;
const AYRSHARE_API_KEY = process.env.AYRSHARE_API_KEY || env.AYRSHARE_API_KEY;

// Contenido viral predefinido por plantilla
const VIRAL_TEMPLATES = {
  candado: {
    title: 'Candado del Amor 3D 🔒❤️ | Dedicatoria Interactiva',
    caption: 'Le programé una página con un candado que solo abre con la fecha en que nos conocimos... 🥺✨ Crea la tuya gratis en https://hvysgthye.github.io/AMORETERNO-/ #amor #novios #parejas #candadodelamor #regalosoriginales #amoreterno #dedicatoria',
    tags: ['amor', 'parejas', 'novios', 'candado', 'regalo', 'amoreterno']
  },
  flor_amarilla: {
    title: 'Girasol Interactivo con Carta Oculta 🌻💛',
    caption: 'Deshoja los pétalos para descubrir una sorpresa de amor única... 🌻✨ Haz tu girasol eterno en https://hvysgthye.github.io/AMORETERNO-/ #floresamarillas #girasol #amor #novios #regalo',
    tags: ['floresamarillas', 'girasol', 'amor', 'novios']
  },
  arbol: {
    title: 'Árbol del Amor con Contador en Tiempo Real 🌳⏳',
    caption: 'Un árbol que florece con cada día juntos y cuenta los segundos a su lado 🌳💚 Pruébalo en https://hvysgthye.github.io/AMORETERNO-/ #aniversario #tiempojuntos #amor #parejas',
    tags: ['aniversario', 'arboldelamor', 'parejas']
  },
  propose: {
    title: 'Propuesta de Matrimonio 3D en Cajita de Terciopelo 💍✨',
    caption: 'El botón de "No" se escapa de tus dedos hasta que dices que Sí 💍❤️ Sorprende a tu persona especial en https://hvysgthye.github.io/AMORETERNO-/ #propuesta #matrimonio #novios #anillodecompromiso',
    tags: ['propuesta', 'matrimonio', 'anillo']
  },
  galaxy: {
    title: 'Nuestra Galaxia de Estrellas 3D 🌌💫',
    caption: 'Un universo entero con frases y recuerdos orbitando en el espacio 🪐💖 Crea tu propia galaxia en https://hvysgthye.github.io/AMORETERNO-/ #galaxia #estrellas #universo #amor',
    tags: ['galaxia', 'estrellas', 'amor']
  }
};

async function publishVideo({ template = 'candado', customCaption, videoPath } = {}) {
  const meta = VIRAL_TEMPLATES[template] || VIRAL_TEMPLATES.candado;
  const caption = customCaption || meta.caption;

  console.log('='.repeat(60));
  console.log('🚀 AMORETERNO - Social Auto-Publisher');
  console.log('='.repeat(60));
  console.log(`📌 Plantilla: ${template}`);
  console.log(`📝 Título: ${meta.title}`);
  console.log(`💬 Caption:\n${caption}\n`);

  if (!WEBHOOK_URL && !AYRSHARE_API_KEY) {
    console.log('⚠️ [MODO DEMO / CONFIGURACIÓN]');
    console.log('No se detectó SOCIAL_WEBHOOK_URL ni AYRSHARE_API_KEY en tu archivo .env.');
    console.log('Para conectar tus cuentas de YouTube, Instagram y TikTok:');
    console.log('1. Crea tu Webhook en Make.com (o API Key en Ayrshare).');
    console.log('2. Agrega la siguiente línea a tu archivo .env:');
    console.log('   SOCIAL_WEBHOOK_URL=https://hook.make.com/tu_enlace_aqui');
    console.log('3. Vuelve a ejecutar este comando para publicar en vivo.');
    console.log('='.repeat(60));
    return { status: 'mock_ready', meta };
  }

  // Si se utiliza Make.com Webhook
  if (WEBHOOK_URL) {
    console.log(`📡 Enviando a Make.com Webhook: ${WEBHOOK_URL.slice(0, 30)}...`);
    try {
      const payload = {
        platformTargets: ['youtube_shorts', 'instagram_reels', 'tiktok'],
        template,
        title: meta.title,
        caption,
        tags: meta.tags,
        siteUrl: 'https://hvysgthye.github.io/AMORETERNO-/',
        timestamp: new Date().toISOString()
      };

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        console.log('✅ ¡Publicación despachada con éxito al conector social!');
        return { status: 'published', provider: 'make_webhook', payload };
      } else {
        console.error(`❌ Error al enviar al webhook: HTTP ${response.status} ${response.statusText}`);
        return { status: 'error', code: response.status };
      }
    } catch (err) {
      console.error('❌ Excepción al conectar con el Webhook:', err.message);
      return { status: 'error', error: err.message };
    }
  }

  // Si se utiliza Ayrshare API
  if (AYRSHARE_API_KEY) {
    console.log('📡 Publicando a través de Ayrshare API...');
    try {
      const response = await fetch('https://app.ayrshare.com/api/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AYRSHARE_API_KEY}`
        },
        body: JSON.stringify({
          post: caption,
          platforms: ['youtube', 'instagram', 'tiktok']
        })
      });

      const result = await response.json();
      console.log('✅ Respuesta de Ayrshare:', result);
      return { status: 'published', provider: 'ayrshare', result };
    } catch (err) {
      console.error('❌ Excepción al conectar con Ayrshare:', err.message);
      return { status: 'error', error: err.message };
    }
  }
}

// Permitir ejecución desde CLI: node scripts/publish-social.mjs [template]
const argTemplate = process.argv[2] || 'candado';
publishVideo({ template: argTemplate });
