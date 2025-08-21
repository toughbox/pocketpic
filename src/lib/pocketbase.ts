import PocketBase from 'pocketbase';

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL || 'http://localhost:8070');

// 자동 새로고침 비활성화 (선택사항)
pb.autoCancellation(false);

export default pb;

// PocketBase 타입 정의
export interface PhotoRecord {
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
}

// 파일 업로드를 위한 타입
export interface PhotoUpload {
  title?: string;
  description?: string;
  image: File;
  thumbnail?: File;
  size?: number;
  mimeType?: string;
  width?: number;
  height?: number;
}

// 사용자 인증 타입 정의
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  created: string;
  updated: string;
}

export interface AuthData {
  user: User;
  token: string;
}

// PocketBase 연결 테스트 (간단한 버전)
export const testPocketBase = async () => {
  try {
    console.log('Testing PocketBase connection...');
    console.log('PocketBase URL:', pb.baseUrl);
    
    // 간단한 health check - photos 컬렉션에 빈 쿼리 시도
    try {
      await pb.collection('photos').getList(1, 1);
      console.log('Photos collection is accessible');
      return true;
    } catch (error: any) {
      if (error.status === 404) {
        console.error('Photos collection not found! Please create it in PocketBase admin.');
        return false;
      } else if (error.status === 403) {
        console.log('Photos collection exists but access is restricted (this is normal for development)');
        return true;
      } else {
        console.log('Photos collection test result:', error.status, error.message);
        return true; // 다른 오류는 일단 무시하고 진행
      }
    }
  } catch (error) {
    console.error('PocketBase connection test failed:', error);
    return false;
  }
};

