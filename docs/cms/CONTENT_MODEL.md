# Modelo de contenido — CMS Branko Iriart

> Borrador funcional previo a implementación.

## Objetivo del modelo

Representar únicamente el contenido que Branko necesita administrar, sin convertir el panel en un constructor de páginas. El diseño, las animaciones y la composición visual permanecen en el repositorio de la landing.

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

Notas:

- El teléfono se guarda normalizado para enlaces y puede tener una versión visible separada si hace falta.
- Las métricas son texto administrable, no cálculos automáticos.

## 2. CMS_Content

Contenido textual singleton por bloque. Cada registro identifica una pieza concreta del diseño mediante una `content_key` estable.

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
- `sort_order`
- `status` (`draft` / `published` / `archived`)
- `created_at`
- `updated_at`
- `archived_at`

Reglas:

- El panel puede crear, editar, ordenar, publicar y archivar tratamientos.
- `icon_key` debe aceptar sólo un conjunto cerrado de íconos definidos por la landing.
- No se permite HTML libre en `description`.

## 4. CMS_Locations

Una fila por lugar de atención.

Campos conceptuales:

- `id` UUID
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

Inicialmente representa Ensenada y La Plata.

## 5. CMS_ResultCases

Una fila por caso/texto dentro de la sección Resultados.

Campos conceptuales:

- `id` UUID
- `category`
- `title`
- `description`
- `sort_order`
- `status`
- `created_at`
- `updated_at`
- `archived_at`

En v1 no administra imágenes de antes/después. Las imágenes aprobadas permanecen como assets de la landing.

## 6. CMS_Testimonials

Una fila por testimonio.

Campos conceptuales:

- `id` UUID
- `display_name`
- `text`
- `service`
- `sort_order`
- `status`
- `created_at`
- `updated_at`
- `archived_at`

Reglas:

- Un testimonio sólo debe publicarse cuando haya sido validado por Branko.
- El panel permite archivar sin eliminar historial.

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

## 8. _AuditLog

Registro de cambios administrativos. Sólo lectura desde el sistema; no editable por Branko en v1.

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

## 9. _System

Metadatos técnicos del CMS.

Campos conceptuales:

- `key`
- `value`
- `updated_at`

Valores previstos:

- `schema_version`
- `app_version`
- `setup_completed_at`

## Bootstrap público esperado

Conceptualmente la landing debería recibir un único objeto:

```text
site
content
locations[]
treatments[]
resultCases[]
testimonials[]
faqs[]
meta
```

Sólo se incluyen registros publicados y no archivados. Las colecciones llegan ordenadas por `sort_order`.

## Fallback en frontend

El repositorio `Landing_Branko` debe mantener un `defaultContent` con la misma forma que el bootstrap. Su propósito es:

- permitir desarrollo sin Apps Script;
- evitar una landing vacía si el CMS falla;
- actuar como snapshot conocido y seguro para publicación.

El fallback no reemplaza la base administrable: sólo protege la disponibilidad pública.

## Campos deliberadamente fuera del CMS v1

- Colores.
- Tipografías.
- Animaciones.
- Orden macro de secciones.
- Componentes visuales.
- Fotografías y videos.
- Preloader.
- Navbar como estructura.
- Footer como estructura.
- Sección adicional incluida en el presupuesto.
- Agenda o turnos.

## Decisión pendiente antes de implementar

Cuando Branko devuelva el relevamiento final, debemos mapear cada respuesta a este modelo y confirmar si alguno de los campos previstos deja de existir o necesita un campo nuevo. El schema definitivo se congela recién después de ese mapeo.
