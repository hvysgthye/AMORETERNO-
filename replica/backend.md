# Backend de Amor Eterno — estado verificado

Actualización del 27 de octubre de 2026.

La arquitectura anterior basada en Base64 y localStorage no almacenaba las fotos ni las canciones del creador para otros dispositivos. Las afirmaciones anteriores de funcionalidad completa sin backend se sustituyen por este estado comprobado.

- Frontend: React/Vite en GitHub Pages.
- Persistencia de regalos y archivos: Worker de Sites/Cloudflare con R2, proyecto `appgprj_6ae146c6891c8191a10c2c4f559f89ba`.
- API: `https://amor-eterno-recuerdos.airylarch2048.chatgpt.site`.
- Identificador aleatorio de 128 bits por regalo, permiso de escritura separado y ausencia de API de listados.
- Publicación confirmada solo al terminar las subidas. Lectura por identificador desde cualquier dispositivo con el enlace.
- Plantilla validada y fijada al crear el borrador. Los errores ya no abren el candado de respaldo.
- Servidor: validación de tipos y tamaños, firma de archivos, límites de creación, borradores no legibles y regalos publicados inmutables.
- Cliente: progreso, errores recuperables, enlaces/QR bloqueados hasta confirmar, audio seleccionable con reproductor de comprobación.
- Autorización específica del usuario recibida para el destino, los tipos de archivos y el acceso por enlace. No hay galería pública.

## Validación

15 pruebas automatizadas: almacenamiento y recuperación con archivos sintéticos, 45 selecciones de plantilla, fallos de subida, autorización, enlaces dañados, lectura independiente de QR y regresiones anteriores.

Prueba real contra el servicio desplegado: imagen y audio recuperados con bytes idénticos; plantilla Árbol conservada; audio Range 206. Evidencia en `evidence/sharing-live-result.json`.

Prueba de navegador con servicio local de memoria: canción e imagen seleccionadas en el editor; enlace corto de 47 caracteres; QR generado; otra pestaña recuperó la plantilla Árbol.

## Límites conocidos

No hay cuentas de usuario, edición de regalos publicados, restauración de copias ni limpieza automática de archivos huérfanos. La permanencia depende de mantener operativo el servicio. La implementación y los límites están documentados en `backend/README.md`.
