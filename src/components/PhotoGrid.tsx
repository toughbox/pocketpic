import type { FC } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '../styles/theme';
import type { Photo } from '../types';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} 0;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: ${theme.spacing.xs};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: ${theme.spacing.xs};
    padding: ${theme.spacing.xs} 0;
  }
`;

const PhotoCard = styled(motion.div)`
  position: relative;
  aspect-ratio: 1;
  border-radius: ${theme.borderRadius.xl};
  overflow: hidden;
  cursor: pointer;
  ${theme.effects.glassEffect}
  background: ${theme.colors.background.card};
  border: 1px solid ${theme.colors.border};
  box-shadow: ${theme.shadows.lg};
  transition: all ${theme.transitions.normal};

  &::before {
    content: '';
    position: absolute;
    inset: -1px;
    background: ${theme.colors.gradient.hero};
    border-radius: ${theme.borderRadius.xl};
    z-index: -1;
    opacity: 0;
    transition: opacity ${theme.transitions.fast};
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: ${theme.shadows.xl};
    border-color: ${theme.colors.borderHover};

    &::before {
      opacity: 0.3;
    }
  }
`;

const PhotoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${theme.transitions.slow};
  border-radius: ${theme.borderRadius.lg};

  ${PhotoCard}:hover & {
    transform: scale(1.1);
  }
`;

const PhotoOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 40%,
    rgba(0, 0, 0, 0.3) 70%,
    rgba(0, 0, 0, 0.8) 100%
  );
  opacity: 0;
  transition: opacity ${theme.transitions.normal};
  border-radius: ${theme.borderRadius.lg};

  ${PhotoCard}:hover & {
    opacity: 1;
  }
`;

const PhotoInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${theme.spacing.lg};
  color: white;
  transform: translateY(100%);
  transition: transform ${theme.transitions.normal};

  ${PhotoCard}:hover & {
    transform: translateY(0);
  }
`;

const PhotoTitle = styled.h3`
  font-size: ${theme.typography.fontSize.md};
  font-weight: ${theme.typography.fontWeight.semibold};
  margin-bottom: ${theme.spacing.xs};
  line-height: ${theme.typography.lineHeight.tight};
  color: white;
`;

const PhotoMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.sm};
`;

const PhotoDate = styled.p`
  font-size: ${theme.typography.fontSize.xs};
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
`;

const PhotoSize = styled.span`
  font-size: ${theme.typography.fontSize.xs};
  color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.1);
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  backdrop-filter: blur(8px);
`;

const PhotoActions = styled.div`
  position: absolute;
  top: ${theme.spacing.md};
  right: ${theme.spacing.md};
  display: flex;
  gap: ${theme.spacing.sm};
  opacity: 0;
  transform: translateY(-10px);
  transition: all ${theme.transitions.normal};

  ${PhotoCard}:hover & {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ActionButton = styled(motion.button)`
  width: 36px;
  height: 36px;
  border-radius: ${theme.borderRadius.round};
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing['4xl']};
  text-align: center;
  ${theme.effects.glassEffect}
  background: ${theme.colors.background.card};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius['2xl']};
  box-shadow: ${theme.shadows.lg};
`;

const EmptyIcon = styled(motion.div)`
  width: 120px;
  height: 120px;
  background: ${theme.colors.gradient.primary};
  border-radius: ${theme.borderRadius.round};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${theme.spacing.xl};
  color: white;
  box-shadow: ${theme.shadows.glowPurple};
  position: relative;

  svg {
    width: 60px;
    height: 60px;
    stroke-width: 1.5;
  }

  &::after {
    content: '';
    position: absolute;
    inset: -4px;
    background: ${theme.colors.gradient.primary};
    border-radius: ${theme.borderRadius.round};
    z-index: -1;
    opacity: 0.3;
    animation: glow 2s ease-in-out infinite;
  }

  @keyframes glow {
    0%, 100% { transform: scale(1); opacity: 0.3; }
    50% { transform: scale(1.05); opacity: 0.6; }
  }
`;

const EmptyTitle = styled.h2`
  font-family: ${theme.typography.fontFamily.display};
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  margin-bottom: ${theme.spacing.md};
  background: ${theme.colors.gradient.hero};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const EmptyDescription = styled.p`
  font-size: ${theme.typography.fontSize.md};
  line-height: ${theme.typography.lineHeight.relaxed};
  max-width: 400px;
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing.xl};
`;

const EmptyAction = styled(motion.button)`
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  background: ${theme.colors.gradient.primary};
  color: white;
  border-radius: ${theme.borderRadius.xl};
  font-size: ${theme.typography.fontSize.md};
  font-weight: ${theme.typography.fontWeight.semibold};
  border: none;
  cursor: pointer;
  box-shadow: ${theme.shadows.glow};
  transition: all ${theme.transitions.normal};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.xl};
  }
`;

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick?: (photo: Photo) => void;
  onUploadClick?: () => void;
}

export const PhotoGrid: FC<PhotoGridProps> = ({ photos, onPhotoClick, onUploadClick }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (photos.length === 0) {
    return (
      <GridContainer>
        <EmptyState>
          <EmptyIcon
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
              <circle cx="12" cy="13" r="3"/>
              <path d="M12 10v6M9 13h6" opacity="0.6"/>
            </svg>
          </EmptyIcon>
          <EmptyTitle>Your Gallery Awaits</EmptyTitle>
          <EmptyDescription>
            Start building your photo collection by uploading your first image. 
            Create memories that last forever.
          </EmptyDescription>
          <EmptyAction
            onClick={onUploadClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Upload Your First Photo
          </EmptyAction>
        </EmptyState>
      </GridContainer>
    );
  }

  return (
    <GridContainer>
      {photos.map((photo, index) => (
        <PhotoCard
          key={photo.id}
          onClick={() => onPhotoClick?.(photo)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.6 }}
          whileHover={{ y: -8 }}
        >
          <PhotoImage
            src={photo.thumbnailUrl || photo.url}
            alt={photo.title || 'Photo'}
            loading="lazy"
          />
          <PhotoOverlay />
          
          <PhotoActions>
            <ActionButton
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                console.log('Like photo:', photo.id);
              }}
              title="Like"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </ActionButton>
            <ActionButton
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                console.log('Share photo:', photo.id);
              }}
              title="Share"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M17 7H7M17 7V17"/>
              </svg>
            </ActionButton>
          </PhotoActions>
          
          <PhotoInfo>
            {photo.title && <PhotoTitle>{photo.title}</PhotoTitle>}
            <PhotoMeta>
              <PhotoDate>{photo.uploadedAt ? formatDate(photo.uploadedAt) : formatDate(new Date(photo.created))}</PhotoDate>
              <PhotoSize>{formatFileSize(photo.size || 0)}</PhotoSize>
            </PhotoMeta>
          </PhotoInfo>
        </PhotoCard>
      ))}
    </GridContainer>
  );
};