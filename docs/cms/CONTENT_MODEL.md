# Modelo de contenido — CMS Branko Iriart

> Borrador funcional previo a implementación.

## Objetivo del modelo

Representar únicamente el contenido que Branko necesita administrar, sin convertir el panel en un constructor de páginas. El diseño, las animaciones y la composición visual permanecen en el repositorio de la landing.

Los contenidos pueden referenciar imágenes mediante `media_id`. Los binarios nunca se almacenan en Sheets.

## 1. CMS_Settings

Una única configuración activa para datos globales.

Campos conceptuales:

- `id`
- `site_name`
- `professional_name`
- `professional_license`
- `whatsapp_number`
- `whatsapp_booking_message`
- `whatsapp_consult_message`
- `instagram_handle`
- `instagram_url`
- `patients_metric`
- `followers_metric`
- `treatments_metric`
- `personalized_metric`
- `updated_at`

## 2. CMS_Content

Contenido textual singleton por bloque. Cada registro identifica una pieza concreta mediante una `content_key` estable.

Campos conceptuales:

- `id`
- `content_key`
- `label`
- `value`
- `status`
- `updated_at`

Claves iniciales previstas:

### Hero

- `hero.badge`
- `hero.title_primary`
- `hero.title_accent`
- `hero.subtitle`
- `hero.primary_cta_label`
- `hero.secondary_cta_label`

### Tratamientos — encabezado

- `treatments.eyebrow`
- `treatments.title_primary`
- `treatments.title_accent`
- `treatments.description`
- `treatments.help_text`
- `treatments.help_cta_label`

### Sobre Branko

- `about.eyebrow`
- `about.paragraph_1`
- `about.paragraph_2`
- `about.paragraph_3`
- `about.quote`
- `about.cta_label`

### Resultados

- `results.eyebrow`
- `results.title_primary`
- `results.title_accent`
- `results.before_placeholder`
- `results.after_placeholder`
- `results.testimonials_title`

### Contacto

- `contact.eyebrow`
- `contact.title_primary`
- `contact.title_accent`
- `contact.subtitle`
- `contact.cta_label`
- `contact.faq_title`

No se guardan estilos, clases CSS, tamaños, colores, coordenadas ni estructura HTML.

## 3. CMS_Treatments

Una fila por tratamiento.

Campos conceptuales:

- `id` UUID
- `slug`
- `title`
- `subtitle`
- `description`
- `tag`
- `icon_key`
- `image_media_id` opcional
- `sort_order`
- `status` (`draft` / `published` / `archived`)
- `created_at`
- `updated_at`
- `archived_at`

Reglas:

- crear, editar, ordenar, publicar y archivar;
- `icon_key` limitado a íconos soportados por la landing;
- sin HTML libre en descripción;
- una imagen puede reutilizarse mediante `image_media_id`.

## 4. CMS_Locations

Una fila por lugar de atención.

Campos conceptuales:

- `id` UUID
- `city`
- `name`
- `address`
- `secondary_text`
- `external_url`
- `image_media_id` opcional
- `sort_order`
- `status`
- `created_at`
- `updated_at`
- `archived_at`

## 5. CMS_ResultCases

Una fila por caso dentro de Resultados.

Campos conceptuales:

- `id` UUID
- `category`
- `title`
- `description`
- `before_media_id` opcional
- `after_media_id` opcional
- `sort_order`
- `status`
- `created_at`
- `updated_at`
- `archived_at`

Esta entidad sí contempla las imágenes administrables de antes/después cuando Branko entregue material real aprobado.

## 6. CMS_Testimonials

Una fila por testimonio.

Campos conceptuales:

- `id` UUID
- `display_name`
- `text`
- `service`
- `avatar_media_id` opcional
- `sort_order`
- `status`
- `created_at`
- `updated_at`
- `archived_at`

## 7. CMS_FAQs

Una fila por pregunta frecuente.

Campos conceptuales:

- `id` UUID
- `question`
- `answer`
- `sort_order`
- `status`
- `created_at`
- `updated_at`
- `archived_at`

## 8. CMS_Media

Biblioteca central de imágenes.

Campos conceptuales:

- `media_id` UUID
- `file_id` identificador interno de Google Drive
- `file_name`
- `mime_type`
- `file_size`
- `public_url`
- `drive_url` sólo para administración/soporte
- `alt_text`
- `entity_type` opcional
- `entity_id` opcional
- `sort_order`
- `status`
- `metadata_json`
- `created_at`
- `updated_at`
- `archived_at`

Reglas:

- `media_id` es la referencia utilizada por las entidades del CMS;
- `file_id` no sustituye la identidad lógica del registro;
- base64 sólo existe durante el transporte del upload y no se persiste;
- la imagen debe pasar validaciones de MIME y tamaño;
- una imagen puede ser reutilizada por más de un campo/contenido;
- `alt_text` debe poder editarse;
- el panel debe poder seleccionar una imagen existente además de subir una nueva;
- borrar una referencia de una entidad no implica borrar automáticamente el archivo de Drive;
- la eliminación definitiva de un archivo requiere una operación explícita y validación de referencias.

## 9. _AuditLog

Registro de cambios administrativos.

Campos conceptuales:

- `id` UUID
- `created_at`
- `actor`
- `entity`
- `entity_id`
- `action`
- `before_json`
- `after_json`

Acciones mínimas:

- `login`
- `logout`
- `create`
- `update`
- `publish`
- `archive`
- `restore`
- `upload_media`
- `change_password`

## 10. _System

Metadatos técnicos.

Campos conceptuales:

- `key`
- `value`
- `updated_at`

Valores previstos:

- `schema_version`
- `app_version`
- `setup_completed_at`

## Bootstrap público esperado

Conceptualmente la landing recibe un único objeto:

```text
site
content
locations[]
treatments[]
resultCases[]
testimonials[]
faqs[]
media{}
meta
```

`media` puede resolverse como mapa indexado por `media_id` para evitar repetir metadata en cada entidad.

Sólo se incluyen registros publicados y no archivados. Las colecciones llegan ordenadas por `sort_order`.

## Workspace administrativo esperado

El workspace del panel puede incluir:

```text
settings
content
locations[]
treatments[]
resultCases[]
testimonials[]
faqs[]
media[]
session/meta
```

El workspace no incluye secretos, hash, salt ni IDs de configuración sensibles.

## Fallback en frontend

`Landing_Branko` mantiene `defaultContent` con la misma forma estructural que el bootstrap.

Sirve para:

- desarrollar sin Apps Script;
- evitar una landing vacía si el CMS falla;
- actuar como snapshot conocido para publicación.

Las imágenes administrables deben tener también un fallback estático cuando el diseño lo requiera.

## Fuera del modelo CMS v1

- colores;
- tipografías;
- animaciones;
- orden macro de secciones;
- componentes visuales;
- preloader;
- estructura del navbar/footer;
- edición gráfica de imágenes;
- videos administrables;
- agenda o turnos;
- usuarios/roles múltiples.

La sección adicional incluida comercialmente permanece fuera del CMS salvo ampliación expresa.

## Decisión pendiente antes de implementar

Cuando Branko devuelva el relevamiento final debemos mapear cada respuesta a este modelo y marcar, campo por campo, cuáles inputs admiten imagen. Recién entonces se congela el schema v1.
