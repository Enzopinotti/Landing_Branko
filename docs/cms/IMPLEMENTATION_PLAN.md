# Plan de implementación por bloques — CMS Branko Iriart

> Este documento define el orden de trabajo. Un bloque debe quedar cerrado y verificable antes de ampliar el alcance del siguiente.

## Regla general

No implementar todo el CMS de una vez.

Cada bloque debe:

1. tener un objetivo único;
2. tocar sólo el/los repos necesarios;
3. incluir validación real;
4. documentar decisiones nuevas;
5. dejar el sistema en estado utilizable;
6. evitar mezclar mejoras visuales no relacionadas.

---

## Bloque 0 — Arquitectura y alcance

**Estado:** documentado.

Objetivo:

- definir responsabilidades de los dos repos;
- cerrar rol de Apps Script como backend;
- cerrar React + SCSS para panel;
- definir Sheets + Drive;
- definir auth, media y estrategia anti-CORS;
- definir modelo de contenido preliminar.

Definition of Done:

- `ARCHITECTURE.md`;
- `CONTENT_MODEL.md`;
- `SECURITY_MEDIA_TRANSPORT.md`;
- este roadmap.

No incluye código funcional.

---

## Bloque 1 — Bootstrap del repositorio CMS

**Repo:** `Landing_Branko_CMS`

Objetivo:

Tener el proyecto Apps Script correctamente versionado y controlable desde consola.

Incluye:

- crear repo privado;
- clonar localmente;
- instalar/verificar `clasp`;
- login de `clasp`;
- crear o vincular proyecto standalone de Apps Script;
- `.clasp.json` local/no versionado según estrategia final;
- `.gitignore` correcto;
- `appsscript.json` mínimo;
- README de instalación;
- estructura inicial de archivos vacíos/organizativos sólo si es necesaria.

Definition of Done:

- `clasp pull` y `clasp push` funcionan;
- repo no contiene secretos;
- proyecto Apps Script correcto identificado;
- no existe lógica de negocio todavía.

---

## Bloque 2 — Recursos Google + schema + setup

**Repo:** CMS

Objetivo:

Crear de forma reproducible la persistencia del sistema.

Incluye:

- Spreadsheet `Branko Iriart · CMS`;
- carpeta Drive `Branko Iriart · CMS Media`;
- IDs guardados en Script Properties;
- definición central del schema;
- creación/verificación de hojas;
- headers;
- `_System`;
- `_AuditLog`;
- setup idempotente;
- schema version.

Definition of Done:

- una instalación nueva puede inicializarse con un procedimiento documentado;
- ejecutar setup dos veces no destruye datos;
- hojas y carpeta quedan vinculadas por ID;
- no hay contraseñas en Sheets.

---

## Bloque 3 — Capa DB + lectura pública

**Repo:** CMS

Objetivo:

Tener persistencia segura y el primer endpoint público real.

Incluye:

- helpers DB;
- UUID;
- insert/update/read;
- orden;
- soft delete donde aplique;
- `LockService`;
- cache invalidation;
- `health`;
- `bootstrap` inicialmente con datos seed/controlados;
- respuesta compatible con frontend estático.

Definition of Done:

- health responde desde Web App publicado;
- bootstrap responde datos normalizados;
- se prueba desde un origen externo real;
- no hay bloqueo de CORS en el camino elegido;
- caché funciona y se puede invalidar.

---

## Bloque 4 — Seguridad y autenticación

**Repo:** CMS primero. Landing sólo cliente mínimo de prueba si es necesario.

Objetivo:

Cerrar el sistema de acceso antes de construir el panel completo.

Incluye:

- generación/establecimiento de contraseña inicial desde Apps Script;
- hash + salt en Script Properties;
- login;
- sesión temporal;
- logout;
- `requireAdminSession`;
- auditoría;
- bridge HTTP admin;
- resultado efímero;
- cambio de contraseña seguro con contraseña actual.

Definition of Done:

- contraseña nunca existe en claro en persistencia;
- login correcto/incorrecto probados;
- sesión expira;
- operación admin sin sesión falla;
- contraseña puede cambiarse;
- contraseña vieja deja de funcionar;
- transporte funciona cross-origin sin exponer token en URL.

---

## Bloque 5 — Media backend

**Repo:** CMS

Objetivo:

Resolver imágenes como una capacidad transversal antes de crear formularios que dependan de ellas.

Incluye:

- `CMS_Media`;
- carpeta Drive;
- upload autenticado;
- allowlist MIME;
- límite de tamaño;
- metadata;
- alt text;
- URL pública;
- verificación de sharing;
- listado de biblioteca;
- archivado/referencias;
- auditoría.

Definition of Done:

- una imagen subida desde una prueba cliente llega a Drive;
- queda registro válido en Sheet;
- URL carga públicamente;
- formato/tamaño inválido se rechaza;
- una imagen puede ser reutilizada;
- no se persiste base64.

---

## Bloque 6 — Contrato `SiteContent` en la landing

**Repo:** `Landing_Branko`

Objetivo:

Separar contenido de presentación sin cambiar el diseño actual.

Incluye:

- tipos TypeScript;
- `defaultContent`;
- adapter/resolver de bootstrap;
- fallback;
- componentes actuales consumen props/modelo en vez de constantes dispersas;
- media refs resueltas a URL.

