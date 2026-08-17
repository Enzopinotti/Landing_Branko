# Arquitectura — CMS Branko Iriart

> Documento rector de planificación. No contiene implementación funcional.

## 1. Objetivo

Convertir la landing de Branko en un sitio administrable sin transformar el panel en un constructor de páginas ni mezclar responsabilidades.

La premisa principal es:

**el CMS de Google Apps Script funciona como backend de la landing y del panel.**

Apps Script gestiona datos, autenticación, sesiones, imágenes, validaciones, auditoría y persistencia. React gestiona toda la experiencia visual.

## 2. Dos repositorios, responsabilidades claras

### `Enzopinotti/Landing_Branko`

Responsabilidades:

- landing pública React/Vite;
- panel privado React;
- SCSS y design system visual;
- componentes y UX;
- cliente HTTP/bridge hacia Apps Script;
- fallback local del contenido público;
- build final para hosting FTP.

El panel vive en este repositorio y debe verse como una extensión natural de la landing: misma identidad dark/gold, mismas tipografías, ritmo visual, estados, botones y lenguaje de interfaz.

### `Enzopinotti/Landing_Branko_CMS`

Repositorio nuevo recomendado como `private`.

Responsabilidades:

- Google Apps Script administrado mediante `clasp`;
- API pública de contenido;
- API administrativa autenticada;
- Google Sheets como persistencia de contenido;
- Google Drive como almacenamiento de imágenes administrables;
- autenticación y sesiones;
- setup inicial;
- validaciones;
- auditoría;
- caché;
- versionado y despliegue del Web App.

Apps Script **no renderiza HTML del panel** y no contiene estilos de la interfaz.

## 3. Principios heredados de implementaciones anteriores

- Google Sheets funciona como persistencia de este CMS, no como una base relacional genérica.
- Cada entidad usa UUID estable; nunca se usa el número de fila como identidad.
- Los secretos viven en `PropertiesService`, nunca en Sheets ni en el frontend.
- Las sesiones administrativas son temporales.
- Las escrituras se protegen con `LockService`.
- El contenido público se cachea con `CacheService`.
- Toda modificación administrativa relevante genera auditoría.
- `clasp` es el flujo normal de desarrollo del backend.
- GitHub es la fuente de verdad del código de Apps Script.
- `.clasp.json`, `.clasprc.json`, tokens y secretos no se versionan.
- una actualización mediante `clasp push` y una actualización del deployment productivo son conceptos distintos y deben documentarse.
- ningún cambio visual o de layout puede ejecutarse desde el CMS.

## 4. Flujo público

1. El usuario abre la landing.
2. React dispone de un `defaultContent` local compatible con el contrato del CMS.
3. El frontend solicita un único `bootstrap` público.
4. Si el CMS responde, el contenido publicado reemplaza/mezcla el fallback.
5. Si Apps Script, Sheets o Drive tienen una falla temporal, la landing conserva una versión utilizable mediante fallback.

La disponibilidad de la web pública no debe depender exclusivamente de que Apps Script responda en ese instante.

## 5. Panel administrativo

El panel será React + TypeScript + SCSS dentro de `Landing_Branko`.

### Entrada

Se planifica como una segunda entrada física de Vite:

`dist/admin/index.html`

Esto permite publicar `/admin/` en un hosting estático/FTP sin depender de reglas SPA o rewrites del servidor.

### Identidad visual

El panel debe reutilizar el lenguaje visual de la landing:

- dark background;
- dorado de marca;
- tipografías existentes;
- superficies, bordes y estados coherentes;
- responsive desktop/tablet/mobile;
- animaciones sutiles, no decorativas en exceso;
- feedback claro de guardado, carga, error y éxito.

No se diseña un dashboard genérico ajeno a la marca.

## 6. Login y contraseña

Existe una única cuenta administrativa en v1.

### Contraseña inicial

La primera contraseña se crea desde el backend de Apps Script durante el setup o mediante una función administrativa ejecutada explícitamente.

Nunca se escribe en código versionado ni en Sheets.

El backend guarda únicamente:

- hash;
- salt;

ambos gestionados mediante `PropertiesService`.

### Login

El formulario incluye:

- contraseña;
- botón entrar;
- control de mostrar/ocultar contraseña mediante icono de ojo;
- estado de carga;
- error de credenciales sin filtrar información interna.

El ojo sólo cambia la presentación del input; no altera el tratamiento seguro del valor.

### Sesión

Tras un login correcto:

- Apps Script emite un token opaco;
- la sesión tiene vencimiento;
- la sesión se valida en cada operación administrativa;
- logout invalida la sesión;
- una sesión vencida devuelve al login.

### Cambio de contraseña desde el panel

Forma parte de v1.

Branko debe poder ir a Seguridad / Cambiar contraseña e ingresar:

- contraseña actual;
- nueva contraseña;
- repetir nueva contraseña.

Los tres inputs tienen mostrar/ocultar con ojo.

El frontend valida coincidencia y requisitos básicos; Apps Script vuelve a validar todo server-side.

El backend sólo cambia la contraseña si la actual es correcta. Luego reemplaza hash + salt y registra la operación en auditoría.

Nunca se devuelve ni se puede recuperar la contraseña existente.

## 7. Imágenes y biblioteca de medios

Google Drive sí forma parte del CMS v1.

El panel podrá tener inputs de imagen en distintos módulos. No se acoplará la subida directamente a una sección específica: se implementará una capa de medios reutilizable.

Flujo conceptual:

