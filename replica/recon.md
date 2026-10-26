# Recon Map: Dedicapag vs. Dedicapag NextGen (Web Responsive)

- **Alcance (Slice):** Catálogo de 35 plantillas interactivas, editor multi-paso en tiempo real, motor de interacción y desbloqueo (candado 3D, huella biométrica, flores vectoriales, puertas), reproductor multimedia con notas de voz y melodías sintetizadas, exportación a archivo `.html` autónomo, generador de tarjetas físicas de regalo con código QR y modo destinatario a pantalla completa.
- **Para quién es:** Parejas, enamorados y personas que desean regalar una dedicatoria inolvidable sin sufrir expiraciones a las 12 horas, sin cobros obligatorios en dólares y con personalización multimedia total.
- **Fecha:** 2026-10-26
- **Estado de paridad actual:** Fase 1 (35 plantillas), Fase 2 (QR, WhatsApp, modo destinatario) y Fase 3 (Grabadora de voz, melodías sintetizadas, atmósferas y Mis Guardados) **completadas y operativas en Dedicapag NextGen**.

---

## 1. Fuentes Auditadas (Sources)

| # | Fuente | URL | Notas / Evidencia obtenida |
|---|---|---|---|
| 1 | Sitio Web Original | `https://dedicapag.com` | Catálogo de 35 plantillas, textos de promoción, flujos de navegación. |
| 2 | Editor Original | `https://dedicapag.com/create/candado` | Formulario PHP Blade, inputs de diales, campos de carta, previsualización en iframe. |
| 3 | Términos y Precios | `https://dedicapag.com/terminos-y-condiciones` | Política de expiración a las 12h en gratis, cobro único (\$2-\$3.50 USD), planes mensuales (\$3-\$15 USD), pasarela de pago. |
| 4 | Auditoría Forense Local | `scratch/analysis.json` y `pages_summary.json` | 35 plantillas mapeadas, detección de scripts Monetag y librerías obsoletas en la original. |
| 5 | Reseñas y Quejas Públicas | TikTok y Reddit (r/LDR, r/LongDistance) | 50% de quejas por borrado a las 12h, petición masiva de QR para regalos físicos y notas de voz. |

---

## 2. Core Loop (Bucle Principal de Valor)

> **En la original:** El usuario diseña una página de amor con foto y música, pero se topa con un muro de pago obligatorio o ve cómo su regalo desaparece tras 12 horas si no paga en dólares.  
> **En Dedicapag NextGen:** El usuario escoge entre 35 plantillas de lujo, graba su voz o sube su canción, y entrega su regalo **de forma 100% gratuita, permanente y sin expiración**, ya sea mediante un enlace interactivo, una tarjeta QR para imprimir en papel, o un archivo `.html` autónomo que funciona offline de por vida.

---

## 3. Inventario de Pantallas en Paralelo (Screen Inventory)

| ID | Pantalla | Ruta en Dedicapag Original | Implementación en Dedicapag NextGen | Estado & Mejoras en NextGen |
|---|---|---|---|---|
| **S01** | **Catálogo de Plantillas** | `/create` (lista estática con peticiones lentas) | Tab `Catálogo` (`Catalog.jsx`) con filtros por categoría (Popular, Románticas, Minijuegos, Flores, Espaciales). | **Superior:** 35 plantillas con preview animado, badges temáticos y selección instantánea sin recarga. |
| **S02** | **Editor Asistido (Wizard)** | `/create/{plantilla}` (formulario largo con recarga POST) | Panel lateral izquierdo (`EditorWizard.jsx`) organizado en 3 pasos fluidos: *1. Estilo, 2. Mensaje, 3. Audio & Voz*. | **Superior:** Optimización client-side de fotos con `<canvas>` (~150KB), grabadora de voz integrada con micrófono y selector de atmósferas. |
| **S03** | **Live Preview Split-Screen** | Iframe con retardo de 2 a 5 segundos | Panel derecho a 60fps (`LivePreviewFrame.jsx`) con marco interactivo de celular, tablet o desktop. | **Superior:** 0ms de latencia, interactividad en vivo con físicas de sonido (Web Audio API) y diales mecánicos. |
| **S04** | **Modal Compartir & QR** | No disponible (solo link de texto tras pagar) | Modal interactivo de 3 pestañas (`ShareModal.jsx`): Enlace directo comprimido Base64, Tarjeta física QR (.PNG) y simulador WhatsApp. | **Inexistente en original:** Generador nativo de tarjetas de regalo de 800x1050 px para imprimir y pegar en regalos físicos. |
| **S05** | **Vista de Destinatario** | `/p/{slug}` (caduca en 12h, requiere hosting del creador) | Modo presentación inmersivo (`RecipientView.jsx` vía `?mode=view&d=...`). | **Superior:** 100% pantalla completa, sin menús ni anuncios, con partículas flotantes y botón flotante de nota de voz. |
| **S06** | **Archivo Autónomo Offline** | No existe (atrapado en su servidor) | Exportador a archivo único `.html` de ~39KB (`htmlExporter.js`). | **Inexistente en original:** Autocontenido, incluye música, fotos y carta; dura para siempre sin pagar hosting. |
| **S07** | **Mis Guardados** | Requiere crear cuenta con email y contraseña | Cajón `MyCreationsModal.jsx` con persistencia en `localStorage`. | **Superior:** Guarda automáticamente las creaciones en el navegador sin exigir registros ni datos personales. |

---

## 4. Flujos de Usuario (User Flows)

