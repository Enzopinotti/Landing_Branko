export type CmsStatus = 'draft' | 'published' | 'archived'

export interface CmsBaseRecord {
  status?: CmsStatus
  created_at?: string
  updated_at?: string
  archived_at?: string
}

export interface CmsSettings extends CmsBaseRecord {
  settings_id: string
  site_name: string
  professional_name: string
  professional_license: string
  whatsapp_number: string
  whatsapp_booking_message: string
  whatsapp_consult_message: string
  instagram_handle: string
  instagram_url: string
  patients_metric: string
  followers_metric: string
  treatments_metric: string
  personalized_metric: string
}

export interface CmsContentRecord extends CmsBaseRecord {
  content_id: string
  content_key: string
  label: string
  value: string
  value_type: string
}

export interface CmsTreatment extends CmsBaseRecord {
  treatment_id: string
  slug: string
  title: string
  subtitle: string
  description: string
  tag: string
  icon_key: string
  sort_order: number | string
}

export interface CmsLocation extends CmsBaseRecord {
  location_id: string
  city: string
  name: string
  address: string
  secondary_text: string
  external_url: string
  sort_order: number | string
}

export interface CmsResultCase extends CmsBaseRecord {
  result_case_id: string
  category: string
  title: string
  description: string
  sort_order: number | string
}

export interface CmsTestimonial extends CmsBaseRecord {
  testimonial_id: string
  display_name: string
  text: string
  service: string
  sort_order: number | string
}

export interface CmsFaq extends CmsBaseRecord {
  faq_id: string
  question: string
  answer: string
  sort_order: number | string
}

export interface CmsMedia extends CmsBaseRecord {
  media_id: string
  file_name: string
  mime_type: string
  file_size: number | string
  public_url: string
  alt_text: string
}

export interface CmsMediaLink extends CmsBaseRecord {
  media_link_id: string
  media_id: string
  entity_type: string
  entity_id: string
  field_key: string
  sort_order: number | string
}

export interface CmsWorkspaceData {
  settings: CmsSettings[]
  content: CmsContentRecord[]
  treatments: CmsTreatment[]
  locations: CmsLocation[]
  resultCases: CmsResultCase[]
  testimonials: CmsTestimonial[]
  faqs: CmsFaq[]
  media: CmsMedia[]
  mediaLinks: CmsMediaLink[]
  session: {
    actor: string
  }
}

export interface CmsPublicBootstrapData {
  site: Partial<CmsSettings>
  content: Record<string, string>
  treatments: CmsTreatment[]
  locations: CmsLocation[]
  resultCases: CmsResultCase[]
  testimonials: CmsTestimonial[]
  faqs: CmsFaq[]
  media: CmsMedia[]
  mediaLinks: CmsMediaLink[]
  meta: {
    app: string
    version: string
    schemaVersion: string
    generatedAt: string
  }
}

export interface CmsPublicBootstrapResponse {
  success: boolean
  data?: CmsPublicBootstrapData
  error?: string
  code?: string
}

export interface CmsLoginResponse {
  success: boolean
  token?: string
  expiresIn?: number
  error?: string
  code?: string
}

export interface CmsWorkspaceResponse {
  success: boolean
  data?: CmsWorkspaceData
  error?: string
  code?: string
}

export interface CmsMutationResponse<T = unknown> {
  success: boolean
  record?: T
  media?: CmsMedia
  link?: CmsMediaLink
  token?: string
  expiresIn?: number
  error?: string
  code?: string
}

export interface CmsAdminResultEnvelope<T> {
  success: boolean
  pending: boolean
  result?: T
  error?: string
  code?: string
}

export interface CmsAdminSession {
  token: string
  expiresAt: number
}

export type CmsCollectionKey =
  | 'treatments'
  | 'locations'
  | 'resultCases'
  | 'testimonials'
  | 'faqs'