// 간단한 테스트 업로드
export const testUpload = async (file: File) => {
  try {
    console.log('Testing simple upload...');
    const formData = new FormData();
    formData.append('image', file);
    
    console.log('FormData for test:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    
    const response = await fetch(`${pb.baseUrl}/api/collections/photos/records`, {
      method: 'POST',
      body: formData,
    });
    
    console.log('Raw response status:', response.status);
    console.log('Raw response headers:', response.headers);
    
    const responseText = await response.text();
    console.log('Raw response text:', responseText);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${responseText}`);
    }
    
    const result = JSON.parse(responseText);
    console.log('Upload successful:', result);
    return result;
  } catch (error) {
    console.error('Test upload failed:', error);
    throw error;
  }
};

// PocketBase 헬퍼 함수들
export const photoService = {
  // 모든 사진 가져오기
  async getPhotos() {
    try {
      const records = await pb.collection('photos').getFullList<PhotoRecord>({
        sort: '-created',
      });
      return records;
    } catch (error) {
      console.error('Error fetching photos:', error);
      throw error;
    }
  },

  // 사진 업로드 (중복 방지 버전)
  async uploadPhoto(data: PhotoUpload) {
    // 업로드 중복 방지를 위한 고유 키 생성
    const uploadKey = `${data.image.name}-${data.image.size}-${data.image.lastModified}`;
    
    // 이미 업로드 중인지 확인
    if (this._uploadingKeys?.has(uploadKey)) {
      console.log('Upload already in progress for:', uploadKey);
      throw new Error('Upload already in progress');
    }
    
    // 업로드 중 상태로 표시
    if (!this._uploadingKeys) this._uploadingKeys = new Set();
    this._uploadingKeys.add(uploadKey);
    
    try {
      console.log('=== SINGLE UPLOAD ATTEMPT ===');
      console.log('Upload key:', uploadKey);
      console.log('File info:', {
        name: data.image.name,
        size: data.image.size,
        type: data.image.type,
        lastModified: data.image.lastModified
      });

      // testUpload 제거하고 바로 PocketBase SDK 사용
      const formData = new FormData();
      formData.append('image', data.image);
      
      if (data.title && data.title.trim()) {
        formData.append('title', data.title.trim());
      }
      if (data.description && data.description.trim()) {
        formData.append('description', data.description.trim());
      }
      if (data.size && data.size > 0) {
        formData.append('size', data.size.toString());
      }
      if (data.mimeType) {
        formData.append('mimeType', data.mimeType);
      }
      if (data.width && data.width > 0) {
        formData.append('width', data.width.toString());
      }
      if (data.height && data.height > 0) {
        formData.append('height', data.height.toString());
      }

      console.log('Creating record with PocketBase...');
      const record = await pb.collection('photos').create<PhotoRecord>(formData);
      console.log('Upload successful, record ID:', record.id);
      
      return record;
      
    } catch (error: any) {
      console.error('=== UPLOAD ERROR ===');
      console.error('Upload key:', uploadKey);
      console.error('Error:', error);
      
      let errorMessage = 'Failed to upload photo';
      
      if (error.data?.data && Object.keys(error.data.data).length > 0) {
        const fieldErrors = Object.entries(error.data.data).map(([field, fieldError]: [string, any]) => {
          return `${field}: ${fieldError.message || fieldError.code || fieldError}`;
        }).join(', ');
        errorMessage = `Validation error - ${fieldErrors}`;
      } else if (error.data?.message) {
        errorMessage = error.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    } finally {
      // 업로드 완료 후 키 제거
      this._uploadingKeys?.delete(uploadKey);
    }
  },

  // 업로드 중인 키들을 추적하기 위한 private 속성
  _uploadingKeys: undefined as Set<string> | undefined,

  // 사진 삭제
  async deletePhoto(id: string) {
    try {
      await pb.collection('photos').delete(id);
    } catch (error) {
      console.error('Error deleting photo:', error);
      throw error;
    }
  },

  // 사진 URL 생성
  getImageUrl(record: PhotoRecord, filename: string = 'image', thumb?: string) {
    return pb.files.getUrl(record, filename, thumb ? { thumb } : undefined);
  },

  // 썸네일 URL 생성
  getThumbnailUrl(record: PhotoRecord) {
    if (record.thumbnail) {
      return pb.files.getUrl(record, record.thumbnail);
    }
    // 썸네일이 없으면 원본 이미지의 썸네일 버전 생성
    return pb.files.getUrl(record, record.image, { thumb: '300x300' });
  },
};

// 인증 서비스
export const authService = {
  // 현재 사용자 정보 가져오기
  getCurrentUser(): User | null {
    return pb.authStore.model as unknown as User | null;
  },

  // 인증 상태 확인
  isAuthenticated(): boolean {
    return pb.authStore.isValid;
  },

  // 로그인
  async login(email: string, password: string): Promise<AuthData> {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password);
      console.log('Login successful:', authData.record.email);
      return {
        user: authData.record as unknown as User,
        token: authData.token,
      };
    } catch (error: any) {
      console.error('Login failed:', error);
      throw new Error(error.data?.message || 'Login failed');
    }
  },

  // 회원가입
  async register(email: string, password: string, passwordConfirm: string, name?: string): Promise<AuthData> {
    try {
      const userData = {
        email,
        password,
        passwordConfirm,
        name: name || email.split('@')[0],
      };

      await pb.collection('users').create(userData);
      console.log('User created:', email);

      // 생성 후 바로 로그인
      const authData = await pb.collection('users').authWithPassword(email, password);
      
      return {
        user: authData.record as unknown as User,
        token: authData.token,
      };
    } catch (error: any) {
      console.error('Registration failed:', error);
      
      if (error.data?.data) {
        const fieldErrors = Object.entries(error.data.data).map(([field, fieldError]: [string, any]) => {
          return `${field}: ${fieldError.message || fieldError.code || fieldError}`;
        }).join(', ');
        throw new Error(`Registration failed - ${fieldErrors}`);
      }
      
      throw new Error(error.data?.message || 'Registration failed');
    }
  },

  // 로그아웃
  logout(): void {
    pb.authStore.clear();
    console.log('User logged out');
  },

  // 인증 상태 변경 리스너
  onAuthChange(callback: (user: User | null) => void): () => void {
    return pb.authStore.onChange((_token, model) => {
      callback(model as unknown as User | null);
    });
  },
};
