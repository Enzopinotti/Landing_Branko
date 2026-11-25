import type { CmsCollectionKey, CmsSectionKey } from '@/cms/types'

export type AdminView = 'overview' | 'general' | 'content' | CmsCollectionKey | 'media' | 'activity' | 'security'
export type FieldKind = 'text' | 'textarea' | 'number' | 'url' | 'select'
export interface FieldDefinition { key:string; label:string; kind?:FieldKind; placeholder?:string; help?:string; required?:boolean; options?:Array<{value:string;label:string}>; span?:1|2 }
export interface MediaSlotDefinition { key:string; label:string; help:string }
export interface CollectionDefinition { key:CmsCollectionKey; title:string; singular:string; description:string; idField:string; primaryField:string; secondaryField?:string; fields:FieldDefinition[]; mediaSlots?:MediaSlotDefinition[] }

const statusField: FieldDefinition = { key:'status',label:'Estado',kind:'select',options:[{value:'published',label:'Publicado'},{value:'draft',label:'Borrador'},{value:'archived',label:'Archivado'}] }
const sortField: FieldDefinition = { key:'sort_order',label:'Orden',kind:'number',help:'Los números más bajos aparecen primero.' }

export const collectionDefinitions: Record<CmsCollectionKey, CollectionDefinition> = {
  treatments: {
    key:'treatments',title:'Tratamientos',singular:'tratamiento',description:'Servicios visibles en la landing. Podés sumar explicación ampliada, usos e imágenes sin recargar la card inicial.',idField:'treatment_id',primaryField:'title',secondaryField:'subtitle',
    mediaSlots:[
      {key:'cover',label:'Imagen principal',help:'Foto representativa que aparece en la card y el detalle.'},
      {key:'gallery_1',label:'Ejemplo 1',help:'Primer ejemplo o zona de aplicación.'},
      {key:'gallery_2',label:'Ejemplo 2',help:'Segundo ejemplo o zona de aplicación.'},
      {key:'gallery_3',label:'Ejemplo 3',help:'Tercer ejemplo o foto de proceso.'},
    ],
    fields:[
      {key:'title',label:'Nombre',required:true,placeholder:'Ej. Ácido Hialurónico'},
      {key:'subtitle',label:'Subtítulo',placeholder:'Ej. Relleno & Volumen'},
      {key:'slug',label:'Slug',help:'Si se deja vacío, el backend lo genera desde el nombre.'},
      {key:'tag',label:'Etiqueta',placeholder:'Ej. Popular'},
      {key:'icon_key',label:'Ícono / símbolo',placeholder:'Ej. ◉'},
      {key:'description',label:'Descripción corta',kind:'textarea',required:true,span:2,help:'Texto breve que se ve sin abrir el detalle.'},
      {key:'detail_title',label:'Título del detalle',span:2,placeholder:'Ej. ¿Qué es y para qué sirve?'},
      {key:'detail_body',label:'Explicación ampliada',kind:'textarea',span:2,help:'Información clara y prudente. Evitá promesas médicas no validadas.'},
      {key:'applications_text',label:'Aplicaciones / zonas',kind:'textarea',span:2,placeholder:'Una por línea. Ej. Labios\nRinomodelación\nMentón'},
      {key:'duration_text',label:'Duración',placeholder:'Completar sólo si Bran valida el dato.'},
      {key:'recovery_text',label:'Recuperación',placeholder:'Completar sólo si Bran valida el dato.'},
      {key:'cta_label',label:'Texto del botón',placeholder:'Ej. Consultar tratamiento'},
      sortField,statusField,
    ],
  },
  locations: { key:'locations',title:'Ubicaciones',singular:'ubicación',description:'Consultorios y puntos de atención mostrados en contacto y en la sección Sobre Branko.',idField:'location_id',primaryField:'city',secondaryField:'name',fields:[{key:'city',label:'Ciudad',required:true,placeholder:'Ej. Ensenada'},{key:'name',label:'Etiqueta del consultorio',placeholder:'Ej. Consultorio',help:'Es el texto que aparece debajo de la ciudad en Sobre Branko. Podés usar el mismo nombre en ambas sedes.'},{key:'address',label:'Dirección',required:true,span:2},{key:'secondary_text',label:'Texto secundario',span:2,placeholder:'Ej. entre Cestino y Alberdi'},{key:'external_url',label:'Enlace externo',kind:'url',span:2,placeholder:'https://...'},sortField,statusField] },
  resultCases: { key:'resultCases',title:'Resultados',singular:'caso',description:'Casos destacados y contenido antes/después.',idField:'result_case_id',primaryField:'title',secondaryField:'category',mediaSlots:[{key:'before',label:'Antes',help:'Imagen previa al tratamiento.'},{key:'after',label:'Después',help:'Imagen posterior al tratamiento.'}],fields:[{key:'category',label:'Categoría',required:true,placeholder:'Ej. Hialurónico'},{key:'title',label:'Título',required:true},{key:'description',label:'Descripción',kind:'textarea',span:2},sortField,statusField] },
  testimonials: { key:'testimonials',title:'Testimonios',singular:'testimonio',description:'Opiniones de pacientes que pueden mostrarse en resultados.',idField:'testimonial_id',primaryField:'display_name',secondaryField:'service',fields:[{key:'display_name',label:'Nombre visible',required:true,placeholder:'Ej. Victoria R.'},{key:'service',label:'Tratamiento',placeholder:'Ej. Botox'},{key:'text',label:'Testimonio',kind:'textarea',required:true,span:2},sortField,statusField] },
  faqs: { key:'faqs',title:'Preguntas frecuentes',singular:'pregunta',description:'Preguntas y respuestas visibles en la sección de contacto.',idField:'faq_id',primaryField:'question',fields:[{key:'question',label:'Pregunta',required:true,span:2},{key:'answer',label:'Respuesta',kind:'textarea',required:true,span:2},sortField,statusField] },
}

export const viewToSection: Partial<Record<AdminView,CmsSectionKey>> = { general:'settings',content:'content',treatments:'treatments',locations:'locations',resultCases:'resultCases',testimonials:'testimonials',faqs:'faqs',media:'media',activity:'activity' }
export const navGroups:Array<{label:string;items:Array<{id:AdminView;label:string;description:string}>}>=[
  {label:'Panel',items:[{id:'overview',label:'Resumen',description:'Estado general'},{id:'general',label:'Datos generales',description:'Contacto y métricas'},{id:'content',label:'Textos y cierres',description:'Portada, secciones y footer'}]},
  {label:'Contenido',items:[{id:'treatments',label:'Tratamientos',description:'Servicios + fotos'},{id:'resultCases',label:'Resultados',description:'Casos antes/después'},{id:'testimonials',label:'Testimonios',description:'Opiniones'},{id:'locations',label:'Ubicaciones',description:'Consultorios'},{id:'faqs',label:'Preguntas frecuentes',description:'FAQ'},{id:'media',label:'Biblioteca',description:'Imágenes reutilizables'}]},
  {label:'Sistema',items:[{id:'activity',label:'Actividad',description:'Auditoría reciente'},{id:'security',label:'Seguridad',description:'Contraseña y sesión'}]},
]
export const contentGroupLabels:Record<string,string>={hero:'Portada',treatments:'Tratamientos',about:'Sobre Branko',results:'Resultados',contact:'Contacto',footer:'Pie de página',navigation:'Navegación',general:'General',cms:'Sistema'}
