# Especificación de Backend en Paralelo: Dedicapag vs. Dedicapag NextGen

Documento técnico elaborado bajo la metodología `replica-backend`, comparando la arquitectura de servidor y pagos de la original frente a la solución **Client-First de costo cero** de Dedicapag NextGen.

---

## 1. Comparativa de Arquitectura de Backend

| Componente | Dedicapag (Original) | Dedicapag NextGen (Nuestra Plataforma) | Diagnóstico & Ventaja |
|---|---|---|---|
| **Modelo de Servidor** | Monolito PHP/Laravel en servidor VPS dedicado. | **Serverless Jamstack + Client-First.** | En NextGen el coste de servidor es **$0.00 USD/mes**; resiste picos virales sin saturarse. |
| **Persistencia Principal** | Base de datos MySQL con tabla de expiración a 12h. | **Serialización Base64 en URL + `localStorage` local.** | Elimina la dependencia de hosting: el enlace viaja autocontenido en el mensaje. |
| **Base de Datos Cloud (Opcional)**| MySQL cerrada y propietaria. | **PostgreSQL con Row-Level Security (RLS)** en [`replica/schema.sql`](file:///c:/Users/susig/OneDrive/Desktop/Nueva%20carpeta%20(2)/dedicapag-nextgen/replica/schema.sql). | Escalable y lista para conectar a Supabase o Cloudflare D1 si se desean shortlinks. |
| **Autenticación (Auth)** | Registro obligatorio con email/contraseña para guardar. | **Sin cuenta obligatoria.** Privacidad 100%: "Mis Guardados" vive en el navegador del usuario. | Máxima privacidad y fricción cero para regalar en segundos. |
| **Pasarela de Pagos** | Bloqueo estricto de \$2-\$15 USD (Stripe/PayPal/Yape). | **Voluntario / "Paga lo que sientas"** (Stripe Checkout opcional). | Ninguna dedicatoria se bloquea ni caduca por falta de pago. |
| **Procesamiento de Archivos** | Carga pesada a disco en el servidor. | **Procesamiento client-side con `<canvas>` y Web Audio API.** | Limpieza de metadatos EXIF y compresión a ~150KB sin consumir ancho de banda de servidor. |
| **Rastreadores y Anuncios** | Scripts de publicidad Monetag y cookies de seguimiento. | **0 Anuncios, 0 Rastreadores, 0 Cookies invasivas.** | Experiencia limpia y digna de un regalo de amor íntimo. |

---

## 2. Estrategia de Pagos y Monetización Ética

A diferencia de Dedicapag, que cobra obligatoriamente por desbloquear la permanencia de la página o por subir un archivo MP3:
- **Dedicapag NextGen es 100% gratuita:** Todas las 35 plantillas, subida de canciones MP3/WAV, notas de voz con micrófono y exportación offline están desbloqueadas de fábrica.
- **Modelo "Paga lo que sientas":** Se incluye la estructura para donaciones voluntarias a través de Stripe Checkout (`voluntary_tips` en el esquema SQL), permitiendo a usuarios agradecidos apoyar el proyecto sin presionar a quienes no pueden pagar.

---

## 3. Lista de Verificación de Seguridad (Security Checklist)

- [x] **Secretos aislados:** Archivo `.env.example` generado sin claves expuestas en el repositorio.
- [x] **Sanitización contra XSS:** Todas las cadenas del usuario (`title`, `letterBody`, `unlockMsg`) se escapan mediante codificación URI y parseo estricto en el renderizador.
- [x] **Mitigación de fuga de metadatos (Privacidad):** El redimensionamiento de fotos en `<canvas>` elimina automáticamente metadatos sensibles (geolocalización GPS del teléfono, modelo de cámara y fecha exacta).
- [x] **Control de tamaño de payload:** Validación estricta que rechaza audios que superen los 25 MB en cliente y comprime fotos a menos de 200 KB.
- [x] **Sin almacenamiento innecesario de datos personales:** No se recopilan correos electrónicos, contraseñas ni números de teléfono de las parejas para crear dedicatorias.
- [x] **Resistencia contra caídas:** Al ejecutarse el núcleo en el navegador del cliente y en archivos `.html` autónomos, no existe riesgo de pérdida de recuerdos si el servidor se apaga.

---

## 4. Estado de la Matriz de Funciones (`replica/features.csv`)

Todas las funciones backend (persistencia de datos, exportación sin servidor, validación y pagos éticos) están alineadas y auditadas al 100%.
