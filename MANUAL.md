# Manual de pablosabater.dev

Todo lo que necesitas para escribir y mantener el sitio. Este archivo vive en la raíz del repositorio y no se publica en la web.

---

## 1. Lo básico

### Preparar el ordenador (solo la primera vez)

```sh
brew install hugo
git clone https://github.com/pabloosabaterr/gsoc-blog
cd gsoc-blog
```

### Ver el sitio mientras escribes

```sh
hugo server -D
```

Abre <http://localhost:1313>. La página se recarga sola cada vez que guardas. El `-D` muestra también los borradores.

### Publicar

```sh
git add .
git commit -m "Lo que hayas cambiado"
git push
```

En menos de un minuto está en la web. Si algo falla, mira la pestaña **Actions** del repositorio en GitHub: el último build saldrá en rojo con el error.

El sitio también se reconstruye solo cada mañana, para que los datos de GitHub de los proyectos estén al día.

---

## 2. Crear un post

Hay dos secciones para escribir:

- **Writing** (`content/posts/`): programación, open source, proyectos.
- **Life** (`content/life/`): todo lo que no es código. Erasmus, viajes, personas, lo que estés viviendo.

Las dos usan el mismo diseño de lectura. En la home salen por separado, y Life tiene su propia entrada en el menú, que aparece sola en cuanto publicas el primer post de Life.

### Writing

```sh
hugo new posts/mi-post/index.md
```

- El nombre de la carpeta es la URL: `pablosabater.dev/posts/mi-post/`.
- Usa una carpeta (`mi-post/index.md`) si el post lleva imágenes: las imágenes van dentro de esa carpeta.
- Si no lleva imágenes, también vale un archivo suelto: `hugo new posts/mi-post.md`.

### Life

```sh
hugo new life/mi-post/index.md
```

Sale en `pablosabater.dev/life/mi-post/`. Funciona igual que un post de Writing: mismas cabeceras, imágenes, notas, círculos… La única diferencia es que no se asigna a proyectos. Tienes un borrador empezado en `content/life/studying-at-nova/index.md`.

En los dos casos, el post se crea como borrador (`draft = true`). **No se publica hasta que lo cambies a `draft = false`**, aunque hagas push.

---

## 3. Front matter: las opciones de la cabecera

La cabecera es lo que va entre los `+++` al principio del archivo. Todo es opcional salvo `title` y `date`.

```toml
+++
title = 'Orn: a language where every type is a range'
date = 2026-10-07T19:00:00+01:00
draft = false
description = 'Una frase para buscadores y para la tarjeta al compartir.'
tags = ['orn', 'compilers']
projects = ['Orn']
epigraph = 'Poco a poco se anda lejos'
epigraph_translation = 'Little by little, one goes far.'
toc = false
image = 'portada.jpg'
+++
```

| Campo | Qué hace |
| --- | --- |
| `title` | Título del post. Sale en rojo con la letra de los títulos. |
| `date` | Fecha del post. **Si la pones en el futuro, el post no aparece** hasta ese día. |
| `draft` | `true` = borrador, no se publica. `false` = se publica. |
| `description` | Resumen de una frase. Si lo dejas vacío, se usa el principio del post. |
| `tags` | Etiquetas en minúscula, de 1 a 3. Cada una tiene su página: `/tags/orn/`. |
| `projects` | Solo en Writing. Proyectos a los que pertenece el post. Usa el título exacto del proyecto: `['Orn']`, `['Git']`. Puede estar en varios. |
| `epigraph` | El refrán que sale arriba, en rojo y en cursiva. Sin punto final, lo pone el sitio. |
| `epigraph_translation` | Traducción del refrán, debajo en gris. |
| `toc` | El índice (“Contents”) sale solo si el post tiene 2 o más secciones `##`. Pon `toc = false` para quitarlo en un post concreto. |
| `image` | Imagen propia para cuando se comparte el enlace. Si no la pones, se genera una tarjeta automática con el título. |

---

## 4. Escribir el texto

### Títulos de sección

```md
## Sección principal
### Subsección
```

- `##` y `###` salen en granate y negrita.
- Aparecen en el índice lateral. Las subsecciones se despliegan al llegar a su sección.
- Al pasar el ratón por un título sale un `§` que sirve para copiar el enlace a esa sección.
- No uses `#` (un solo almohadilla): ese es el título del post y ya lo pone el sitio.

### Énfasis y anotaciones

