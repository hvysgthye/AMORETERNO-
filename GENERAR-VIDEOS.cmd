@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0"

echo =======================================================
echo   AMORETERNO - GENERADOR DE VIDEOS PARA REDES SOCIALES
echo   Formato Vertical 9:16 (TikTok, Reels, Shorts)
echo =======================================================
echo.
echo Selecciona la plantilla que deseas grabar en video:
echo   1. Candado del Amor 3D
echo   2. Girasol Eterno (Flor Amarilla)
echo   3. Arbol del Amor con Contador
echo   4. Propuesta de Matrimonio 3D
echo.
set /p opt="Elige una opcion (1-4): "

set TPL=candado
if "%opt%"=="1" set TPL=candado
if "%opt%"=="2" set TPL=flor-amarilla
if "%opt%"=="3" set TPL=arbol
if "%opt%"=="4" set TPL=propose

echo.
echo [1/2] Grabando video vertical 9:16 en alta definicion...
echo Por favor espera unos segundos...
call npm run generate:video %TPL%

echo.
echo [2/2] Abriendo la carpeta con tu video y texto listos...
if exist "videos" (
  explorer videos
)

echo.
echo =======================================================
echo   Listo! Tu video y texto estan en la carpeta videos.
echo   Solo abre TikTok, Instagram o YouTube y subelo!
echo =======================================================
pause
