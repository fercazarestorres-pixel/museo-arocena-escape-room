# Landing del escape room del Museo Arocena

Abre `public/index.html` para probarla sin conexión. Para servir la misma página por HTTP desde esta carpeta, ejecuta `python3 -m http.server 8000 --directory public` y abre `http://localhost:8000`.

## Cómo usa Supabase

Al abrirse por HTTP o HTTPS, la página consulta la tabla `public.arocena_fichas` mediante la Data API. Los años y los códigos devueltos determinan las fichas visibles, la ayuda y la respuesta correcta. El navegador usa una clave publicable. La tabla tiene seguridad por fila y concede al visitante acceso de lectura. Los intentos del acertijo se comprueban en el navegador.

Las tres fichas incluidas en el HTML permiten jugar al abrir el archivo local o si la consulta remota falla. En este último caso aparece un aviso junto al acertijo. La migración de la base de datos se encuentra en `supabase/migrations/`.

## Publicación en Vercel

Usa `landing` como directorio raíz del proyecto y `public` como directorio de salida. Es un sitio estático que se publica directamente con sus archivos HTML, CSS, JavaScript e ilustraciones.
