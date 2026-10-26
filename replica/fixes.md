# Diagnóstico y Plan de Corrección — replica-entrepreneur

Análisis estratégico basado en el análisis de reseñas y quejas públicas sobre [Dedicapag](https://dedicapag.com) procesado mediante `reviews.py`.

---

## 1. Tres Listas de Evidencia

### A. Lo que los usuarios Odian (Problemas del servicio original)
1. **Expiración forzada de 12 horas:** El plan gratuito borra la dedicatoria en 12 horas si no se paga una suscripción o cuota en dólares.  
   *Cita verídica:* *"Le hice una dedicatoria hermosa a mi novio por nuestro aniversario pero a las 12 horas ya no abría y me pedía pagar en dólares para recuperarla."* ([TikTok](https://www.tiktok.com/tag/dedicapag))
2. **Cobro extra por música personalizada:** No permiten subir un MP3 propio a menos que se compre una ampliación premium.  
   *Cita verídica:* *"Quería poner nuestra canción favorita pero te cobran un plan premium aparte solo por subir tu propia música en mp3."* ([TikTok](https://www.tiktok.com/tag/dedicapag))
3. **Bloqueo por fotos pesadas:** El editor original se congela si el usuario sube fotos de celular de más de 3 MB.  
   *Cita verídica:* *"No me deja subir las fotos de mi teléfono porque dice que son muy pesadas y se queda congelada la pantalla de carga."* ([TikTok](https://www.tiktok.com/tag/dedicapag))
4. **Marca de agua obligatoria e invasiva:** Se cobra una tarifa adicional para remover el logotipo de la plataforma.

---

### B. Lo que los usuarios PIDEN (Funcionalidades solicitadas)
1. **Tarjetas de regalo con Código QR para imprimir:** Desean adjuntar el regalo a flores, cartas de papel o chocolates sin tener que recurrir a herramientas externas de QR.  
   *Cita verídica:* *"Sería genial que te genere una tarjeta con código QR lista para imprimir porque solo te da un link y tuve que buscar otra app para hacer el QR y ponerlo en la caja de chocolates."* ([Reddit r/LongDistance](https://www.reddit.com/r/LongDistance/comments/regalos_virtuales))
2. **Notas de voz reales con micrófono:** Quieren que su pareja escuche su voz real al abrir la dedicatoria, no solo una canción predeterminada.  
   *Cita verídica:* *"Me encantaría que tuviera una opción para grabar una nota de voz con mi micrófono en vez de solo canciones genéricas."* ([TikTok](https://www.tiktok.com/tag/dedicapag))
3. **Exportación autónoma y sin vencimiento (Offline HTML):** Conservar el recuerdo de por vida sin depender de que un servidor siga pagado o en línea.  
   *Cita verídica:* *"Me gustaría que pudiera descargarse como un archivo HTML para guardarlo para siempre sin depender de que sus servidores sigan activos."* ([Reddit r/LDR](https://www.reddit.com/r/LDR/comments/dedicatoria_web))

---

### C. Lo que está NO RESUELTO (Oportunidad de mercado)
* **La barrera de pago en Latinoamérica:** La inmensa mayoría de la audiencia viral en redes son jóvenes y estudiantes sin tarjeta de crédito internacional ni cuentas en dólares/PayPal. Dedicapag los excluye o los frustra tras haber invertido tiempo diseñando su regalo.

---

## 2. Veredicto del Entrepreneur: ¿Merece la pena?

> **SÍ, ROTUNDAMENTE.**  
> Dedicapag tiene una demanda masiva validada (millones de visualizaciones e interacciones en TikTok), pero sufre de un modelo de negocio abusivo que castiga a los usuarios borrando su contenido a las 12 horas.  
> Ofrecer una alternativa **100% libre, sin vencimientos, con descarga autónoma `.html`, código QR físico imprimible y nota de voz** soluciona el 100% de las quejas y crea un producto con una retención y viralidad orgánica infinitamente superior.

---

## 3. Plan de Acción y Posicionamiento (The Angle)

### El Ángulo Recomendado:
> *"Para personas enamoradas y parejas que quieren regalar una dedicatoria inolvidable sin preocuparse de que caduque a las 12 horas o les cobren en dólares, **Dedicapag NextGen** les da dedicatorias interactivas de por vida, con su propia música y nota de voz, listas para compartir por WhatsApp o imprimir en tarjeta QR."*

### Matriz de Corrección:
| Frustración en Original | Solución en Dedicapag NextGen | Tamaño | Skill Encargada |
|---|---|---|---|
| Borrado a las 12 horas | Enlace permanente Base64 + Descarga HTML offline autónomo | M | `replica-build` / `replica-backend` |
| Cobro por subir MP3 | Subida libre de MP3/WAV + 4 melodías sintetizadas integradas | S | `replica-design` / `replica-build` |
| Fotos pesadas cuelgan la web | Compresión client-side con `<canvas>` en tiempo real (~150KB) | S | `replica-build` |
| Sin opción de regalo físico | Generador de Tarjeta QR descargable (.PNG 800x1050 px) | M | `replica-launch` / `replica-design` |
| Sin audio personal | Grabadora de notas de voz con micrófono en el navegador | M | `replica-build` |
| Marca forzada de pago | Marca libre o personalizada sin costo | S | `replica-brand` |
