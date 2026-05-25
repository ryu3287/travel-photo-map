export interface Photo {
  id: string
  user_id?: string
  file_name: string
  storage_url: string
  taken_at: string | null
  latitude: number | null
  longitude: number | null
  location_name: string | null
  tags: string[]
  created_at: string
}

export interface ExifData {
  latitude: number | null
  longitude: number | null
  taken_at: string | null
}

export interface UploadResult {
  success: boolean
  photo?: Photo
  error?: string
}