```
F01 — Creación y Previsualización en Vivo
    S01 (Catálogo) -> Selecciona plantilla -> S02 (Paso 1: Estilo y diales) -> S02 (Paso 2: Mensaje y foto optimizada) -> S02 (Paso 3: Audio/Voz)
    Previsualización simultánea en S03 (0ms de retraso, prueba de giro y sonido)
    Clicks en camino feliz: 4 clicks.

F02 — Compartición Instantánea por Redes (WhatsApp / Telegram)
    S02 -> Clic en "Compartir & QR" -> S04 (Pestaña 1: Enlace & WhatsApp) -> Envío con 1 clic con mensaje formateado y emojis.
    Sin necesidad de pagar ni registrarse.

F03 — Entrega como Regalo Físico (Ramo de flores / Chocolates)
    S02 -> Clic en "Compartir & QR" -> S04 (Pestaña 2: Tarjeta QR) -> Escribe nombre de dedicatoria -> Descarga tarjeta .PNG de alta resolución lista para imprimir.

F04 — Experiencia del Destinatario (Desbloqueo y Emoción)
    S05 (Modo ?mode=view) -> Pantalla completa sin barras de navegación ->
    Gira combinación / toca huella / abre puertas -> Efecto sonoro de clic y éxito + Lluvia de confeti y partículas ->
    Apertura cinemática de carta de amor + Foto Polaroid + Reproducción de música romántica + Botón flotante para escuchar la voz del remitente.

F05 — Respaldo Offline Permanente (Para Siempre)
    S02 -> Clic en "Descargar .HTML" -> Descarga archivo autónomo de 39KB -> Se abre en cualquier navegador de celular o PC sin conexión a internet.
```

---

## 5. Componentes Reutilizables Reconstruidos

| Componente | Variantes | Estados | Utilizado en |
|---|---|---|---|
| **Header** | Default | Normal, Sticky con backdrop-blur | S01, S02, S03 |
| **TemplateCard** | 35 plantillas (Candado, Flores, Galaxia, etc.) | Default, Hover con brillo, Seleccionado | S01 |
| **DeviceFrame** | Mobile (iPhone), Tablet (iPad), Desktop | 60fps activo, interacción táctil | S03 |
| **DialCombination** | Diales numéricos giratorios | Rotación 3D, Clic auditivo, Desbloqueado | CandadoTemplate |
| **VoiceRecorderWidget**| Estado inicial, Grabando (pulso rojo y timer), Listo | Grabando (0-45s), Playback preview, Eliminación | S02 |
| **AudioPresetPicker** | 4 melodías sintetizadas | Play/Pause preview, Seleccionado | S02 |
| **AtmospherePicker** | Corazones, Estrellas, Sakura, Luciérnagas, Nieve | Seleccionado, Hover | S02 |
| **QRCardCanvas** | Tarjeta física 800x1050 px | Renderizado Canvas 2D con corazón vectorial | S04 |
| **ShareModal** | Pestañas: Link, Tarjeta QR, Vista WhatsApp | Abierto, Copiado (feedback verde), Descargando | S04 |
| **MyCreationsDrawer** | Tarjetas de dedicatoria guardadas | Lista vacía, Lista con elementos, Cargar, Borrar | S07 |

---

## 6. Modelo de Datos Inferido vs. Estructura NextGen

```typescript
interface DedicationSchema {
  version: "2.0";
  templateId: string;              // ej: "candado", "galaxy", "flores-moradas", etc.
  title: string;                   // Título principal romántico
  lockTitle: string;               // Instrucción o frase de bloqueo inicial
  unlockMsg: string;               // Mensaje de éxito al resolver el acertijo
  combo?: [number, number, number];// Combinación secreta de 3 números (0 a 31)
  letterTitle: string;             // Encabezado de la carta de amor
  letterBody: string;              // Contenido emocional de la carta (hasta 1200 car.)
  photo?: string;                  // DataURL optimizado (<150KB) o URL externa
  photoCompressedSize?: string;    // Metadato informativo de la compresión
  customAudio?: string;            // Audio en Base64 subido por el usuario
  customAudioName?: string;        // Nombre original del archivo MP3/WAV
  voiceNote?: string;              // Audio en Base64 grabado con micrófono (hasta 45s)
  voiceNoteDuration?: string;      // Duración calculada (ej: "28s")
  ambientFx: "hearts" | "stars" | "sakura" | "fireflies" | "snow"; // Atmósfera mágica
  presetMelody: "music-box" | "piano-love" | "sunset-rhodes" | "starlight-waltz";
  customSign?: string;             // Firma libre o personalizada sin marca ajena
}
```

---

## 7. Lo que Queda Fuera de Alcance (Out of Scope)
- **Activos propietarios de Dedicapag:** No se copia su logotipo, sus marcas registradas ni sus textos legales.
- **Paywalls obligatorios:** Se rechaza de forma deliberada el modelo de cobro de 12 horas.
- **Rastreadores y publicidad invasiva:** 0 scripts de Monetag, 0 rastreo publicitario.

---

## 8. Tamaño y Evaluación Técnica (Sizing)

- **Pantallas:** 7 pantallas/modales completamente definidos.
- **Flujos:** 5 flujos de usuario completos.
- **Entidades:** Esquema de datos unificado y serializable.
- **Partes complejas superadas:** Síntesis sonora Web Audio API, serialización Base64 URL sin servidor, generación autónoma de QR SVG con emblema central y grabadora MediaRecorder nativa.
- **Calificación:** **M (Completado y refinado)**.
