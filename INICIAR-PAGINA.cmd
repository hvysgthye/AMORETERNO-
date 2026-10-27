@echo off
setlocal
cd /d "%~dp0"
where npm >nul 2>nul
if errorlevel 1 (
  echo No se encontro npm. Instala Node.js y vuelve a abrir este archivo.
  pause
  exit /b 1
)
if not exist "node_modules\vite\bin\vite.js" (
  echo Faltan dependencias. Ejecuta npm install en esta carpeta.
  pause
  exit /b 1
)
echo Mantener esta ventana abierta. Vite abrira la pagina en el navegador.
call npm run dev -- --host 127.0.0.1 --open
pause