| Escribes | Resultado |
| --- | --- |
| `*cursiva*` | *cursiva* |
| `**negrita**` | **negrita** |
| `==texto==` | Subrayado de rotulador rojo. |
| `~~texto~~` | Tachado con una raya roja. |
| `{{</* circle */>}}palabra{{</* /circle */>}}` | Círculo rojo dibujado a mano alrededor de la palabra. Se dibuja solo al llegar con el scroll. |
| `` `código` `` | Código dentro de una frase. |

> Nota: en este manual los shortcodes aparecen como `{{</* circle */>}}` para que GitHub no los procese. **En tus posts escríbelos sin `/*` ni `*/`**: `{{< circle >}}palabra{{< /circle >}}`.

### Notas al margen

```md
Orn has no built-in types{{< note >}}Not even `bool`: it's `0..1`.{{< /note >}} at all.
```

- Escribe la nota pegada a la palabra a la que se refiere, sin espacio delante.
- En pantalla ancha sale en el margen izquierdo, numerada en rojo. En móvil sale debajo de la frase.
- Dentro de la nota puedes usar Markdown: cursiva, código, enlaces.
- También funcionan las notas al pie normales de Markdown (`texto[^1]` y abajo `[^1]: la nota`), que salen al final del post. Para notas cortas, mejor `note`.

### Enlaces

```md
[texto](https://ejemplo.com)            enlace externo
[mi post sobre Orn](/posts/orn/)        enlace a otro post tuyo
[Orn](/projects/orn/)                   enlace a un proyecto
```

Los enlaces a tus propios posts y proyectos muestran una tarjetita con título, fecha y primera frase al pasar el ratón. Funciona sola, solo tienes que enlazar con la ruta que empieza por `/posts/` o `/projects/`.

### Citas, listas, tablas y separadores

```md
> Una cita sale con una barra roja suave a la izquierda.

- lista
- con puntos

1. lista
2. numerada

| Columna | Otra |
| --- | --- |
| dato | dato |

---
```

`---` en una línea sola se convierte en el adorno ⁂.

---

## 5. Imágenes y código

### Imágenes

```md
![Descripción de lo que se ve, para lectores de pantalla](foto.jpg "Pie de foto opcional")
```

- El archivo va en la carpeta del post.
- Lo que va entre `[ ]` es el texto alternativo: describe la imagen. No se ve, pero es importante.
- Lo que va entre comillas es el pie de foto, que sale debajo en cursiva. Si no lo pones, no hay pie.
- Las imágenes se reducen y se convierten a WebP solas al publicar: sube las fotos tal cual, aunque pesen mucho.
- Las horizontales salen algo más anchas que el texto. Las verticales salen centradas y más estrechas.
- Al pulsar cualquier imagen se amplía. Se cierra con un clic o con Esc.

### Código

````md
```c
int main(void) { return 0; }
```
````

- Pon el lenguaje después de las tres comillas (`c`, `go`, `python`, `sh`, `asm`, `diff`…) para tener colores.
- Para **Orn** no pongas lenguaje (o pon `text`): no hay resaltado para Orn.
- Para mostrar el nombre del archivo encima del bloque:

````md
```c {file="parser.c"}
static int parse_stmt(struct parser *p);
```
````

- Todos los bloques tienen un botón **Copy** que aparece al pasar el ratón.

---

## 6. Varias fotos juntas

En cualquier post, de Writing o de Life, puedes poner fotos en cuadrícula:

```md
{{</* gallery */>}}
![Descripción](foto1.jpg "Pie")
![Descripción](foto2.jpg "Pie")
![Descripción](foto3.jpg)
{{</* /gallery */>}}
```

(En tus posts, sin `/*` ni `*/`.)

- Una foto por línea dentro de la galería.
- Con 2 fotos salen en 2 columnas; con 3, en 3 columnas en pantalla ancha.
- En la galería las fotos se recortan a la misma proporción; al pulsarlas se ven enteras.

---

## 7. Proyectos

### Crear un proyecto

Crea `content/projects/<nombre>/_index.md`. La carpeta es el nombre en minúsculas y con guiones: para `'My Tool'`, la carpeta es `my-tool`.

```toml
+++
title = 'Orn'
description = 'Una frase para buscadores.'
summary = 'Una frase para la lista de proyectos.'
status = 'Active'
year = 2026
weight = 1
github = 'pabloosabaterr/Orn-rework'
[[links]]
  name = 'Repository'
  url = 'https://github.com/pabloosabaterr/Orn-rework'
[[links]]
  name = 'Orn Book'
  url = 'https://pabloosabaterr.github.io/Orn-rework/'
+++

Descripción del proyecto en Markdown. Puede llevar código, enlaces, etc.
```

