# Arquitectura Técnica en Paralelo: Dedicapag vs. Dedicapag NextGen

Este documento define la arquitectura técnica formal requerida por `replica-architect`, comparando la arquitectura frágil y costosa de la original frente a la arquitectura resiliente, de costo cero y orientada al cliente de **Dedicapag NextGen**.

---

## 1. Comparación de la Pila Tecnológica (The Stack)

| Capa | Dedicapag (Original) | Dedicapag NextGen (Nuestra Solución) | Justificación de la Elección en NextGen |
|---|---|---|---|
| **Frontend Web** | PHP Blade monolítico + jQuery disperso + scripts inline | **Vite + React 18 + Tailwind CSS** | Reactividad a 60fps, modularidad en componentes limpios y cero latencia en el editor split-screen. |
| **Diseño e Iconografía** | CSS sin variables centralizadas + dependencias externas | **Tailwind CSS + Lucide Icons + Google Fonts** (Playfair, Dancing Script) | Tokens de diseño declarativos y estética visual de lujo inspirada en cartas y joyería. |
| **Motor de Audio** | Etiquetas `<audio>` con fallos de carga en móviles | **Web Audio API + MediaRecorder nativo** | Generación sintética procedural de 4 melodías sin archivos externos + Grabación de voz real con micrófono. |
| **Compresión de Medios** | Carga directa al servidor (bloqueos por fotos >3MB) | **Canvas 2D client-side compressor** | Reduce fotos a ~150KB automáticamente en milisegundos en el celular sin saturar datos ni memoria. |
| **Persistencia Principal** | MySQL en VPS con tabla de expiración a las 12 horas | **State Serialization Base64 en URL + `localStorage`** | Permite que cualquiera comparta su regalo sin pagar servidores ni crear base de datos obligatoria. |
| **Base de Datos Opcional** | MySQL relacional clásico acoplado a pasarelas de pago | **PostgreSQL en Supabase / Cloudflare D1 (RLS)** | Véase [`replica/schema.sql`](file:///c:/Users/susig/OneDrive/Desktop/Nueva%20carpeta%20(2)/dedicapag-nextgen/replica/schema.sql) para persistencia cloud o shortlinks opcionales a $0 de costo. |
| **Códigos QR** | No disponible nativamente (requiere webs de terceros) | **Librería pura `qrcode` con badges SVG de corazón** | Generación vectorial instantánea y tarjetas de regalo descargables en PNG (800x1050 px). |
| **Monetización** | Pasarela forzosa de \$2-\$15 USD que borra la carta en 12h | **100% Gratuito y Libre (Opción "Paga lo que sientas")** | Elimina la barrera de entrada para estudiantes y parejas jóvenes. |
| **Alojamiento y Red** | VPS con Cloudflare y riesgo de caída de servidor | **Edge Static Hosting (Vercel / Netlify / Cloudflare Pages)** | Costo mensual: **$0.00 USD**. Resiste picos virales de millones de visitas sin caerse. |

---

## 2. Esquema de Base de Datos y Contratos de Datos

El diseño de datos sigue una estrategia **híbrida client-first**:
1. **Nivel 1 (Cliente puro sin servidor):** Toda dedicatoria se empaqueta en un objeto serializado Base64 URL-safe (`?mode=view&d=...`) y se almacena en el `localStorage` del creador (`STORAGE_KEY = 'dedicapag_saved_creations'`).
2. **Nivel 2 (Nube escalable opcional):** Para shortlinks o galería pública, se define un esquema SQL relacional en PostgreSQL con Row-Level Security (RLS) en [`replica/schema.sql`](file:///c:/Users/susig/OneDrive/Desktop/Nueva%20carpeta%20(2)/dedicapag-nextgen/replica/schema.sql):
   - **`templates`:** Catálogo de 35 plantillas con configuraciones y defaults.
   - **`dedications`:** Registro con slug único, template_id, título, combinación, fotos, notas de voz, atmósferas y firmas.
   - **`voluntary_tips`:** Registro voluntario de propinas opcionales ("Buy Me a Coffee" / Stripe).

---

## 3. Contratos de Rutas y Navegación

| Ruta / Acción | Método | Propósito en Dedicapag Original | Implementación en Dedicapag NextGen |
|---|---|---|---|
| `/` o `/create` | `GET` | Carga de catálogo mediante llamadas PHP al servidor. | Catálogo reactivo en cliente con 35 plantillas agrupadas por categorías. |
| `/create/{slug}` | `POST` | Envío de formulario completo con recarga de página lenta. | Editor Asistido en 3 pasos con sincronización 0ms a la pantalla de vista previa. |
| `/share` | `GET / POST` | Pasarela de pago bloqueante con tarjeta o PayPal. | Generador instantáneo de URL Base64 + Tarjeta física con QR + WhatsApp simulator. |
| `/?mode=view&d={b64}` | `GET` | `/p/{slug}` alojada en servidor con caducidad de 12 horas. | Modo Destinatario inmersivo a pantalla completa sin caducidad y sin servidor. |
| `/export/html` | Client action | No existe en original. | Compilación a archivo `.html` de ~39KB con assets inlined para regalar offline. |

---

## 4. Los Puntos Críticos Superados (The parts that bite)

1. **El límite de URLs en mensajería móvil:**  
   *Problema:* Si la URL supera los 2000 caracteres, WhatsApp o Telegram pueden truncarla.  
   *Solución NextGen:* El payload se compacta utilizando claves cortas (`t`, `ti`, `lt`, `um`, `le`, `lb`, `c`), se omiten campos nulos, y las fotos grandes se dirigen a exportación offline `.html` mientras la URL preserva la experiencia interactiva liviana.
2. **Políticas de Autoplay de Audio en Navegadores Móviles:**  
   *Problema:* iOS Safari y Chrome Android bloquean la reproducción de audio si no proviene de un gesto del usuario.  
   *Solución NextGen:* Se activa el contexto de Web Audio y se reproducen las melodías en el primer clic o giro del dial del candado (`window.addEventListener('click', ..., { once: true })`).
3. **Fotos pesadas de celulares modernos (3MB - 12MB):**  
   *Problema:* En la original, fotos de iPhone provocan errores 413 o congelamientos.  
   *Solución NextGen:* `compressImageFile` usa un canvas fuera de pantalla para remuestrear a un máximo de 1200px con compresión WebP/JPEG a 0.82, reduciendo el peso en más del 95% antes de procesarlo.

---

## 5. Orden de Construcción y Estado de los Hitos

- [x] **Hito 1: Vertical Slice:** Editor reactivo + Candado 3D interactivo + Audio sintético (Completado).
- [x] **Hito 2: Ecosistema Completo:** 35 plantillas de lujo + Optimizador Canvas + Exportador HTML (Completado).
- [x] **Hito 3: Viralidad y Destinatario:** Generador de QR imprimible + Modo destinatario + WhatsApp (Completado).
- [x] **Hito 4: Audio Studio Sensorial:** Grabadora de notas de voz + Melodías de catálogo + Atmósferas mágicas (Completado).
- [ ] **Hito 5: Sistema de Diseño Formal:** Tokens, paletas y accesibilidad WCAG (`replica-design`).
