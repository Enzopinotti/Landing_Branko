# CMS Branko Iriart — índice de documentación

Esta carpeta es la referencia obligatoria antes de implementar o modificar el CMS.

## Documentos

### `ARCHITECTURE.md`

Define:

- separación entre landing y backend;
- Apps Script como backend/API;
- React + SCSS para el panel;
- Google Sheets + Google Drive;
- login, sesiones y cambio de contraseña;
- estrategia de transporte sin dependencia de CORS REST tradicional;
- alcance v1.

### `CONTENT_MODEL.md`

Define:

- hojas/entidades;
- campos conceptuales;
- referencias `media_id`;
- bootstrap público;
- workspace administrativo;
- límites del modelo.

### `SECURITY_MEDIA_TRANSPORT.md`

Define:

- creación y cambio de contraseña;
- UX de campos sensibles y ojo mostrar/ocultar;
- sesiones;
- bridge HTTP;
- uploads;
- Drive;
- reglas de media;
- auditoría;
- pruebas obligatorias de CORS/auth/media.

### `IMPLEMENTATION_PLAN.md`

Divide el trabajo en bloques verificables, desde bootstrap de `clasp` hasta publicación final.

## Orden de lectura obligatorio

1. `ARCHITECTURE.md`
2. `CONTENT_MODEL.md`
3. `SECURITY_MEDIA_TRANSPORT.md`
4. `IMPLEMENTATION_PLAN.md`

## Regla de mantenimiento

Si durante la implementación aparece una decisión nueva de arquitectura, seguridad, media, transporte o alcance:

1. primero se documenta en el archivo correspondiente;
2. luego se implementa;
3. el commit debe mencionar la decisión cuando cambie comportamiento relevante.

No debe existir comportamiento crítico que sólo viva en el conocimiento de quien lo implementó.

## Estado actual

- arquitectura: definida;
- modelo de contenido: preliminar, pendiente de mapear contenido definitivo de Branko;
- imágenes: incluidas en CMS v1;
- autenticación: incluida en CMS v1;
- cambio de contraseña desde panel: incluido en CMS v1;
- transporte cross-origin: patrón definido, pendiente de prueba real durante implementación;
- código funcional del CMS: todavía no iniciado deliberadamente.
