# Seguridad, media y transporte — CMS Branko Iriart

> Especificación previa a implementación.

## 1. Objetivo

Definir de antemano las reglas que no pueden improvisarse durante el desarrollo: autenticación, cambio de contraseña, sesiones, subida de imágenes y comunicación entre un frontend React alojado por FTP y un Web App de Google Apps Script.

## 2. Modelo de confianza

La landing pública no es confiable para autorizar operaciones administrativas.

El panel React tampoco decide permisos: sólo solicita operaciones.

La autoridad final siempre es Apps Script.

Por lo tanto:

- toda operación de escritura se valida en backend;
- todos los campos se filtran mediante allowlist;
- un usuario no puede enviar nombres arbitrarios de hojas o funciones;
- ninguna validación crítica depende solamente del navegador.

## 3. Contraseña administrativa

### Creación inicial

La contraseña inicial se crea únicamente desde Apps Script.

El setup no debe insertar la contraseña en Sheets ni dejarla escrita en el repositorio.

Procedimiento previsto:

1. ejecutar setup inicial;
2. generar o establecer contraseña inicial mediante función administrativa;
3. Apps Script genera salt aleatorio;
4. guarda hash + salt en Script Properties;
5. la contraseña se comunica una sola vez por un canal controlado;
6. Branko puede cambiarla inmediatamente desde el panel.

### Verificación

La comparación debe realizarse contra hash + salt y evitar comparaciones ingenuas cuando sea posible.

### Reglas de nueva contraseña

La versión final definirá el mínimo exacto, pero v1 debe exigir como mínimo:

- longitud suficiente;
- nueva contraseña distinta de vacío;
- coincidencia entre nueva y confirmación en frontend;
- validación nuevamente en backend;
- contraseña actual correcta.

No se implementa recuperación por email en v1. Si Branko olvida la contraseña, el administrador técnico puede generar una temporal desde Apps Script.

## 4. UX de contraseña

### Login

- input de contraseña;
- botón mostrar/ocultar mediante icono de ojo;
- `autocomplete` apropiado;
- Enter envía el formulario;
- botón deshabilitado durante envío;
- mensaje genérico de credencial inválida;
- no revelar si existe una cuenta, hash o configuración interna.

### Cambio de contraseña

Campos:

- contraseña actual;
- contraseña nueva;
- repetir contraseña nueva.

Cada campo sensible dispone de ojo independiente para mostrar/ocultar.

La UI debe avisar:

- contraseña actual incorrecta;
- nueva contraseña inválida;
- confirmación no coincide;
- cambio exitoso.

El valor no debe persistir en localStorage, sessionStorage, logs ni analytics.

## 5. Sesiones

Apps Script genera un token aleatorio/opaco tras login.

Reglas:

- TTL limitado;
- almacenamiento temporal server-side mediante `CacheService` o mecanismo equivalente definido en implementación;
- validación en cada acción admin;
- logout invalida token;
- expiración obliga a volver a login;
- token nunca en URL;
- token nunca dentro de contenido público;
- token nunca se imprime en logs de frontend.

El frontend puede mantener la sesión sólo durante el contexto administrativo necesario; la decisión exacta de memoria/sessionStorage se toma al implementar según UX, evitando persistencia prolongada.

## 6. Bridge HTTP sin dependencia de CORS tradicional

### Problema que resolvemos

El panel está servido desde el dominio de Branko y el backend corre en `script.google.com`/Apps Script. No conviene diseñarlo suponiendo una API REST clásica que permita controlar libremente `Access-Control-Allow-Origin` y responder preflights como un servidor Node.

### Patrón elegido

Se reutiliza el patrón ya probado en otros proyectos:

1. React genera `requestId` aleatorio.
2. React genera `clientSecret` efímero aleatorio.
3. React realiza POST al Web App en un formato compatible con `no-cors` cuando sea necesario.
4. El body incluye:
   - operación;
   - token de sesión, si corresponde;
   - payload;
   - requestId;
   - clientSecret.
5. Apps Script valida identificadores y ejecuta la operación.
6. El resultado se guarda temporalmente en `CacheService` bajo una clave derivada/hash de `requestId + clientSecret`.
7. React consulta un endpoint de resultado compatible con JSONP controlado.
8. Cuando el resultado existe, se devuelve una sola vez y se elimina.
9. Si todavía no existe, el endpoint indica `pending`.
10. El resultado expira rápidamente aunque nunca sea recuperado.

### Propiedades de seguridad del bridge

- el token de sesión no aparece en URL;
- `clientSecret` es por operación, no una credencial de cuenta;
- resultado de corta duración;
- resultado consumible una sola vez;
- callback JSONP validado mediante expresión estricta;
- tamaño máximo de respuesta;
- polling con timeout y cantidad máxima de intentos;
- ninguna operación se decide a partir del nombre del callback.

