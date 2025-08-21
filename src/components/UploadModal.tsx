import type { FC } from 'react';
import { useState, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../styles/theme';
import { photoService } from '../lib/pocketbase';
import type { UploadProgress } from '../types';

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
  max-width: 600px;
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
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid ${theme.colors.border};
  color: ${theme.colors.text.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: ${theme.colors.text.primary};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const DropZone = styled(motion.div)<{ $isDragOver: boolean; $hasFile: boolean }>`
  border: 2px dashed ${props => 
    props.$isDragOver ? theme.colors.primary : 
    props.$hasFile ? theme.colors.success : 
    theme.colors.border
  };
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing['3xl']};
  text-align: center;
  background: ${props => 
    props.$isDragOver ? 'rgba(59, 130, 246, 0.1)' : 
    props.$hasFile ? 'rgba(52, 211, 153, 0.1)' : 
    'rgba(255, 255, 255, 0.05)'
  };
  transition: all ${theme.transitions.normal};
  cursor: pointer;
  margin-bottom: ${theme.spacing.xl};

  &:hover {
    border-color: ${theme.colors.primary};
    background: rgba(59, 130, 246, 0.05);
  }
`;

const DropZoneIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto ${theme.spacing.lg};
  background: ${theme.colors.gradient.primary};
  border-radius: ${theme.borderRadius.round};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

  svg {
    width: 40px;
    height: 40px;
  }
`;

const DropZoneText = styled.div`
  h3 {
    font-size: ${theme.typography.fontSize.lg};
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing.sm};
  }

  p {
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.text.secondary};
    margin: 0;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const PreviewContainer = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const PreviewImage = styled.img`
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.background.secondary};
`;

const FormGroup = styled.div`
  margin-bottom: ${theme.spacing.lg};

  label {
    display: block;
    font-size: ${theme.typography.fontSize.sm};
    font-weight: ${theme.typography.fontWeight.medium};
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing.sm};
  }

  input, textarea {
    width: 100%;
    padding: ${theme.spacing.md};
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.lg};
    color: ${theme.colors.text.primary};
    font-size: ${theme.typography.fontSize.md};
    transition: all ${theme.transitions.fast};

    &:focus {
      border-color: ${theme.colors.primary};
      background: rgba(255, 255, 255, 0.1);
    }

    &::placeholder {
      color: ${theme.colors.text.light};
    }
  }

  textarea {
    resize: vertical;
    min-height: 80px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: flex-end;

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const Button = styled(motion.button)<{ $variant?: 'primary' | 'secondary' }>`
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

    &:hover {
      transform: translateY(-2px);
      box-shadow: ${theme.shadows.lg};
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  ` : `
    background: transparent;
    color: ${theme.colors.text.secondary};

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: ${theme.colors.text.primary};
    }
  `}
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.sm};
  overflow: hidden;
  margin: ${theme.spacing.md} 0;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: ${theme.colors.gradient.primary};
  border-radius: ${theme.borderRadius.sm};
`;

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
}

export const UploadModal: FC<UploadModalProps> = ({ isOpen, onClose, onUploadComplete }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files[0]) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleUpload = async () => {
    if (!selectedFile || uploadProgress?.status === 'uploading') {
      console.log('Upload already in progress or no file selected');
      return;
    }

    console.log('Starting upload for:', selectedFile.name);
    
    setUploadProgress({
      file: selectedFile,
      progress: 0,
      status: 'uploading',
    });

    try {
      // 이미지 메타데이터 추출
      const img = new Image();
      
      // onload 이벤트가 한 번만 실행되도록 보장
      let uploadExecuted = false;
      
      img.onload = async () => {
        if (uploadExecuted) {
          console.log('Upload already executed, skipping...');
          return;
        }
        uploadExecuted = true;
        
        try {
          console.log('Executing upload with metadata:', {
            width: img.width,
            height: img.height,
            title: title || undefined,
            description: description || undefined,
          });
          
          await photoService.uploadPhoto({
            title: title || undefined,
            description: description || undefined,
            image: selectedFile,
            size: selectedFile.size,
            mimeType: selectedFile.type,
            width: img.width,
            height: img.height,
          });

          setUploadProgress(prev => prev ? { ...prev, progress: 100, status: 'completed' } : null);
          
          setTimeout(() => {
            onUploadComplete();
            handleClose();
          }, 1000);
        } catch (error) {
          console.error('Upload error:', error);
          setUploadProgress(prev => prev ? { 
            ...prev, 
            status: 'error', 
            error: error instanceof Error ? error.message : 'Upload failed' 
          } : null);
        }
      };
      
      img.onerror = () => {
        console.error('Failed to load image for metadata extraction');
        setUploadProgress(prev => prev ? { 
          ...prev, 
          status: 'error', 
          error: 'Failed to process image' 
        } : null);
      };
      
      img.src = preview!;
    } catch (error) {
      console.error('Upload setup error:', error);
      setUploadProgress(prev => prev ? { 
        ...prev, 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Upload failed' 
      } : null);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreview(null);
    setTitle('');
    setDescription('');
    setUploadProgress(null);
    onClose();
  };

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
              <ModalTitle>Add New Photo</ModalTitle>
              <CloseButton
                onClick={handleClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </CloseButton>
            </ModalHeader>

            {!selectedFile ? (
              <DropZone
                $isDragOver={isDragOver}
                $hasFile={!!selectedFile}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => document.getElementById('file-input')?.click()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <DropZoneIcon>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                    <circle cx="12" cy="13" r="3"/>
                  </svg>
                </DropZoneIcon>
                <DropZoneText>
                  <h3>Drop your image here</h3>
                  <p>or click to browse files • JPG, PNG, WebP up to 10MB</p>
                </DropZoneText>
              </DropZone>
            ) : (
              <PreviewContainer>
                <PreviewImage src={preview!} alt="Preview" />
              </PreviewContainer>
            )}

            <FileInput
              id="file-input"
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            />

            {selectedFile && (
              <>
                <FormGroup>
                  <label htmlFor="title">Title (optional)</label>
                  <input
                    id="title"
                    type="text"
                    placeholder="Enter a title for your photo"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </FormGroup>

                <FormGroup>
                  <label htmlFor="description">Description (optional)</label>
                  <textarea
                    id="description"
                    placeholder="Describe your photo..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </FormGroup>

                {uploadProgress && (
                  <div>
                    <ProgressBar>
                      <ProgressFill
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress.progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </ProgressBar>
                    <p style={{ 
                      fontSize: theme.typography.fontSize.sm, 
                      color: uploadProgress.status === 'error' ? theme.colors.error : theme.colors.text.secondary,
                      textAlign: 'center' 
                    }}>
                      {uploadProgress.status === 'uploading' && `Uploading... ${uploadProgress.progress}%`}
                      {uploadProgress.status === 'completed' && 'Upload completed!'}
                      {uploadProgress.status === 'error' && `Error: ${uploadProgress.error}`}
                    </p>
                  </div>
                )}

                <ButtonGroup>
                  <Button
                    type="button"
                    onClick={handleClose}
                    disabled={uploadProgress?.status === 'uploading'}
                  >
                    Cancel
                  </Button>
                  <Button
                    $variant="primary"
                    onClick={handleUpload}
                    disabled={uploadProgress?.status === 'uploading'}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {uploadProgress?.status === 'uploading' ? 'Uploading...' : 'Upload Photo'}
                  </Button>
                </ButtonGroup>
              </>
            )}
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};
