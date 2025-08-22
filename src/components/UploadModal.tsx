import type { FC } from 'react';
import { useState, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../styles/theme';
import { photoService } from '../lib/pocketbase';
import type { UploadProgress, MultiUploadState } from '../types';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${theme.zIndex.modal};
  padding: ${theme.spacing.lg};
`;

const ModalContent = styled(motion.div)`
  ${theme.effects.glassEffect}
  background: ${theme.colors.background.card};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius['2xl']};
  box-shadow: ${theme.shadows.xl};
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  padding: ${theme.spacing['3xl']};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.xl};
    margin: ${theme.spacing.md};
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.xl};
`;

const ModalTitle = styled.h2`
  font-family: ${theme.typography.fontFamily.display};
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  background: ${theme.colors.gradient.hero};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
`;

const CloseButton = styled(motion.button)`
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.round};
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  flex-shrink: 0;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    color: #ffffff;
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  svg {
    width: 20px;
    height: 20px;
    fill: currentColor;
  }
`;

const DropZone = styled(motion.div)<{ $isDragOver: boolean; $hasFiles: boolean }>`
  border: 2px dashed ${props => props.$isDragOver ? theme.colors.primary : theme.colors.border};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing['4xl']};
  text-align: center;
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  background: ${props => props.$isDragOver ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.02)'};
  margin-bottom: ${theme.spacing.xl};

  ${props => props.$hasFiles && `
    padding: ${theme.spacing.xl};
    margin-bottom: ${theme.spacing.lg};
  `}

  &:hover {
    border-color: ${theme.colors.primary};
    background: rgba(59, 130, 246, 0.05);
  }
`;

const DropZoneIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto ${theme.spacing.lg};
  color: ${theme.colors.text.secondary};
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

const DropZoneText = styled.div`
  h3 {
    font-size: ${theme.typography.fontSize.xl};
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.text.primary};
    margin: 0 0 ${theme.spacing.sm} 0;
  }

  p {
    color: ${theme.colors.text.secondary};
    font-size: ${theme.typography.fontSize.md};
    margin: 0 0 ${theme.spacing.md} 0;
  }

  .limit {
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.text.light};
    margin: 0;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const SelectedFiles = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const FilesSummary = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing.lg};
`;

const SummaryText = styled.div`
  h4 {
    font-size: ${theme.typography.fontSize.lg};
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.text.primary};
    margin: 0 0 ${theme.spacing.xs} 0;
  }

  p {
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.text.secondary};
    margin: 0;
  }
`;

const ClearButton = styled(motion.button)`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: rgba(248, 113, 113, 0.2);
  border: 1px solid rgba(248, 113, 113, 0.3);
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.error};
  font-size: ${theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    background: rgba(248, 113, 113, 0.3);
  }
`;

const FileList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.sm};
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing.xs};
  background: rgba(255, 255, 255, 0.02);
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FileIcon = styled.div`
  width: 32px;
  height: 32px;
  background: ${theme.colors.gradient.primary};
  border-radius: ${theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${theme.spacing.md};
  flex-shrink: 0;

  svg {
    width: 16px;
    height: 16px;
    color: white;
  }
`;

const FileInfo = styled.div`
  flex: 1;
  min-width: 0;

  .name {
    font-size: ${theme.typography.fontSize.sm};
    font-weight: ${theme.typography.fontWeight.medium};
    color: ${theme.colors.text.primary};
    margin: 0 0 ${theme.spacing.xs} 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .size {
    font-size: ${theme.typography.fontSize.xs};
    color: ${theme.colors.text.secondary};
    margin: 0;
  }
`;

const FileStatus = styled.div<{ $status: UploadProgress['status'] }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-left: ${theme.spacing.md};
  
  .status-icon {
    width: 16px;
    height: 16px;
    
    ${props => {
      switch (props.$status) {
        case 'completed':
          return `color: ${theme.colors.success};`;
        case 'error':
          return `color: ${theme.colors.error};`;
        case 'uploading':
          return `color: ${theme.colors.primary};`;
        default:
          return `color: ${theme.colors.text.secondary};`;
      }
    }}
  }
`;

const ProgressBar = styled.div`
  width: 60px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.round};
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: ${theme.colors.gradient.primary};
  border-radius: ${theme.borderRadius.round};
`;

const UploadControls = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: flex-end;
`;

const ActionButton = styled(motion.button)<{ $variant?: 'primary' | 'secondary' }>`
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize.md};
  font-weight: ${theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  border: 1px solid ${theme.colors.border};

  ${props => props.$variant === 'primary' ? `
    background: ${theme.colors.gradient.primary};
    color: white;
    border-color: transparent;
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: ${theme.shadows.lg};
    }
  ` : `
    background: rgba(255, 255, 255, 0.05);
    color: ${theme.colors.text.secondary};
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: ${theme.colors.text.primary};
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const OverallProgress = styled.div`
  margin-bottom: ${theme.spacing.lg};
  padding: ${theme.spacing.lg};
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border};
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.md};
`;

const ProgressTitle = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const ProgressStats = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
`;

const OverallProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.round};
  overflow: hidden;
