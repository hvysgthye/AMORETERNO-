# Guardado real de dedicatorias

El diseño anterior guardaba los archivos en el navegador y el texto en un enlace Base64. Eso no conservaba las canciones ni las fotos del dispositivo para un destinatario.

## Flujo implementado

1. `POST /api/gifts`: valida la plantilla; devuelve un identificador aleatorio de 128 bits y una credencial de escritura.
2. `PUT /api/gifts/:id/media/:slot`: guarda la foto, galería, canción o voz en R2. La credencial solo sirve para ese borrador.
3. `POST /api/gifts/:id/publish`: comprueba que existen los archivos y guarda los textos y referencias. La plantilla queda fijada desde el primer paso.
4. El enlace corto `?g=identificador` y el QR apuntan al mismo regalo. El destinatario recupera los datos del servidor y no depende del equipo del creador.

El cliente no ofrece Copiar, WhatsApp o QR hasta confirmar el guardado. Un error nunca se transforma en un candado por defecto.

## Límites y acceso

- No hay API de listado, búsqueda o galería pública de regalos.
- Conocer el identificador permite leer ese regalo y sus archivos. Reenviar el enlace permite que otra persona lo vea.
- La credencial de escritura no forma parte del enlace. Los regalos publicados son inmutables; editar crea una versión nueva.
- Hasta seis imágenes de galería, una imagen principal, una canción y una nota de voz. Imágenes hasta 3 MB; audio hasta 25 MB.
- El servidor comprueba las firmas de los archivos y no sirve HTML/SVG subido.
- Diez borradores por IP/hora mediante escrituras condicionales en R2. No se registra la IP en claro.
- Los borradores dejan de aceptar subidas tras 24 horas. La limpieza automática de archivos huérfanos requiere una política operativa adicional; no se afirma implementada.
- No se envían textos, fotos ni canciones en el enlace ni en los registros de la aplicación.

## Servicio de producción autorizado

El usuario autorizó explícitamente almacenar fotos, canciones, notas de voz y textos en Amor Eterno · Recuerdos (Sites/Cloudflare) y el acceso a cada regalo mediante su enlace. El servicio está desplegado en `https://amor-eterno-recuerdos.airylarch2048.chatgpt.site`, proyecto `appgprj_6ae146c6891c8191a10c2c4f559f89ba`. No tiene listado público de dedicatorias.

El cliente utiliza ese origen autorizado por defecto. `VITE_GIFT_API_URL` permite configurar otro origen; definirlo como cadena vacía detiene cualquier petición de guardado. Nunca añadir credenciales del servidor a una variable VITE_.

La fuente desplegable se conserva en la carpeta hermana `amoreterno-sharing-service`. Mantener su `worker/index.js` sincronizado con este Worker y el binding `r2: "BUCKET"`. No crear otro proyecto.

La prueba real `scripts/check-live-sharing.mjs` utiliza únicamente fixtures sintéticos; comprobó que las imágenes y canciones recuperadas tienen exactamente los bytes originales y que el audio responde a solicitudes Range. Su resultado se registra en `evidence/sharing-live-result.json`.

## Pruebas

`npm test` verifica subida y lectura independiente con archivos sintéticos en memoria, las 45 plantillas, autorización por borrador, formatos inválidos, subida interrumpida y ausencia de peticiones sin destino configurado.

`node scripts/preview-sharing.mjs` levanta un servidor local con datos temporales en el puerto 3002. Puede usarse con Vite configurado para ese origen. No es almacenamiento de producción.
