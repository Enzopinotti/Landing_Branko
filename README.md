# Branko Iriart — Landing + CMS administrable

Sitio público para el Dr. Branko Iriart con una experiencia editorial responsive y un panel privado `/admin` para gestionar contenido sin modificar el frontend manualmente.

## Producto

El repositorio combina dos superficies que se construyen juntas:

```text
/
└─ landing pública
   ├─ hero
   ├─ tratamientos
   ├─ about
   ├─ resultados
   ├─ testimonios
   ├─ contacto / FAQ
   └─ SEO dinámico

/admin/
└─ panel privado
   ├─ autenticación / sesión
   ├─ textos y configuración
   ├─ tratamientos
   ├─ resultados antes/después
   ├─ testimonios
   ├─ ubicaciones / FAQ
   ├─ biblioteca de imágenes
   ├─ auditoría
   └─ seguridad
```

El primer render público mantiene contenido local de fallback y no depende de que el CMS remoto esté disponible para mostrar una landing utilizable.

## Arquitectura

- **Frontend**: React 18 + TypeScript + Vite.
- **Estilos**: SCSS Modules + Tailwind utilities donde corresponde.
- **Motion**: Framer Motion, GSAP y Lenis.
- **CMS**: panel React servido desde `/admin/`.
- **Backend CMS**: Google Apps Script.
- **Persistencia**: Google Sheets.
- **Media**: Google Drive + relaciones reutilizables de media.
- **Build**: una única configuración `vite.config.ts` con entradas para landing y admin.

## CMS y contenido

El panel permite administrar las colecciones y superficies que la landing consume. Entre los contratos principales:

- estados publicado / borrador / archivado;
- restauración de registros;
- reutilización de imágenes desde biblioteca;
- slots Antes/Después para resultados;
- portada + galería para tratamientos;
- fallback local en la landing cuando el contenido remoto no está disponible;
- datos médicos opcionales sólo se muestran cuando fueron cargados/validados, sin inventar placeholders clínicos.

## SEO

La rama CMS incluye:

- favicon compartido por landing y admin;
- `noindex,nofollow` para `/admin/`;
- title y meta description;
- Open Graph / Twitter metadata;
- `robots.txt` excluyendo `/admin/`;
- canonical condicionado al host público;
- JSON-LD `WebSite` + `LocalBusiness` alimentado por contenido disponible;
- `alt` descriptivo para imágenes contextuales.

El sitemap/canonical definitivo depende de confirmar el dominio productivo durante rollout.

## Quality gate

GitHub Actions valida el contrato reproducible del frontend:

```bash
npm ci
npm run type-check
npm run build
```

El workflow actual está verde sobre la rama CMS. Esto demuestra que TypeScript y el build multi-entry landing/admin pasan; no se presentan métricas de rendimiento, accesibilidad o FPS como garantías sin medición específica.

## Desarrollo

```bash
npm ci
npm run dev
```

Comandos principales:

- `npm run dev` — servidor Vite de desarrollo.
- `npm run type-check` — `tsc --noEmit`.
- `npm run build` — build de producción para landing + admin.
- `npm run preview` — previsualización local del build.

## Rollout pendiente

Antes del merge/publicación final del circuito CMS:

1. desplegar la versión correspondiente del backend Apps Script;
2. ejecutar el setup/migración idempotente de estructura CMS;
3. correr smoke de landing, admin y operaciones de gestión;
4. realizar QA visual en `/` y `/admin/`;
5. cargar contenido/fotos definitivas aprobadas;
6. completar datos médicos únicamente con información validada por el cliente;
7. confirmar dominio productivo y cerrar canonical/sitemap si aplica.

Estos pasos son de rollout/QA, no checks que CI pueda sustituir.

## Criterio de calidad

Este repositorio evita afirmaciones absolutas del tipo “60fps”, “accesibilidad garantizada” o “optimización total” sin medición. La evidencia pública se centra en contratos que sí podemos verificar: TypeScript, build, estructura administrable, fallback y comportamiento de integración documentado.