`;

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
}

export const UploadModal: FC<UploadModalProps> = ({ isOpen, onClose, onUploadComplete }) => {
  const [uploadState, setUploadState] = useState<MultiUploadState>({
    files: [],
    uploads: [],
    currentIndex: -1,
    totalCount: 0,
    completedCount: 0,
    errorCount: 0,
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // 파일 선택 처리
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
    
    // 100개 제한
    const limitedFiles = imageFiles.slice(0, 100);
    
    if (imageFiles.length > 100) {
      alert('최대 100개의 이미지만 업로드할 수 있습니다.');
    }

    const uploads: UploadProgress[] = limitedFiles.map(file => ({
      file,
      progress: 0,
      status: 'pending' as const,
    }));

    setUploadState({
      files: limitedFiles,
      uploads,
      currentIndex: -1,
      totalCount: limitedFiles.length,
      completedCount: 0,
      errorCount: 0,
    });
  }, []);

  // 드래그 앤 드롭 처리
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  // 파일 업로드 실행
  const handleUpload = async () => {
    if (uploadState.files.length === 0 || isUploading) return;

    setIsUploading(true);
    let completedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < uploadState.files.length; i++) {
      const file = uploadState.files[i];
      
      // 현재 업로드 중인 파일 표시
      setUploadState(prev => ({
        ...prev,
        currentIndex: i,
        uploads: prev.uploads.map((upload, index) => 
          index === i 
            ? { ...upload, status: 'uploading' as const, progress: 0 }
            : upload
        ),
      }));

      try {
        // 이미지 처리 및 업로드
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        await new Promise<void>((resolve, reject) => {
          img.onload = async () => {
            try {
              // 캔버스에 이미지 그리기
              canvas.width = img.naturalWidth;
              canvas.height = img.naturalHeight;
              ctx?.drawImage(img, 0, 0);

              // 진행률 50% 표시
              setUploadState(prev => ({
                ...prev,
                uploads: prev.uploads.map((upload, index) => 
                  index === i 
                    ? { ...upload, progress: 50 }
                    : upload
                ),
              }));

              // PocketBase에 업로드
              const record = await photoService.uploadPhoto({
                image: file,
                title: file.name.replace(/\.[^/.]+$/, ''),
                description: '',
                size: file.size,
                mimeType: file.type,
                width: img.naturalWidth,
                height: img.naturalHeight,
              });

              // 업로드 완료
              setUploadState(prev => ({
                ...prev,
                uploads: prev.uploads.map((upload, index) => 
                  index === i 
                    ? { ...upload, status: 'completed' as const, progress: 100, id: record.id }
                    : upload
                ),
              }));

              completedCount++;
              resolve();
            } catch (error) {
              reject(error);
            }
          };

          img.onerror = () => reject(new Error('Failed to load image'));
          img.src = URL.createObjectURL(file);
        });

      } catch (error) {
        console.error('Upload failed for file:', file.name, error);
        errorCount++;
        
        setUploadState(prev => ({
          ...prev,
          uploads: prev.uploads.map((upload, index) => 
            index === i 
              ? { 
                  ...upload, 
                  status: 'error' as const, 
                  progress: 0,
                  error: error instanceof Error ? error.message : 'Upload failed'
                }
              : upload
          ),
        }));
      }

      // 상태 업데이트
      setUploadState(prev => ({
        ...prev,
        completedCount,
        errorCount,
      }));
    }

    setIsUploading(false);
    setUploadState(prev => ({ ...prev, currentIndex: -1 }));
    
    if (completedCount > 0) {
      onUploadComplete();
      
      // 업로드 완료 후 잠시 대기하고 모달 닫기
      setTimeout(() => {
        handleClose();
      }, 1000); // 1초 후 자동 닫기
    }
  };

  // 파일 목록 초기화
  const handleClear = () => {
    if (isUploading) return;
    
    setUploadState({
      files: [],
      uploads: [],
      currentIndex: -1,
      totalCount: 0,
      completedCount: 0,
      errorCount: 0,
    });
  };

  // 모달 닫기
  const handleClose = () => {
    if (isUploading) return;
    handleClear();
    onClose();
  };

  // 파일 크기 포맷팅
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 전체 진행률 계산
  const overallProgress = uploadState.totalCount > 0 
    ? Math.round((uploadState.completedCount + uploadState.errorCount) / uploadState.totalCount * 100)
    : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <ModalContent
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle>Upload Photos</ModalTitle>
              <CloseButton
                onClick={handleClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={isUploading}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59 7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12 5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 0 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>
                </svg>
              </CloseButton>
            </ModalHeader>

            {/* 드롭존 */}
            <DropZone
              $isDragOver={isDragOver}
              $hasFiles={uploadState.files.length > 0}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => document.getElementById('file-input')?.click()}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {uploadState.files.length === 0 ? (
                <>
                  <DropZoneIcon>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                  </DropZoneIcon>
                  <DropZoneText>
                    <h3>Drop your photos here</h3>
                    <p>or click to select files</p>
                    <p className="limit">Maximum 100 images • JPG, PNG, GIF</p>
                  </DropZoneText>
                </>
              ) : (
                <DropZoneText>
                  <h3>Add more photos</h3>
                  <p>or click to replace selection</p>
                </DropZoneText>
              )}
            </DropZone>

            <FileInput
              id="file-input"
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files)}
            />

            {/* 선택된 파일들 */}
            {uploadState.files.length > 0 && (
              <SelectedFiles>
                <FilesSummary>
                  <SummaryText>
                    <h4>{uploadState.files.length} files selected</h4>
                    <p>
                      Total size: {formatFileSize(uploadState.files.reduce((sum, file) => sum + file.size, 0))}
                    </p>
                  </SummaryText>
                  <ClearButton
                    onClick={handleClear}
                    disabled={isUploading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Clear All
                  </ClearButton>
                </FilesSummary>

                {/* 업로드 진행상황 */}
                {isUploading && (
                  <OverallProgress>
                    <ProgressHeader>
                      <ProgressTitle>Uploading...</ProgressTitle>
                      <ProgressStats>
                        {uploadState.completedCount + uploadState.errorCount} / {uploadState.totalCount} completed ({overallProgress}%)
                      </ProgressStats>
                    </ProgressHeader>
                    <OverallProgressBar>
                      <ProgressFill
                        initial={{ width: 0 }}
                        animate={{ width: `${overallProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </OverallProgressBar>
                  </OverallProgress>
                )}

                {/* 파일 목록 */}
                <FileList>
                  {uploadState.uploads.map((upload, index) => (
                    <FileItem key={index}>
                      <FileIcon>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21,15 16,10 5,21"/>
                        </svg>
                      </FileIcon>
                      <FileInfo>
                        <p className="name">{upload.file.name}</p>
                        <p className="size">{formatFileSize(upload.file.size)}</p>
                      </FileInfo>
                      <FileStatus $status={upload.status}>
                        {upload.status === 'uploading' && (
                          <>
                            <ProgressBar>
                              <ProgressFill
                                initial={{ width: 0 }}
                                animate={{ width: `${upload.progress}%` }}
                                transition={{ duration: 0.3 }}
                              />
                            </ProgressBar>
                            <div className="status-icon">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="17,8 12,3 7,8"/>
                                <line x1="12" y1="3" x2="12" y2="15"/>
                              </svg>
                            </div>
                          </>
                        )}
                        {upload.status === 'completed' && (
                          <div className="status-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="20,6 9,17 4,12"/>
                            </svg>
                          </div>
                        )}
                        {upload.status === 'error' && (
                          <div className="status-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/>
                              <line x1="15" y1="9" x2="9" y2="15"/>
                              <line x1="9" y1="9" x2="15" y2="15"/>
                            </svg>
                          </div>
                        )}
                        {upload.status === 'pending' && (
                          <div className="status-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/>
                              <polyline points="12,6 12,12 16,14"/>
                            </svg>
                          </div>
                        )}
                      </FileStatus>
                    </FileItem>
                  ))}
                </FileList>
              </SelectedFiles>
            )}

            {/* 업로드 버튼들 */}
            <UploadControls>
              <ActionButton
                onClick={handleClose}
                disabled={isUploading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isUploading ? 'Uploading...' : 'Cancel'}
              </ActionButton>
              <ActionButton
                $variant="primary"
                onClick={handleUpload}
                disabled={uploadState.files.length === 0 || isUploading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isUploading 
                  ? `Uploading ${uploadState.currentIndex + 1}/${uploadState.totalCount}...`
                  : `Upload ${uploadState.files.length} Photo${uploadState.files.length !== 1 ? 's' : ''}`
                }
              </ActionButton>
            </UploadControls>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};