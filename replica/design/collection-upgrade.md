# Colección Amor Eterno — 2026-10-27

## Referencias observadas

| Fuente pública | Observación |
| --- | --- |
| https://dedicapag.com/ | Colección y flujo de elegir, personalizar y compartir. |
| https://dedicapag.com/create/galaxia-infinita | Demo pública: entrada teatral, jerarquía tipográfica y pieza central luminosa. |
| https://dedicapag.com/create/flores-moradas | Demo pública: entrada oscura, ramo central y pista de apertura. |

Se estudió una muestra pública, sin cuentas, descargas de recursos ni copia de código o ilustraciones. No se afirma haber auditado todas las plantillas de la referencia.

## Dirección propia

45 ediciones definidas en `src/data/keepsakeDesigns.js`: colores, material, frase original y motivo. Familias: joyería, arquitectura, correspondencia, cosmos, botánica, luz, juegos, océano y retro. El catálogo utiliza ilustraciones SVG originales en lugar de repetir iconos genéricos.

- Portada: composición vertical, ilustración protagonista, número de edición, marco fino y frase serif.
- Escena: escenario por material, luces suaves, ornamentos discretos, títulos con ancho de lectura limitado y entrada por teclado en las galaxias.
- Carta: textura de papel, marco interior, jerarquía de título y firma, interlineado amplio y álbum con controles etiquetados.
- Estados: foco visible, imagen no disponible con ilustración de respaldo, salto accesible de la escritura, preferencia de movimiento reducido.
- Descarga: mismos colores y materiales; ilustraciones universales incluidas como SVG, sin necesitar React. Diez diseños antes caían en el tema de candado al exportar; ahora tienen ilustración y presentación propias. El HTML conserva sus dependencias externas previas para fuentes, Tailwind y confeti.

`npm run artwork` genera el mapa estático de SVG para exportar. `prebuild` lo ejecuta antes de cada compilación, para mantenerlo actualizado.

## Comprobaciones

- Navegador a 390 × 844: las 45 escenas se abrieron con encabezado y sin desbordamiento horizontal.
- Navegador en escritorio: revisión de portada, catálogo, búsqueda y carta.
- Apertura observada en carta, dedicatoria minimalista y memorama. Una prueba larga de interacciones se interrumpió por tiempo de la herramienta; no se certifica una prueba manual completa de cada interacción.
- `npm test`: contraste de tinta y acento sobre los 45 materiales base (90 pares, mínimo 4.5:1), ejecución y revelación de texto de los 45 HTML exportados y pruebas anteriores de seguridad, enlaces, QR e historial.
- Evidencia de navegador: `replica/clone-screens/keepsake-*.jpg`.

El contraste de los materiales base no certifica todos los elementos de cada escena ni sustituye una auditoría completa de accesibilidad.