| Campo | Qué hace |
| --- | --- |
| `title` | Nombre del proyecto. Es lo que pones en `projects = [...]` de los posts. |
| `summary` | Frase que sale en `/projects/`. |
| `status` | `Active` (punto rojo que late), `Finished` o `Paused` (en gris). |
| `year` | Año, sale junto al estado. Opcional. |
| `weight` | Orden en la lista: el número más bajo sale primero. |
| `github` | `usuario/repo`. Muestra último commit, commits del último año y barras por semana. Se actualiza cada mañana. |
| `links` | Enlaces que salen junto al estado. Puedes poner los que quieras. |

### Asignar posts a un proyecto

En cada post: `projects = ['Orn']`. El post aparece en la *playlist* del proyecto, numerado en orden de fecha. Al final del post sale la playlist con el post actual marcado, y Previous/Next avanzan dentro del proyecto.

Los proyectos salen también en la home, encima de “Recent writing”.

---

## 8. Home, About y datos generales

| Qué | Dónde |
| --- | --- |
| Presentación de la home (“Hi, I'm Pablo…”) | `content/_index.md` |
| Línea **Currently** | `hugo.toml`, parámetro `now`. Admite Markdown (enlaces). |
| Número de posts en “Recent writing” | `hugo.toml`, `recentPosts` |
| Email, GitHub, LinkedIn del pie | `hugo.toml`, `email`, `github`, `linkedin` |
| Página About | `content/about.md` |
| Foto de About | `assets/me.jpg` (se recorta cuadrada sola) |
| Texto de Writing, Life y Projects | `content/posts/_index.md`, `content/life/_index.md`, `content/projects/_index.md` |
| Página 404 | `layouts/404.html` |

En la home, “Pablo” sale en rojo porque está escrito como `<span class="name">Pablo</span>`. Puedes usar `==texto==` en la presentación para el subrayado de rotulador.

---

## 9. Cosas que pasan solas

- **Índice lateral** en posts con 2 o más secciones, con la sección actual marcada.
- **Barra de lectura** roja arriba en los posts (Chrome, Edge y Safari recientes).
- **Tarjeta para compartir** de cada post, proyecto y página, con su título.
- **Reply by email** al final de cada post, con el título como asunto.
- **Edit this page on GitHub**, para que te avisen de erratas.
- **RSS** en `/index.xml` (no está enlazado, pero funciona para quien lo use), **sitemap** y **robots.txt**.
- **Datos de GitHub** de los proyectos, actualizados cada mañana.

---

## 10. Si algo no sale

| Problema | Causa probable |
| --- | --- |
| El post no aparece en la web | `draft = true`, o la `date` está en el futuro. |
| La imagen no se ve | El archivo no está en la carpeta del post, o el nombre no coincide (mayúsculas incluidas). |
| El post no sale en un proyecto | El nombre en `projects = [...]` no coincide con el `title` del proyecto. |
| No sale el índice | El post tiene menos de 2 secciones `##`, o tiene `toc = false`. |
| No salen los datos de GitHub | El repo es privado o la API falló ese día; se reintenta en el build de la mañana siguiente. |
| El shortcode sale como texto | Revisa que sea `{{< note >}}…{{< /note >}}`, con `<` y `>`, y sin `/* */`. |
| El build falla | Mira el error en **Actions** en GitHub. Suele ser un `+++` mal cerrado o unas comillas sin cerrar en la cabecera. |

---

## 11. Dónde está cada cosa (por si quieres tocar el diseño)

```text
content/        textos: posts, life, proyectos, about, home
layouts/        plantillas HTML
assets/css/     main.css: colores, tipografía, todo el estilo
assets/js/      scripts pequeños: índice, copiar, ampliar, tarjetas de enlaces
static/fonts/   tipografías (Source Serif 4, IBM Plex Mono, Fraunces)
archetypes/     plantillas que usa `hugo new` (default.md y life.md)
hugo.toml       configuración y datos generales
```

Los colores están al principio de `assets/css/main.css`:

```text
--bg      #F6F0E4   papel
--fg      #2B2620   tinta
--muted   #6E655A   gris
--accent  #A4402A   terracota (enlaces, etiquetas)
--heading #8A2A1E   granate (títulos de sección)
--title   #A4402A   títulos grandes
```
