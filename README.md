# blog

Página personal hecha con [Eleventy](https://www.11ty.dev/), con fondo en capas que reaccionan al mouse (parallax).

```sh
npm install
npm start      # servidor local
npm run build  # genera _site/
```

- `src/posts/`: entradas del blog (Markdown).
- `src/_data/backdrop.js`: capas del fondo y su profundidad.
- `src/_data/site.json`: menú y tags.
- Un post puede tener su propio CSS/JS con `{% css %}` / `{% js %}` (ver `volver-a-teselia.md`).