### Login

El login usa el mismo bridge, pero sin token previo.

### Bootstrap público

El contenido público no necesita sesión. Debe tener un camino simple y cacheable compatible con el hosting estático. La implementación puede resolverlo con JSONP controlado o la variante que se pruebe de forma real contra el Web App.

## 7. Media: almacenamiento

Google Drive funciona como almacenamiento de archivos; Google Sheets almacena metadata.

### Carpeta

Una carpeta exclusiva del CMS:

`Branko Iriart · CMS Media`

Su `folderId` se almacena en Script Properties.

No buscarla por nombre en cada request.

### Registro CMS_Media

Cada imagen tiene un `media_id` UUID y metadata separada del `file_id` de Drive.

La URL pública no se acepta desde el cliente como verdad: la construye/valida el backend.

## 8. Media: upload

### Frontend

Antes de enviar:

- validar que exista archivo;
- validar MIME preliminar;
- validar tamaño preliminar;
- mostrar preview local;
- permitir cancelar/reemplazar;
- convertir a base64 sólo para transporte cuando corresponda;
- enviar nombre, MIME, base64 y alt text.

### Backend

Apps Script vuelve a validar:

- payload presente;
- base64 válido/decodificable;
- bytes > 0;
- bytes <= máximo;
- MIME incluido en allowlist;
- sesión válida;
- nombre normalizado;
- operación permitida.

Luego:

1. crea Blob;
2. guarda archivo en Drive;
3. configura/verifica acceso necesario para uso público;
4. genera URL pública;
5. inserta metadata en `CMS_Media`;
6. registra auditoría;
7. invalida caché pública si la imagen ya queda asociada a contenido.

## 9. Allowlist de imágenes

La lista exacta se congela al implementar. Como principio, sólo formatos web de imagen realmente necesarios.

No aceptar por defecto cualquier `image/*` sólo porque el navegador lo declare.

Se debe validar MIME contra una lista explícita y establecer límite de peso razonable.

No se aceptan SVG subidos por cliente en v1 salvo revisión expresa, para evitar superficie innecesaria de contenido activo.

## 10. URLs públicas de Drive

No basta con que `DriveApp.createFile()` funcione.

Después de guardar:

- se intenta establecer el sharing requerido;
- se verifica el estado de sharing;
- si la política de la cuenta de Google impide publicar el archivo, el upload debe fallar de forma entendible para el panel;
- no se debe guardar como válido un media que la landing no podrá mostrar.

La cuenta Google elegida para el CMS debe permitir el esquema de publicación de imágenes definido.

## 11. Reutilización y borrado

Una imagen puede ser seleccionada desde una biblioteca existente.

Quitar una imagen de un tratamiento/caso/testimonio sólo elimina la referencia.

Borrar físicamente un media de Drive requiere:

1. verificar sesión;
2. verificar si existen referencias activas;
3. impedir borrado o pedir reemplazo si está en uso;
4. archivar primero el registro;
5. efectuar borrado definitivo sólo mediante acción explícita.

No implementar garbage collection automática en v1.

## 12. Auditoría

Registrar como mínimo:

- login exitoso;
- login fallido de manera limitada/sin contraseña;
- logout;
- create/update/archive/restore;
- upload de media;
- cambios de alt text relevantes;
- cambio de contraseña;
- reset técnico de contraseña si se utiliza.

Nunca registrar:

- contraseña;
- nueva contraseña;
- token de sesión completo;
- clientSecret completo;
- base64 de imágenes.

## 13. Manejo de errores

Frontend muestra mensajes utilizables:

- sesión vencida;
- archivo demasiado grande;
- formato no admitido;
- imagen no publicable desde Drive;
- error temporal;
- validación de campo;
- cambio guardado/no guardado.

Backend puede loguear detalles técnicos, pero la respuesta al navegador no devuelve stack traces ni IDs/secrets sensibles.

## 14. Pruebas obligatorias antes de producción

### Auth

- login correcto;
- login incorrecto;
- sesión expirada;
- logout;
- operación sin token;
- cambio de contraseña correcto;
- cambio con contraseña actual incorrecta;
- login con contraseña nueva;
- contraseña anterior deja de funcionar.

### Transporte

- POST real desde el dominio/entorno del frontend;
- resultado recuperado correctamente;
- timeout;
- requestId inválido;
- clientSecret inválido;
- resultado consumido dos veces;
- payload grande rechazado.

### Media

- JPG/PNG/WebP permitidos según allowlist final;
- MIME no permitido;
- archivo vacío;
- archivo excedido;
- preview;
- upload;
- URL pública cargando desde la landing;
- reutilización de media;
- referencia removida;
- intento de borrar media en uso.

### CORS real

No alcanza con tests unitarios: debe probarse desde un build servido en un origen distinto al Web App de Apps Script, porque ese es el escenario productivo.
