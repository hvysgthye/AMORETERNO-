# Dedicapag NextGen

Aplicación de dedicatorias con React y Vite. Esta carpeta contiene el código y el repositorio Git del proyecto.

## Abrir el código

Abre esta carpeta en tu editor, o abre `Dedicapag.code-workspace` desde la carpeta superior con VS Code o un editor compatible.

El archivo principal de la aplicación es `src/App.jsx`.

## Ver la página

Desde una terminal situada en esta carpeta:

```sh
npm install
npm run dev
```

Abre la dirección que muestra Vite en la terminal, normalmente http://localhost:3000. Si el puerto está ocupado, Vite indica otro puerto. Mantén la terminal abierta mientras utilizas la página.

También puedes ejecutar `INICIAR-PAGINA.cmd` en Windows si las dependencias ya están instaladas.

No abras `index.html` con doble clic: el código JSX necesita el servidor de Vite.

## Archivos importantes

- `src/App.jsx`: navegación y estado principal.
- `src/components/Catalog.jsx`: galería, búsqueda y categorías.
- `src/components/EditorWizard.jsx`: editor de dedicatorias.
- `src/components/templates/`: diseños interactivos.
- `src/components/templates/shared/Decor.jsx`: decoración y cartas compartidas.
- `src/data/templates.js`: catálogo y valores iniciales.
- `src/index.css`: estilos y diseño adaptable.
- `src/utils/`: exportación, audio y herramientas para compartir.
- `replica/`: documentación y análisis previos.

## Compilar

```sh
npm run build
npm run preview
```

La compilación se genera en `dist/`. `node_modules/`, `dist/` y los archivos de entorno privados están excluidos de Git.

## Git

Ejecuta los comandos Git desde esta carpeta. La carpeta superior contiene otra aplicación y no es un repositorio Git.

```sh
git status
git log -5 --oneline
```

Un commit local guarda una versión del código en este equipo. Para actualizar GitHub se necesita un push al repositorio remoto.
