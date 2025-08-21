export interface Photo {
  id: string;
  url: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  uploadedAt: Date;
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
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
