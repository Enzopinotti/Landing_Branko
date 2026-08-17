# Arquitectura inicial — CMS Branko Iriart

> Documento de planificación. No contiene implementación funcional.

## Objetivo

Convertir la landing de Branko en un sitio administrable sin alterar su identidad visual ni obligar al cliente a tocar código. La página pública y el panel deben consumir un único modelo de contenido, mientras Google Apps Script actúa solamente como backend/API y Google Sheets como persistencia liviana.

La solución se divide deliberadamente en dos repositorios:

1. `Enzopinotti/Landing_Branko`
   - Landing pública React/Vite.
   - Panel privado React en una entrada independiente `/admin/`.
   - Cliente de lectura/escritura contra Apps Script.
   - Fallback local del contenido para que la web no quede vacía si el CMS no responde.

2. `Enzopinotti/Landing_Branko_CMS` (nuevo repositorio, recomendado privado)
   - Código Google Apps Script administrado con `clasp`.
   - API pública de contenido.
   - API administrativa autenticada.
   - Acceso a Google Sheets.
   - Auditoría, caché, validaciones y setup inicial.
   - Nunca renderiza el panel React.

## Principios heredados de implementaciones anteriores

- Google Sheets es persistencia del CMS, no una base relacional general.
- Los registros usan UUID estables; nunca se usa el número de fila como identidad.
- Los secretos viven en `PropertiesService`, nunca en Sheets ni en el frontend.
- Las sesiones administrativas son temporales.
- Las escrituras se serializan con `LockService`.
- El contenido público se cachea con `CacheService`.
- Los cambios administrativos generan una entrada de auditoría.
- `clasp` es el flujo normal de desarrollo; el editor web de Apps Script no es la fuente de verdad.
- `.clasp.json`, `.clasprc.json`, tokens y secretos no se versionan.
- `clasp push` actualiza el proyecto, pero una versión publicada del Web App debe redeployarse explícitamente cuando corresponda.

## Flujo público

1. El usuario abre la landing.
2. La aplicación muestra inmediatamente el contenido local de respaldo.
3. El frontend solicita un único `bootstrap` al CMS.
4. Si el CMS responde correctamente, reemplaza/mezcla el contenido local con el contenido publicado.
5. Si Apps Script o Sheets fallan, la landing continúa funcionando con el último contenido incorporado al build.

Esto evita que una caída, cuota o error del CMS deje la web pública sin contenido.

## Flujo administrativo

1. Branko entra a `/admin/`.
2. Inicia sesión con una contraseña administrativa.
3. Apps Script valida la contraseña contra un hash + salt guardados en Script Properties.
4. Se crea una sesión temporal y se devuelve un token opaco.
5. El panel obtiene el workspace editable.
6. Branko modifica únicamente campos permitidos.
7. Apps Script valida, escribe en Sheets, registra auditoría e invalida la caché pública.
8. La landing recibe el contenido actualizado en la siguiente lectura del bootstrap.

## Transporte entre React y Apps Script

Apps Script se publicará como Web App con `doGet`/`doPost` y `ContentService`.

Como el panel y Apps Script viven en orígenes diferentes y Apps Script no debe depender de secretos en URLs, la implementación administrativa debe reutilizar el patrón ya probado en Fedes:

- POST para comandos administrativos.
- Token de sesión dentro del body, nunca en query params.
- `requestId` opaco para correlacionar la operación.
- recuperación del resultado mediante una lectura controlada/JSONP si el navegador no puede leer directamente la respuesta cross-origin.

El endpoint público `bootstrap` también debe admitir una forma de consumo compatible con hosting estático.

## Panel en hosting FTP

La landing actual no usa router. Para no depender de reglas especiales del servidor, el panel se planifica como una segunda entrada de Vite que genere físicamente:

`dist/admin/index.html`

Así `https://dominio/admin/` funciona aunque el hosting sea estático y no tenga fallback SPA configurado.

## Alcance funcional del panel v1