1. Branko selecciona una imagen.
2. React valida preliminarmente tipo y tamaño.
3. El archivo se envía autenticado al backend.
4. Apps Script vuelve a validar tipo, tamaño y contenido recibido.
5. Drive guarda el archivo dentro de una carpeta exclusiva del CMS.
6. Apps Script verifica que el archivo pueda usarse en la web pública.
7. Se crea un registro en `CMS_Media`.
8. El backend devuelve `media_id` + URL pública + metadata.
9. El contenido referencia el `media_id`; no se guarda base64 en Sheets.

### Reglas mínimas de media

- sólo imágenes en v1;
- MIME permitido mediante allowlist;
- límite máximo de peso;
- nombre normalizado;
- UUID/`media_id` independiente del ID de Drive;
- `file_id` de Drive sólo se maneja desde backend/admin;
- `alt_text` editable;
- tamaño y MIME persistidos;
- relación opcional `entity_type` / `entity_id`;
- posibilidad de reutilizar una imagen;
- auditoría de uploads y cambios;
- no almacenar blobs/base64 en Sheets.

La UX del input debe incluir preview, reemplazar imagen, quitar selección y errores entendibles.

## 8. Transporte React ↔ Apps Script y CORS

Este punto es requisito arquitectónico, no un detalle posterior.

El navegador no debe depender de que Apps Script se comporte como una API REST tradicional con headers CORS personalizados.

Se reutilizará el patrón ya probado:

### Lecturas públicas

- endpoint `bootstrap` compatible con consumo desde hosting estático;
- soporte JSON/JSONP controlado según la implementación final;
- callback validado estrictamente si se usa JSONP;
- ningún secreto en el endpoint público.

### Escrituras y operaciones admin

- `POST` hacia el Web App;
- token de sesión dentro del body, nunca en query params;
- envío compatible con `no-cors` cuando sea necesario;
- `requestId` opaco por operación;
- `clientSecret` efímero por operación;
- Apps Script procesa y guarda temporalmente el resultado en `CacheService`;
- React recupera ese resultado mediante un endpoint de resultado controlado;
- la respuesta se consume una sola vez y expira rápidamente.

Esto evita bloquear el panel por preflight/CORS y evita poner la sesión administrativa en una URL.

El transporte definitivo se implementa una sola vez como cliente reutilizable; los módulos del panel no conocen los detalles del bridge.

## 9. Datos administrables en v1

- textos principales;
- tratamientos;
- FAQs;
- datos de contacto;
- ubicaciones;
- testimonios;
- métricas visibles;
- enlaces y CTAs;
- casos/resultados;
- imágenes definidas como administrables en cada módulo;
- contraseña administrativa.

## 10. Fuera del CMS v1

- rediseñar layouts;
- elegir colores o tipografías;
- crear componentes visuales arbitrarios;
- modificar animaciones;
- editar código;
- ejecutar scripts desde el panel;
- agenda/turnos;
- CRM;
- campañas;
- usuarios múltiples/roles;
- video administrable salvo ampliación explícita;
- edición gráfica de imágenes.

La sección adicional incluida comercialmente se diseña/carga una vez y no pasa a ser administrable salvo decisión posterior.

## 11. Recursos Google

### Spreadsheet

Nombre recomendado:

`Branko Iriart · CMS`

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
- `CMS_Media`

### Drive

Carpeta recomendada:

`Branko Iriart · CMS Media`

Su ID queda en Script Properties.

No debe dependerse de buscar carpetas por nombre en cada request.

## 12. Seguridad mínima obligatoria

- repositorio CMS privado;
- contraseña nunca persistida en claro;
- hash + salt en Script Properties;
- verificación de contraseña actual para cambiarla;
- token de sesión temporal;
- token administrativo nunca en query string;
- secretos efímeros para el bridge HTTP;
- validación server-side de todos los payloads;
- allowlist de operaciones y campos;
- allowlist de MIME de imágenes;
- límites de tamaño;
- sanitización de texto y URLs;
- `LockService` para escrituras;
- auditoría de login, cambios, uploads y cambio de contraseña;
- errores públicos sin stack traces ni detalles internos;
- invalidación de caché tras cambios;
- ningún secreto versionado.

## 13. API conceptual

### Pública

- `health`
- `bootstrap`

### Administrativa

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
- `uploadMedia`
- operaciones de media permitidas
- `changePassword`

No se congelan todavía nombres de rutas ni payloads concretos; primero se cierra el schema.

## 14. Estrategia de publicación

### Landing

- `main` representa la versión publicable;
- desarrollo del CMS/panel en ramas específicas;
- build completo incluye landing + `/admin/`;
- publicación por FTP.

### Apps Script

- desarrollo local con `clasp`;
- GitHub como fuente de verdad;
- setup inicial explícito;
- `clasp push` para sincronizar código;
- versionado/deploy explícito del Web App;
- Script Properties para IDs y secretos.

## 15. Repositorio nuevo recomendado

Nombre:

`Landing_Branko_CMS`

Visibilidad:

`Private`

Descripción:

`Backend CMS de la landing de Branko Iriart con Google Apps Script, Google Sheets, Google Drive y despliegue mediante clasp.`

## 16. Regla para comenzar código

No implementar todavía archivos funcionales de Apps Script ni modificar los componentes productivos de la landing hasta cerrar:

1. modelo de contenido;
2. modelo de media;
3. seguridad;
4. contrato de transporte;
5. roadmap por bloques.

Esos documentos conforman la especificación inicial del CMS.
