# PROA Arquitectura — demo web estática

Landing page profesional creada con HTML, CSS y JavaScript puro. No necesita instalación ni compilación.

## Cómo verla

1. Descomprime el archivo ZIP.
2. Abre `index.html` en el navegador.
3. Para probarla como un sitio real, sirve la carpeta con cualquier servidor local, por ejemplo `python -m http.server 8000`.

## Incluye

- Landing responsive con cabecera, hero, servicios, administradores, proyectos, proceso, FAQ y contacto.
- Mapa de Google Maps con la ubicación del despacho.
- Asistente flotante que abre WhatsApp en el número `+34 692 60 18 49`.
- Formulario estático que valida los datos y prepara un correo a `administracio@proarquitectura.cat`.
- Blog con índice y tres artículos SEO completos.
- Metadatos SEO, Open Graph, datos estructurados, `robots.txt` y `sitemap.xml`.
- Páginas de aviso legal y privacidad en formato borrador.
- Página 404.

## Antes de publicar

- Sustituir las imágenes remotas de Unsplash por fotografías reales y optimizadas en WebP/AVIF.
- Sustituir los tres proyectos de demostración por obras reales de PROA.
- Confirmar que el dominio definitivo es `https://www.proarquitectura.cat/`; si cambia, actualizar canonical, Open Graph, JSON-LD, sitemap y robots.
- Conectar el formulario a un backend, Formspree, Brevo, HubSpot, n8n u otro sistema real. Actualmente abre el cliente de correo del visitante.
- Revisar y aprobar los textos legales y la política de cookies según las herramientas finalmente instaladas.
- Confirmar teléfonos, email, domicilio y horarios.
- Añadir analítica y consentimiento solo después de definir la política de cookies.

## Estructura

- `index.html`: landing principal.
- `assets/css/styles.css`: estilos.
- `assets/js/main.js`: navegación, animaciones, FAQ, formulario y WhatsApp.
- `blog/`: índice y artículos.
- `assets/images/`: logo, favicon visual, Open Graph y fallback local.

