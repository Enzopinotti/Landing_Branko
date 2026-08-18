# Modelo de contenido — CMS Branko Iriart

> Modelo funcional previo a la implementación del panel.

## Objetivo

Representar sólo el contenido que Branko necesita administrar. El CMS no es un constructor visual: diseño, SCSS, animaciones, composición, layout y componentes permanecen en `Landing_Branko`.

Las imágenes se gestionan mediante una biblioteca central (`CMS_Media`) y vínculos reutilizables (`CMS_MediaLinks`). Los binarios nunca se guardan en Sheets.

## CMS_Settings

Singleton de datos globales.

Campos:

- `settings_id`
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
- `status`
- `created_at`
- `updated_at`
- `archived_at`

## CMS_Content

Piezas de texto identificadas por `content_key` estable.

Campos:

- `content_id`
- `content_key`
- `label`
- `value`
- `value_type`
- `status`
- `created_at`
- `updated_at`
- `archived_at`

Ejemplos de claves:

- `hero.badge`
- `hero.title_primary`
- `hero.title_accent`
- `hero.subtitle`
- `hero.primary_cta_label`
- `hero.secondary_cta_label`
- `treatments.eyebrow`
- `treatments.title_primary`
- `treatments.title_accent`
- `treatments.description`
- `about.eyebrow`
- `about.quote`
- `results.eyebrow`
- `results.title_primary`
- `results.title_accent`
- `contact.eyebrow`
- `contact.title_primary`
- `contact.title_accent`
- `contact.subtitle`
- `contact.cta_label`
- `contact.faq_title`

No se guardan estilos, clases CSS ni HTML libre.

## CMS_Treatments

Una fila por tratamiento.

- `treatment_id` UUID
- `slug`
- `title`
- `subtitle`
- `description`
- `tag`
- `icon_key`
- `sort_order`
- `status`
- `created_at`
- `updated_at`
- `archived_at`

Una imagen opcional se vincula desde `CMS_MediaLinks` con `entity_type=treatment` y, por ejemplo, `field_key=cover_image`.

## CMS_Locations

Una fila por lugar de atención.

- `location_id` UUID
- `city`
- `name`
- `address`
- `secondary_text`
- `external_url`
- `sort_order`
- `status`
- `created_at`
- `updated_at`
- `archived_at`

Una imagen se vincula con `entity_type=location` y `field_key=cover_image`.

## CMS_ResultCases

Una fila por caso de resultado.

- `result_case_id` UUID
- `category`
- `title`
- `description`
- `sort_order`
- `status`
- `created_at`
- `updated_at`
- `archived_at`

Las comparativas usan vínculos separados, por ejemplo:

- `field_key=before_image`
- `field_key=after_image`

Esto permite reemplazar una imagen sin alterar el registro del caso y reutilizar el mismo archivo si fuese necesario.

## CMS_Testimonials

- `testimonial_id` UUID
- `display_name`
- `text`
- `service`
- `sort_order`
- `status`
- `created_at`
- `updated_at`
- `archived_at`

Un avatar opcional usa `entity_type=testimonial` y `field_key=avatar`.

## CMS_FAQs

- `faq_id` UUID
- `question`
- `answer`
- `sort_order`
- `status`
- `created_at`
- `updated_at`
- `archived_at`

## CMS_Media

Biblioteca única de archivos de imagen.

- `media_id` UUID
- `file_id` de Google Drive
- `file_name`
- `mime_type`
- `file_size`
- `drive_url`
- `public_url`
- `alt_text`
- `status`
- `created_at`
- `updated_at`
- `archived_at`
- `metadata_json`

Reglas:

- v1 acepta JPEG, PNG y WebP;
- máximo inicial de 6 MB por imagen;
- base64 sólo existe durante el upload;
- Drive almacena el binario;
- Sheets almacena metadata;
- `media_id` es la identidad lógica;
- una imagen puede tener más de un vínculo;
- una imagen con vínculos activos no se puede archivar/eliminar;
- el panel debe permitir subir una nueva o elegir una existente;
- `alt_text` forma parte de la metadata administrable.

## CMS_MediaLinks

Relación entre una imagen y un campo visual del CMS.

- `media_link_id` UUID
- `media_id`
- `entity_type`
- `entity_id`
- `field_key`
- `sort_order`
- `status`
- `created_at`
- `updated_at`
- `archived_at`

Ejemplos:

```text
media_01 -> result_case_01 -> before_image
media_02 -> result_case_01 -> after_image
media_03 -> treatment_02   -> cover_image
media_03 -> location_01    -> cover_image
```

La última línea muestra el motivo de separar media y vínculos: **una misma imagen puede reutilizarse en diferentes lugares sin duplicar el archivo en Drive**.

## _AuditLog

- `audit_id` UUID
- `created_at`
- `actor`
- `channel`
- `entity`
- `entity_id`
- `action`
- `before_json`
- `after_json`

Incluye login, logout, create, update, archive, restore, upload, link/unlink de media y cambio/reset de contraseña.

## _System

- `key`
- `value`
- `updated_at`

Claves iniciales:

- `schema_version`
- `app_version`
- `last_setup_at`

## Bootstrap público

La landing recibe conceptualmente:

```text
site
content
treatments[]
locations[]
resultCases[]
testimonials[]
faqs[]
media[]
mediaLinks[]
meta
```

Sólo salen registros `published` y no archivados.

## Workspace administrativo

El panel recibe todas las entidades necesarias para editar, incluyendo drafts/archivados según la vista, pero nunca recibe:

- password;
- hash;
- salt;
- Script Properties;
- IDs/configuración interna que no necesite la UI.

## Fallback frontend

`Landing_Branko` mantendrá `defaultContent` con la misma forma estructural del bootstrap. La landing debe poder renderizar aunque Apps Script esté temporalmente indisponible.

## Fuera del CMS v1

- colores y tipografías;
- animaciones;
- layout;
- componentes visuales;
- edición gráfica de imágenes;
- video administrable;
- agenda/turnos;
- usuarios y roles múltiples;
- creación libre de secciones.

La sección adicional incluida comercialmente sigue fuera del CMS salvo ampliación expresa.

## Cierre del schema

Antes de congelar v1 se mapea el relevamiento final del cliente contra estas entidades y se define, campo por campo, qué entradas aceptan imagen y qué `field_key` utiliza cada una.