Definition of Done:

- visualmente la landing sigue igual;
- puede funcionar sin CMS usando fallback;
- puede recibir el mismo contenido desde bootstrap;
- no hay datos duplicados innecesariamente por componentes.

---

## Bloque 7 — Shell visual del Admin

**Repo:** Landing

Objetivo:

Crear `/admin/` como aplicación React/SCSS coherente con la marca.

Incluye:

- entry point independiente;
- login;
- ojo mostrar/ocultar;
- layout admin;
- navegación;
- sesión en frontend;
- estados de loading/error;
- logout;
- pantalla de seguridad/cambio de contraseña;
- responsive.

Definition of Done:

- build genera `dist/admin/index.html`;
- `/admin/` carga en hosting estático;
- login usa backend real;
- sesión vencida vuelve al login;
- cambio de contraseña funciona desde UI;
- estética consistente con landing.

---

## Bloque 8 — Editores de contenido simple

**Repos:** Landing + CMS

Objetivo:

Dar autonomía sobre los datos sin imagen más simples.

Orden recomendado:

1. settings/contacto;
2. hero/textos;
3. FAQs;
4. ubicaciones;
5. tratamientos;
6. testimonios.

Incluye:

- formularios;
- validación frontend/backend;
- guardado;
- feedback;
- orden/publicación/archivo según entidad;
- auditoría.

Definition of Done:

- cambios realizados en panel aparecen en landing;
- refresh conserva datos;
- errores no dejan estado inconsistente;
- fallback sigue operativo.

---

## Bloque 9 — Inputs de imagen y biblioteca visual

**Repos:** Landing + CMS

Objetivo:

Integrar la capacidad de media dentro de formularios reales.

Incluye:

- componente `ImageField` reutilizable;
- preview;
- subir;
- elegir existente;
- reemplazar;
- quitar referencia;
- alt text;
- progreso/estado;
- errores;
- uso en campos definidos por el modelo final.

Casos prioritarios:

- resultados antes/después;
- tratamiento si finalmente lleva imagen;
- ubicación/testimonio si el diseño final lo requiere.

Definition of Done:

- mismo componente sirve en distintos módulos;
- no se duplica lógica de upload;
- media reutilizable;
- landing muestra la imagen nueva sin redeploy de frontend.

---

## Bloque 10 — Resultados y contenido visual sensible

**Repos:** ambos

Objetivo:

Cerrar la sección que requiere mayor cuidado de contenido real.

Incluye:

- casos;
- before/after;
- publicación/archivo;
- validaciones;
- placeholders/fallback cuando no hay imagen;
- comportamiento responsive.

Definition of Done:

- no se publican referencias rotas;
- before/after puede administrarse;
- casos archivados desaparecen del bootstrap público;
- la sección sigue siendo visualmente consistente.

---

## Bloque 11 — Hardening y UX

**Repos:** ambos

Objetivo:

Revisar el sistema como producto y no sólo como demo funcional.

Incluye:

- mensajes de error;
- timeouts;
- sesión expirada;
- doble submit;
- botones disabled;
- sanitización;
- límites;
- auditoría;
- invalidación caché;
- media en uso;
- accesibilidad de inputs/ojos;
- responsive admin;
- estados vacíos.

Definition of Done:

- checklist de seguridad aprobado;
- no hay secretos en repo/build;
- flujos fallidos son recuperables;
- UI no permite acciones ambiguas.

---

## Bloque 12 — Pruebas de integración reales

**Entornos:** Apps Script + build estático + hosting equivalente/productivo.

Objetivo:

Validar lo que unit tests no pueden demostrar.

Incluye:

- cross-origin real;
- login;
- cambio contraseña;
- CRUD;
- upload imágenes;
- Drive sharing;
- cache;
- fallback;
- sesión vencida;
- mobile;
- refresh profundo de `/admin/`;
- build limpio.

Definition of Done:

- no hay error CORS en escenario productivo;
- operaciones admin funcionan desde dominio real;
- imágenes cargan en dominio público;
- landing sobrevive a CMS no disponible;
- no existen placeholders técnicos visibles.

---

## Bloque 13 — Carga definitiva y publicación

Objetivo:

Entregar al cliente una herramienta terminada.

Incluye:

- cargar contenido aprobado;
- cargar imágenes aprobadas;
- generar/entregar contraseña inicial o temporal;
- sugerir cambio de contraseña en primer uso;
- publicar Apps Script;
- build final;
- FTP;
- smoke test;
- backup/snapshot;
- documentación de mantenimiento.

Definition of Done:

- sitio público estable;
- SSL/dominio externos al CMS ya resueltos por infraestructura;
- Branko entra al panel;
- puede cambiar su contraseña;
- puede editar y subir imágenes dentro del alcance;
- cambios reflejan en la landing;
- existe procedimiento de recuperación técnica.

---

## Qué NO debemos hacer durante estos bloques

- mezclar CRM o agenda;
- convertir el panel en page builder;
- crear usuarios/roles sin necesidad;
- guardar imágenes en Sheets;
- guardar contraseñas en `.env` del frontend;
- exponer token admin en URL;
- depender de row numbers;
- hacer cambios directos en Apps Script sin sincronizarlos al repo;
- probar CORS sólo en mocks/local y asumir que producción será igual.
