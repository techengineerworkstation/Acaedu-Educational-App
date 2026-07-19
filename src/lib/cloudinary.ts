const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || ''
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || ''

export interface UploadResult {
  url: string
  public_id: string
  format: string
  resource_type: string
  bytes: number
  secure_url: string
}

export async function uploadFile(
  file: File,
  folder: string = 'acaedu',
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<UploadResult> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', folder)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
    { method: 'POST', body: formData }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Upload failed')
  }

  return response.json()
}

export async function uploadVideo(file: File, courseId: string): Promise<UploadResult> {
  return uploadFile(file, `acaedu/videos/${courseId}`, 'video')
}

export async function uploadImage(file: File, folder: string = 'acaedu/images'): Promise<UploadResult> {
  return uploadFile(file, folder, 'image')
}

export async function uploadDocument(file: File, courseId: string): Promise<UploadResult> {
  return uploadFile(file, `acaedu/materials/${courseId}`, 'raw')
}

export function getVideoThumbnail(url: string): string {
  // Cloudinary video thumbnail URL
  if (url.includes('cloudinary.com')) {
    return url.replace('/video/', '/image/').replace(/\.[^.]+$/, '.jpg')
  }
  return url
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}