Editable por Branko:

- Textos principales de la landing.
- Tratamientos.
- Preguntas frecuentes.
- Datos de contacto.
- Ubicaciones.
- Testimonios.
- Métricas visibles.
- Enlaces/CTAs.
- Casos o textos de la sección Resultados que se definan para la versión final.

Fuera del panel v1:

- Cambios de layout o diseño.
- Crear secciones arbitrarias.
- Agenda/turnos.
- Campañas o CRM.
- Gestión de usuarios múltiples.
- Carga/edición avanzada de imágenes.

La sección adicional incluida en el presupuesto se diseña y carga una vez, pero no queda administrable salvo nueva definición de alcance.

## Recursos Google

### Spreadsheet

Nombre recomendado: `Branko Iriart · CMS`

Hojas previstas:

- `_System`
- `_AuditLog`
- `CMS_Settings`
- `CMS_Content`
- `CMS_Treatments`
- `CMS_Locations`
- `CMS_ResultCases`
- `CMS_Testimonials`
- `CMS_FAQs`

No se necesita Google Drive para el MVP si las imágenes permanecen estáticas en la landing.

## Seguridad mínima obligatoria

- Repositorio CMS privado.
- Contraseña hasheada + salt en Script Properties.
- Session token temporal en `CacheService`.
- Sin contraseña, tokens ni IDs sensibles versionados.
- Validación server-side de todos los campos editables.
- Lista explícita de acciones administrativas permitidas.
- Auditoría de login y modificaciones.
- Sanitización de URLs y textos antes de devolverlos al frontend.
- El panel nunca tiene permisos para ejecutar código ni modificar estructura del sitio.

## API conceptual

Pública:

- `health`
- `bootstrap`

Administrativa:

- `login`
- `logout`
- `workspace`
- `saveSettings`
- `saveContent`
- CRUD limitado de tratamientos
- CRUD limitado de ubicaciones
- CRUD limitado de casos/resultados
- CRUD limitado de testimonios
- CRUD limitado de FAQs
- `changePassword` (segunda etapa si hace falta)

No se definen todavía rutas ni payloads finales: primero debe cerrarse el modelo de contenido.

## Estrategia de publicación

### Landing

- `main` representa la versión publicable.
- Los cambios del CMS se desarrollan en branch.
- Se genera build completo incluyendo `/admin/`.
- Se sube por FTP al hosting ya contratado.

### Apps Script

- Desarrollo local con `clasp`.
- GitHub es la fuente de verdad del código.
- `clasp push` para sincronizar fuentes.
- versión + redeploy explícito para actualizar el Web App productivo.

## Repositorio nuevo recomendado

Nombre:

`Landing_Branko_CMS`

Visibilidad:

`Private`

Descripción:

`Backend CMS de la landing de Branko Iriart con Google Apps Script, Google Sheets y despliegue mediante clasp.`

No inicializar con código de ejemplo. Puede crearse vacío o solamente con README; la estructura se define después de aprobar este documento.

## Orden de implementación

1. Crear el repositorio `Landing_Branko_CMS`.
2. Crear el proyecto standalone de Apps Script con `clasp`.
3. Crear el Spreadsheet y guardar su ID en Script Properties.
4. Implementar schema + setup idempotente.
5. Implementar DB helpers, auditoría, validaciones y seguridad.
6. Implementar `health` y `bootstrap`.
7. Extraer en la landing un único contrato `SiteContent` y fallback local.
8. Conectar la landing pública al bootstrap.
9. Crear `/admin/` en React.
10. Implementar login y workspace.
11. Agregar edición por módulos.
12. Validar build FTP + Web App + fallback.
13. Cargar contenido definitivo de Branko.
14. Publicar y documentar recuperación/mantenimiento.

## Regla para comenzar código

No implementar archivos de Apps Script ni modificar componentes de la landing hasta cerrar el modelo de contenido y la responsabilidad exacta de cada hoja. Este documento es la base de esa decisión.
