/*
 * Configuración de descargas de LogiFlow Edu
 * ------------------------------------------
 * Este es el único archivo que hay que editar para publicar los instaladores.
 *
 * 1. Sube los instaladores a una carpeta accesible (por ejemplo, `downloads/`
 *    dentro de este sitio o la página de releases del repositorio).
 * 2. Escribe la URL de cada plataforma en `platforms.<clave>.url`.
 * 3. Cambia `published` a `true` cuando al menos un instalador esté listo.
 * 4. Opcional: rellena `fileName`, `size` y `notesUrl` para mostrar más datos.
 *
 * La página activa los botones, cambia las etiquetas de estado y muestra el
 * aviso de "Descarga disponible" automáticamente. Si una plataforma no tiene
 * URL, su botón permanece como "Próximamente".
 *
 * Nota: al publicar, revisa los requisitos, tamaños y el EULA. La página
 * actualiza automáticamente los avisos, botones, insignias y los textos
 * marcados con `data-release-*`.
 */
window.LOGIFLOW_RELEASES = {
  published: false,
  notesUrl: "",
  platforms: {
    windows: {
      label: "Windows",
      url: "",
      fileName: "",
      size: "",
      format: "Instalador MSI / EXE",
      requirement: "Windows 10 u 11 (64 bits)"
    },
    macos: {
      label: "macOS",
      url: "",
      fileName: "",
      size: "",
      format: "Imagen DMG",
      requirement: "Apple silicon (arm64)"
    }
  }
};
