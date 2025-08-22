import type { FC } from 'react';
import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../styles/theme';
import type { Photo } from '../types';
import { photoService } from '../lib/pocketbase';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${theme.zIndex.modal};
  padding: ${theme.spacing.lg};
  cursor: pointer;
`;

const ModalContent = styled(motion.div)`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  cursor: default;

  @media (max-width: ${theme.breakpoints.mobile}) {
    max-width: 95vw;
    max-height: 95vh;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  max-height: 80vh;
  border-radius: ${theme.borderRadius.xl};
  overflow: hidden;
  box-shadow: ${theme.shadows.xl};
`;

const PhotoImage = styled.img`
  max-width: 100%;
  max-height: 80vh;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: ${theme.borderRadius.xl};
`;

const LoadingSpinner = styled(motion.div)`
  width: 60px;
  height: 60px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid ${theme.colors.primary};
  border-radius: 50%;
  margin: ${theme.spacing.xl} auto;
`;

const ImageActions = styled.div`
  position: absolute;
  top: ${theme.spacing.lg};
  right: ${theme.spacing.lg};
  display: flex;
  gap: ${theme.spacing.sm};
  z-index: 10;
`;

const ActionButton = styled(motion.button)`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.round};
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    background: rgba(0, 0, 0, 0.8);
    transform: scale(1.1);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const CloseButton = styled(ActionButton)`
  background: rgba(255, 0, 0, 0.6);
  
  &:hover {
    background: rgba(255, 0, 0, 0.8);
  }
`;

const PhotoInfo = styled(motion.div)`
  ${theme.effects.glassEffect}
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.xl};
  margin-top: ${theme.spacing.lg};
  color: white;
`;

const PhotoTitle = styled.h2`
  font-family: ${theme.typography.fontFamily.display};
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  margin-bottom: ${theme.spacing.md};
  color: white;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.typography.fontSize.xl};
  }
`;

const PhotoDescription = styled.p`
  font-size: ${theme.typography.fontSize.md};
  line-height: ${theme.typography.lineHeight.relaxed};
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: ${theme.spacing.lg};
`;

const PhotoMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${theme.spacing.md};
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.sm};
  }
`;

const MetaItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.sm} 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

const MetaLabel = styled.span`
  font-size: ${theme.typography.fontSize.sm};
  color: rgba(255, 255, 255, 0.7);
  font-weight: ${theme.typography.fontWeight.medium};
`;

const MetaValue = styled.span`
  font-size: ${theme.typography.fontSize.sm};
  color: white;
  font-weight: ${theme.typography.fontWeight.semibold};
`;

const NavigationButton = styled(motion.button)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 60px;
  border-radius: ${theme.borderRadius.round};
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all ${theme.transitions.fast};
  transform-origin: center center;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
    border-color: rgba(255, 255, 255, 0.4);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  svg {
    width: 24px;
    height: 24px;
    transition: all ${theme.transitions.fast};
  }

  &:hover:not(:disabled) svg {
    transform: scale(1.1);
  }

  &:active:not(:disabled) {
    background: rgba(0, 0, 0, 0.9);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);
  }

  &:active:not(:disabled) svg {
    transform: scale(0.95);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 48px;
    height: 48px;
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const PrevButton = styled(NavigationButton)`
  left: ${theme.spacing.lg};
`;

const NextButton = styled(NavigationButton)`
  right: ${theme.spacing.lg};
