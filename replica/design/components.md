# Especificación de Componentes de Diseño en Paralelo: Dedicapag vs. Dedicapag NextGen

Este documento detalla los componentes del sistema de diseño reconstruido con metodología limpia (clean-room), garantizando accesibilidad WCAG AA, activos 100% de código abierto (Lucide Icons, Google Fonts libres) y cero elementos gráficos o tipografías propietarias de la original.

---

## 1. Comparativa de Identidad y Tipografía

| Elemento | Dedicapag (Original) | Dedicapag NextGen (Reconstruida) | Estado y Licencia |
|---|---|---|---|
| **Tipografía de Título** | Fuentes del sistema genéricas | **Playfair Display** (Google Fonts) | SIL Open Font License (OFL) |
| **Tipografía de Firma** | Cursiva estándar del navegador | **Dancing Script** (Google Fonts) | SIL Open Font License (OFL) |
| **Tipografía de Interfaz** | System UI / Sans genérica | **Plus Jakarta Sans** (Google Fonts) | SIL Open Font License (OFL) |
| **Set de Iconos** | SVG inline dispersos o FontAwesome | **Lucide Icons** (React) | Licencia ISC / MIT |
| **Contraste de Textos** | Textos grises en fondo oscuro con ratio < 3.2:1 (Falla AA) | **11 combinaciones auditadas con ratio hasta 19.8:1** | **100% WCAG AAA / AA Conforme** |

---

## 2. Especificación Atómica de Componentes

### 1. `Button` (Botones de Acción)
- **Variantes:**
  - `primary`: Gradiente carmesí-oro (`bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500`), texto `on-accent` (`#ffffff`), sombra `glow-rose`.
  - `secondary`: Superficie `surface-glass` con borde `border-rose-500/30`, hover `bg-white/10`.
  - `whatsapp`: Fondo verde esmeralda (`#059669`), hover (`#10b981`), sombra esmeralda.
  - `ghost`: Sin fondo, texto `text-muted` (`#cbd5e1`), hover `text-white` y `bg-white/5`.
- **Estados:** Default, Hover (ligera escala 1.02), Active (escala 0.97), Focus-visible (anillo 2px `border-rose-500`), Disabled (opacidad 0.35, `cursor-not-allowed`).
- **Accesibilidad:** Elementos `<button>` nativos, atributos `aria-label` descriptivos, feedback inmediato de copiado (`¡Copiado!`).

### 2. `Dial3D` (Diales Numéricos del Candado)
- **Estructura:** Tres tambores independientes con rango 0 a 31 (mes/día/año).
- **Interacción:** Botones de flecha arriba/abajo o scroll táctil, acompañados de sonido físico mecánico generado con Web Audio API (`sound.playDialClick()`).
- **Estados:**
  - *Bloqueado:* Marco bronce/dorado oscuro (`#78350f`), dial numérico dorado brillante (`#fde68a`).
  - *Desbloqueando:* Arco del candado con resorte hacia arriba (`translate-y-[-14px]`).
  - *Éxito:* Halo expansivo carmesí (`glow-rose`) + explosión de confeti.

### 3. `VoiceRecorderPill` (Grabadora y Reproductor de Voz)
- **Estructura:** Contenedor tipo pastilla con micrófono y temporizador.
- **Estados:**
  - *Inactivo:* Botón sutil con icono `Mic` ("Comenzar a grabar mi voz").
  - *Grabando:* Indicador circular rojo pulsante con animación `animate-ping`, cronómetro ascendente (0 a 45s), botón de corte inmediato `MicOff`.
  - *Listo:* Tarjeta de audio con botón `Play`/`Pause`, barra de duración y botón de descarte `Trash2`.

### 4. `AtmosphereSelector` (Selector de Efectos Flotantes)
- **Variantes:** Corazones (💖), Estrellas (✨), Sakura (🌸), Luciérnagas (🌟), Nieve (❄️).
- **Tokens aplicados:** Radio `radius-md`, fondo `surface-glass`, borde `border-rose-500` al estar seleccionado.

### 5. `PolaroidCard` (Marco de Foto Romántico)
- **Estructura:** Marco blanco clásico con efecto de rotación de -2.5°, cinta adhesiva semitransparente superior (`bg-amber-100/80 rotate-[4deg]`) y pie de foto manuscrito en *Dancing Script*.
- **Comportamiento:** Hover con transición suave a 0° de rotación y sombra profunda `shadow-2xl`.

### 6. `QRGiftCard` (Tarjeta de Regalo para Imprimir)
- **Dimensiones:** Canvas 2D de 800 x 1050 px (proporción postal de alta resolución).
- **Capas:** Gradiente de fondo terciopelo nocturno (`#0c0f20` a `#2c0d1e`), doble filete dorado/carmesí, cabecera tipográfica en *Playfair Display*, código QR vectorial con corazón central, nombre del destinatario en *Dancing Script* y guía de escaneo.
