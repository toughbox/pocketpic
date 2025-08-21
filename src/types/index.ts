export interface Photo {
  id: string;
  title?: string;
  description?: string;
  image: string;
  thumbnail?: string;
  size?: number;
  mimeType?: string;
  width?: number;
  height?: number;
  created: string;
  updated: string;
  // 계산된 속성 (UI용)
  url?: string;
  thumbnailUrl?: string;
  uploadedAt?: Date;
}

export interface UploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

export interface GalleryViewMode {
  type: 'grid' | 'list';
  columns?: number;
}

export interface AppState {
  photos: Photo[];
  selectedPhoto?: Photo;
  viewMode: GalleryViewMode;
  isLoading: boolean;
  error?: string;
}