`;

interface PhotoDetailModalProps {
  photo: Photo | null;
  photos: Photo[];
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (photo: Photo) => void;
  onPhotoChange?: (photo: Photo) => void;
}

export const PhotoDetailModal: FC<PhotoDetailModalProps> = ({
  photo,
  photos,
  isOpen,
  onClose,
  onDelete,
  onPhotoChange
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentIndex = photo ? photos.findIndex(p => p.id === photo.id) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < photos.length - 1;

  const handlePrev = useCallback(() => {
    if (hasPrev && onPhotoChange && photo) {
      const prevPhoto = photos[currentIndex - 1];
      onPhotoChange(prevPhoto);
      setImageLoaded(false); // 새 이미지 로딩 상태로 리셋
    }
  }, [hasPrev, onPhotoChange, photos, currentIndex, photo]);

  const handleNext = useCallback(() => {
    if (hasNext && onPhotoChange && photo) {
      const nextPhoto = photos[currentIndex + 1];
      onPhotoChange(nextPhoto);
      setImageLoaded(false); // 새 이미지 로딩 상태로 리셋
    }
  }, [hasNext, onPhotoChange, photos, currentIndex, photo]);

  // 키보드 이벤트 핸들러
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handlePrev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNext();
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handlePrev, handleNext, onClose]);

  const handleDelete = async () => {
    if (!onDelete || isDeleting || !photo) return;
    
    const confirmed = window.confirm('이 사진을 삭제하시겠습니까?');
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await photoService.deletePhoto(photo.id);
      onDelete(photo);
      onClose();
    } catch (error) {
      console.error('Failed to delete photo:', error);
      alert('사진 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = () => {
    if (!photo) return;
    
    const link = document.createElement('a');
    link.href = photo.url || '';
    link.download = photo.title || `photo-${photo.id}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (!photo) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContent
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ImageContainer>
              {!imageLoaded && (
                <LoadingSpinner
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              )}
              
              <PhotoImage
                src={photo.url}
                alt={photo.title || 'Photo'}
                onLoad={() => setImageLoaded(true)}
                style={{ opacity: imageLoaded ? 1 : 0 }}
              />

              <ImageActions>
                <ActionButton
                  onClick={handleDownload}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="다운로드"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7,10 12,15 17,10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                </ActionButton>

                {onDelete && (
                  <ActionButton
                    onClick={handleDelete}
                    disabled={isDeleting}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="삭제"
                    style={{ 
                      background: isDeleting ? 'rgba(255, 0, 0, 0.3)' : 'rgba(255, 0, 0, 0.6)' 
                    }}
                  >
                    {isDeleting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      </motion.div>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="M19,6V20a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6M8,6V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                      </svg>
                    )}
                  </ActionButton>
                )}

                <CloseButton
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="닫기"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </CloseButton>
              </ImageActions>

              {hasPrev && (
                <PrevButton
                  onClick={handlePrev}
                  title="이전 사진"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15,18 9,12 15,6"/>
                  </svg>
                </PrevButton>
              )}

              {hasNext && (
                <NextButton
                  onClick={handleNext}
                  title="다음 사진"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9,18 15,12 9,6"/>
                  </svg>
                </NextButton>
              )}
            </ImageContainer>

            {(photo.title || photo.description || photo.size) && (
              <PhotoInfo
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {photo.title && <PhotoTitle>{photo.title}</PhotoTitle>}
                {photo.description && <PhotoDescription>{photo.description}</PhotoDescription>}
                
                <PhotoMeta>
                  <MetaItem>
                    <MetaLabel>업로드 날짜</MetaLabel>
                    <MetaValue>{formatDate(photo.created)}</MetaValue>
                  </MetaItem>
                  
                  {photo.size && (
                    <MetaItem>
                      <MetaLabel>파일 크기</MetaLabel>
                      <MetaValue>{formatFileSize(photo.size)}</MetaValue>
                    </MetaItem>
                  )}
                  
                  {photo.mimeType && (
                    <MetaItem>
                      <MetaLabel>파일 형식</MetaLabel>
                      <MetaValue>{photo.mimeType.split('/')[1].toUpperCase()}</MetaValue>
                    </MetaItem>
                  )}
                  
                  {photo.width && photo.height && (
                    <MetaItem>
                      <MetaLabel>해상도</MetaLabel>
                      <MetaValue>{photo.width} × {photo.height}</MetaValue>
                    </MetaItem>
                  )}
                </PhotoMeta>
              </PhotoInfo>
            )}
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};
