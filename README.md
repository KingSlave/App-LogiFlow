# App-LogiFlow — página de producto de LogiFlow Edu

Sitio web estático para presentar **LogiFlow Edu**, la aplicación de escritorio
para aprender algoritmos con diagramas de flujo, y para publicar sus
instaladores cuando estén disponibles.

La página está escrita en HTML, CSS y JavaScript sin dependencias, sin paso de
compilación y sin peticiones a servicios externos. Se puede abrir directamente o
servir desde cualquier hosting estático (GitHub Pages, Netlify, Cloudflare Pages,
un servidor propio, etc.).

## Estado actual

- Producto: **LogiFlow Edu**, edición freeware con licencia propietaria.
- Plataformas previstas: **Windows 10/11 (64 bits)** y **macOS Apple silicon
  (arm64)**.
- **Los instaladores aún no están publicados.** La sección de descargas lo indica
  de forma explícita y los botones permanecen como «Próximamente».
- El contenido se basa en la documentación real del proyecto LogiFlow:
  25 figuras de instrucción, 17 ejemplos, Karel, tortuga, exportación SVG/PNG,
  pseudocódigo/Python, diagnósticos y herramientas de aula.

## Vista local

Puedes abrir `index.html` directamente en el navegador o servir la carpeta con
cualquier servidor estático de tu preferencia. Para previsualizar el tema oscuro
sin cambiar la preferencia guardada, añade `?theme=dark` a la URL.

En GitHub Pages, `404.html` se sirve automáticamente para las rutas inexistentes.
En otros hostings, configura el fallback a `404.html` si lo necesitas.

> No uses `pnpm`/`npm`: este sitio no tiene dependencias ni `package.json`.

## Estructura

```text
index.html                  Página principal
404.html                    Página de error con la marca del producto
manifest.webmanifest        Manifest del sitio (iconos y color de tema)
robots.txt                  Indexación abierta
.nojekyll                   Evita el procesamiento de Jekyll en GitHub Pages
assets/
  css/styles.css            Sistema de diseño, temas claro/oscuro y responsive
  js/releases.js            Configuración de descargas (único archivo a editar)
  js/main.js                Tema, menú, pestañas, descargas, detección de SO y reveal
  img/                      Ilustraciones, símbolos, iconos y og-image.png
```

Las ilustraciones (`interfaz.svg`, `anatomia-figura.svg`, `karel-mundo.svg`,
`tortuga-cuadrado.svg` y los símbolos) provienen del manual de LogiFlow, que las
genera desde el catálogo visual real de la aplicación. La ilustración de la
interfaz se ajustó para la portada y la de la tortuga reproduce el panel real
con sus controles, ejes, cuadrícula y trazo. Los iconos
(`app-icon.svg`, `app-icon-128.png`, `app-icon-32.png`, `favicon.svg`) provienen
de `src-tauri/icons` y del manual. Son recursos propios del producto, no
capturas de otros programas.

## Publicar los instaladores

Todo el estado de las descargas vive en **`assets/js/releases.js`**. Para
habilitar los botones:

1. Sube los instaladores a una carpeta accesible, por ejemplo `downloads/`, o a
   la página de releases del repositorio.
2. Edita el archivo:

```js
window.LOGIFLOW_RELEASES = {
  published: true,
  notesUrl: "downloads/notas.md", // opcional
  platforms: {
    windows: {
      label: "Windows",
      url: "downloads/LogiFlow-Edu-windows-x64-setup.exe",
      fileName: "LogiFlow-Edu-windows-x64-setup.exe",
      size: "4,2 MB", // opcional
      format: "Instalador MSI / EXE",
      requirement: "Windows 10 u 11 (64 bits)"
    },
    macos: {
      label: "macOS",
      url: "downloads/LogiFlow-Edu-macos-arm64.dmg",
      fileName: "LogiFlow-Edu-macos-arm64.dmg",
      size: "4,2 MB",
      format: "Imagen DMG",
      requirement: "Apple silicon (arm64)"
    }
  }
};
```

3. Guarda y recarga. La página:
   - activa el botón de cada plataforma con URL;
   - cambia «Próximamente» por «Descargar para Windows/macOS»;
   - muestra el aviso verde de «Descarga disponible»;
   - actualiza la insignia del héroe y el estado del pie;
   - añade el tamaño si lo indicas.

Si una plataforma aún no tiene URL, su botón sigue deshabilitado y el resto
funciona con normalidad.

> El interruptor actualiza banners, botones, insignias y los textos marcados con
> `data-release-*` (incluida la primera pregunta frecuente, el CTA final y la guía
> «Cómo empezar»). Revisa igualmente requisitos, tamaños, EULA y cualquier texto
> no marcado antes de publicar.

## Despliegue en GitHub Pages

1. Sube el contenido de este repositorio a la rama `main`.
2. En GitHub: **Settings → Pages → Build and deployment**.
3. Elige **Deploy from a branch**, rama `main` y carpeta `/ (root)`.
4. Guarda. El archivo `.nojekyll` ya está incluido para que los recursos se
   sirvan tal cual.

En Netlify/Cloudflare Pages, publica la raíz del repositorio sin comando de
build y sin directorio de salida.

`404.html` es autocontenido (estilos y marca incluidos) para que funcione aunque
la URL inexistente esté anidada. Su enlace de vuelta detecta un sitio de proyecto
de GitHub Pages (`usuario.github.io/App-LogiFlow/`). Si cambias el nombre del
repositorio, actualiza la constante `repo` al final de `404.html`.

## Antes de publicar: lista de comprobación

- [ ] Actualizar `assets/js/releases.js` (`published` y URLs reales).
- [ ] Revisar requisitos, tamaños, fechas y EULA en el texto visible.
- [ ] Probar el sitio en Windows y macOS, en tema claro y oscuro, con teclado.
- [ ] Probar el menú móvil, las pestañas de código y los enlaces de descarga.
- [ ] Verificar que `og-image.png`, `favicon.svg` y el manifest cargan.
- [ ] Cuando exista dominio, usar URL absoluta en `og:image`, `twitter:image`
      y añadir `link rel="canonical"` (hoy son rutas relativas porque no hay
      dominio definido).
- [ ] Revisar que no se anuncie una plataforma o función no verificada.

## Licencia y créditos

© 2026 LogiFlow Edu. Todos los derechos reservados. LogiFlow Edu se distribuirá
como freeware con licencia propietaria; el texto del EULA se publicará junto con
los instaladores. Los símbolos, ilustraciones y textos de esta página son
propios del producto.

