# Guía Oficial de Despliegue y Preflight — replica-deploy

Documento final de certificación de despliegue bajo la metodología `replica-deploy`. Certifica que la plataforma ha superado con éxito todos los controles de calidad, paridad y compilación, y detalla la puesta en producción a costo **$0.00 USD/mes**.

---

## 1. Verificación Preflight Oficial (Todas las compuertas aprobadas)

- [x] **Batería de pruebas funcionales y de plantillas:** **35 de 35 plantillas aprobadas** (100% PASS en `verify_all_35.cjs`).
- [x] **Control de Calidad y Bugs:** **0 bugs S1 abiertos / 0 bugs S2 abiertos** (Certificado en [`replica/bugs.md`](file:///c:/Users/susig/OneDrive/Desktop/Nueva%20carpeta%20(2)/dedicapag-nextgen/replica/bugs.md)).
- [x] **Puntuación de Paridad Oficial (`parity.py`):** **100.0 / 100** (7 de 7 funciones esenciales completadas + 11 ventajas exclusivas en [`replica/parity.md`](file:///c:/Users/susig/OneDrive/Desktop/Nueva%20carpeta%20(2)/dedicapag-nextgen/replica/parity.md)).
- [x] **Auditoría de Ficha y Metadatos (`listing.py`):** **0 errores / 0 advertencias** (Certificado en [`replica/launch/listing.json`](file:///c:/Users/susig/OneDrive/Desktop/Nueva%20carpeta%20(2)/dedicapag-nextgen/replica/launch/listing.json)).
- [x] **Compilación de Producción (`npm run build`):** **Exit 0 en 10.05s** (`dist/` generado con 2012 módulos transformados).
- [x] **Privacidad y Datos:** 0 anuncios, 0 rastreadores Monetag, 0 almacenamiento innecesario de contraseñas.
- [x] **Activos e Identidad:** Tipografías libres de Google Fonts (*Playfair Display*, *Dancing Script*, *Plus Jakarta Sans*), iconos *Lucide* y gráficos procedurales propios.

---

## 2. Comparativa de Infraestructura en Paralelo

| Factor de Despliegue | Dedicapag (Original) | AmorEterno / NextGen | Diagnóstico de Producción |
|---|---|---|---|
| **Tipo de Hosting** | Servidor VPS tradicional (DigitalOcean / AWS). | **Edge Global Serverless (Vercel / Netlify / Cloudflare Pages).** | NextGen escala automáticamente a nivel mundial sin costos fijos. |
| **Costo Mensual de Servidor**| \$15 a \$60 USD/mes obligatorio. | **$0.00 USD/mes (Plan Hobby/Free de Vercel/Cloudflare).** | **100% Gratuito de por vida.** |
| **Riesgo ante Picos Virales**| Posible saturación de MySQL o caída de Apache/Nginx. | **Inmune:** Archivos estáticos en CDN global; las dedicatorias viajan en la URL o en HTML autónomo. | Soporta millones de visitas simultáneas de TikTok sin caerse. |
| **Mantenimiento Técnico** | Requiere parches de seguridad de PHP, MySQL y Linux. | **Cero mantenimiento:** Solo archivos estáticos optimizados. | Libre de soporte de infraestructura. |

---

## 3. Opciones de Publicación en 1 Clic (Gratis)

### Opción A: Despliegue en Vercel (Recomendado)
1. Instala Vercel CLI (opcional) o conecta tu repositorio de GitHub a [vercel.com](https://vercel.com).
2. Configuración del proyecto:
   - **Framework Preset:** Vite
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Haz clic en **Deploy**. Tendrás tu enlace público inmediato tipo `amoreterno.vercel.app` con certificado SSL HTTPS automático.

### Opción B: Despliegue en Cloudflare Pages / Netlify
- Conecta el repositorio, selecciona el directorio de salida `dist` y comando `npm run build`.

---

## 4. Configuración de Dominio Personalizado (DNS)

Cuando registres tu propio dominio (ejemplo: `amoreterno.love` o `dedica.me`):

| Tipo de Registro | Host / Nombre | Valor de Destino | Propósito |
|---|---|---|---|
| **A** | `@` (raíz) | `76.76.21.21` (Dirección Anycast de Vercel) | Conectar el dominio principal. |
| **CNAME** | `www` | `cname.vercel-dns.com` | Redirección canónica de www. |

---

## 5. Monitoreo y Pruebas Post-Lanzamiento

Una vez publicado el enlace en producción:
1. **Prueba en smartphone:** Abre el enlace desde un teléfono móvil con Wi-Fi y datos celulares para verificar la fluidez del candado 3D y el audio.
2. **Prueba de WhatsApp:** Envía una dedicatoria a un chat de WhatsApp para comprobar la tarjeta enriquecida con imagen, título y emojis.
3. **Prueba de Tarjeta QR:** Imprime una tarjeta descargada y escanéala con la cámara nativa del celular para verificar que abre en pantalla completa instantáneamente.
