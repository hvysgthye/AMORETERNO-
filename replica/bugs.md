# Bitácora de Bugs y Resoluciones — replica-test

Documento oficial de control de calidad bajo la metodología `replica-test`. Todos los bugs detectados fueron clasificados por severidad (S1 a S4) y resueltos antes de la liberación.

---

## 1. Resumen de Calidad

| Severidad | Descripción | Detectados | Resueltos | Abiertos |
|---|---|---|---|---|
| **S1** | Pérdida de datos, brechas de seguridad o flujo principal bloqueado | 0 | 0 | **0** |
| **S2** | Funcionalidad principal rota sin alternativa | 2 | 2 | **0** |
| **S3** | Comportamiento anómalo con alternativa disponible | 2 | 2 | **0** |
| **S4** | Detalles cosméticos o de estilo | 0 | 0 | **0** |

**Estado de la versión:** ✅ **Cero bugs abiertos (0 Open S1 / S2 / S3). Aprobada para producción.**

---

## 2. Reportes Individuales de Bugs y Corrección

### BUG-001: Error de orden de Hooks en `ShareModal.jsx` (React Minified Error #310)
- **Severidad:** S2
- **Flujo:** F02 (Compartir por WhatsApp y enlace)
- **Pantalla:** S04 (`ShareModal.jsx`)
- **Pasos para reproducir:**
  1. En el editor, hacer clic en el botón "Compartir & QR".
- **Comportamiento esperado:** El modal se abre y renderiza las 3 pestañas.
- **Comportamiento real:** Se generaba `Error: Minified React error #310` (Rendered more hooks than during previous render) debido a que `if (!isOpen) return null;` estaba ubicado antes del `useEffect` de autoguardado.
- **Solución:** Se reorganizó la declaración de `useEffect` por encima de la condición de retorno anticipado.
- **Estado:** ✅ **FIXED**

---

### BUG-002: Desbordamiento de Bloques RS en Generador QR (`typeNumber: 11 / errorCorrectLevel: 0`)
- **Severidad:** S2
- **Flujo:** F03 (Generación de Código QR y Tarjeta física)
- **Pantalla:** S04 (`ShareModal.jsx` / `qrCodeGenerator.js`)
- **Pasos para reproducir:**
  1. Escribir una carta extensa en el paso 2 y abrir la pestaña "Tarjeta QR Regalo".
- **Comportamiento esperado:** Generación de código QR nítido con corazón central.
- **Comportamiento real:** `Error: bad rs block @ typeNumber:11/errorCorrectLevel:0` porque la implementación previa tenía una tabla de bloques limitada a versiones 1 a 10.
- **Solución:** Se integró la librería estándar y pura `qrcode`, que soporta dinámicamente las 40 versiones de la especificación QR oficial, manteniendo el badge vectorial de corazón en el centro.
- **Estado:** ✅ **FIXED**

---

### BUG-003: Bloqueo de Binario Nativo de Rollup por Smart App Control de Windows
- **Severidad:** S3
- **Flujo:** Entorno de ejecución y servidor de desarrollo
- **Pantalla:** Todas
- **Pasos para reproducir:**
  1. Ejecutar `vite preview` en Windows 11 con directivas de Control de Aplicaciones activas.
- **Comportamiento esperado:** El servidor estático inicia normalmente.
- **Comportamiento real:** `ERR_DLOPEN_FAILED: Una directiva de Control de aplicaciones bloqueó este archivo (rollup.win32-x64-msvc.node)`.
- **Solución:** Se implementó un servidor HTTP ligero y puro en Node.js (`static_server.cjs`) que sirve los assets compilados de `dist/` en el puerto 4173 sin requerir ningún binario nativo compilado.
- **Estado:** ✅ **FIXED**

---

### BUG-004: Falta de exportación de `removeCreationLocally` en `shareHelper.js`
- **Severidad:** S3
- **Flujo:** S07 ("Mis Guardados")
- **Pantalla:** `MyCreationsModal.jsx`
- **Pasos para reproducir:**
  1. Ejecutar compilación con `npm run build` tras integrar el modal de creaciones guardadas.
- **Comportamiento esperado:** Compilación limpia en Rollup.
- **Comportamiento real:** Error de Rollup: `"removeCreationLocally" is not exported by "src/utils/shareHelper.js"`.
- **Solución:** Se implementó y exportó la función `removeCreationLocally(id)` con persistencia segura en `localStorage`.
- **Estado:** ✅ **FIXED**
