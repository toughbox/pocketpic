import type { FC } from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import { PhotoGrid } from '../components/PhotoGrid';
import { FloatingActionButton } from '../components/FloatingActionButton';
import type { Photo } from '../types';
import { theme } from '../styles/theme';

const GalleryContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: ${theme.spacing.xl} 0;
`;

const GalleryHeader = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing['3xl']};
  padding-bottom: ${theme.spacing.xl};
  border-bottom: 1px solid ${theme.colors.border};
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100px;
    height: 2px;
    background: ${theme.colors.gradient.primary};
    border-radius: ${theme.borderRadius.sm};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    margin-bottom: ${theme.spacing.xl};
    flex-direction: column;
    align-items: flex-start;
    gap: ${theme.spacing.md};
  }
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const GalleryTitle = styled.h1`
  font-family: ${theme.typography.fontFamily.display};
  font-size: ${theme.typography.fontSize['4xl']};
  font-weight: ${theme.typography.fontWeight.extrabold};
  background: ${theme.colors.gradient.hero};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: -0.02em;
  line-height: ${theme.typography.lineHeight.tight};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.typography.fontSize['3xl']};
  }
`;

const GallerySubtitle = styled.p`
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.secondary};
  margin: 0;
  line-height: ${theme.typography.lineHeight.relaxed};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.typography.fontSize.md};
  }
`;

const StatsSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.mobile}) {
    gap: ${theme.spacing.lg};
    align-self: stretch;
    justify-content: space-between;
  }
`;

const StatCard = styled(motion.div)`
  ${theme.effects.glassEffect}
  background: ${theme.colors.background.glass};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  text-align: center;
  box-shadow: ${theme.shadows.md};
  min-width: 120px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    min-width: 100px;
  }
`;

const StatNumber = styled.div`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.xs};
  line-height: 1;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.typography.fontSize.xl};
  }
`;

const StatLabel = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.light};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: ${theme.typography.fontWeight.medium};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.typography.fontSize.xs};
  }
`;

const FilterSection = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};
  padding: ${theme.spacing.lg};
  ${theme.effects.glassEffect}
  background: ${theme.colors.background.glass};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.sm};

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-wrap: wrap;
    gap: ${theme.spacing.sm};
  }
`;

const FilterButton = styled(motion.button)<{ $active?: boolean }>`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border};
  background: ${props => props.$active ? theme.colors.gradient.primary : 'transparent'};
  color: ${props => props.$active ? 'white' : theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    background: ${props => props.$active ? theme.colors.gradient.primary : theme.colors.background.glass};
    border-color: ${theme.colors.borderHover};
    color: ${props => props.$active ? 'white' : theme.colors.text.primary};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.xs} ${theme.spacing.md};
    font-size: ${theme.typography.fontSize.xs};
  }
`;

// 임시 데이터 (나중에 실제 데이터로 교체)
const mockPhotos: Photo[] = [
  {
    id: '1',
    url: 'https://picsum.photos/800/800?random=1',
    thumbnailUrl: 'https://picsum.photos/400/400?random=1',
    title: 'Sunset Paradise',
    uploadedAt: new Date('2024-01-15'),
    size: 1024000,
    mimeType: 'image/jpeg',
  },
  {
    id: '2',
    url: 'https://picsum.photos/800/800?random=2',
    thumbnailUrl: 'https://picsum.photos/400/400?random=2',
    title: 'Urban Nights',
    uploadedAt: new Date('2024-01-14'),
    size: 2048000,
    mimeType: 'image/jpeg',
  },
  {
    id: '3',
    url: 'https://picsum.photos/800/800?random=3',
    thumbnailUrl: 'https://picsum.photos/400/400?random=3',
    title: 'Mountain Vista',
    uploadedAt: new Date('2024-01-13'),
    size: 1536000,
    mimeType: 'image/jpeg',
  },
  {
    id: '4',
    url: 'https://picsum.photos/800/800?random=4',
    thumbnailUrl: 'https://picsum.photos/400/400?random=4',
    title: 'Ocean Waves',
    uploadedAt: new Date('2024-01-12'),
    size: 1800000,
    mimeType: 'image/jpeg',
  },
  {
    id: '5',
    url: 'https://picsum.photos/800/800?random=5',
    thumbnailUrl: 'https://picsum.photos/400/400?random=5',
    title: 'Forest Path',
    uploadedAt: new Date('2024-01-11'),
    size: 1200000,
    mimeType: 'image/jpeg',
  },
  {
    id: '6',
    url: 'https://picsum.photos/800/800?random=6',
    thumbnailUrl: 'https://picsum.photos/400/400?random=6',
    title: 'City Lights',
    uploadedAt: new Date('2024-01-10'),
    size: 1400000,
    mimeType: 'image/jpeg',
  },
];

export const Gallery: FC = () => {
  const [photos] = useState<Photo[]>(mockPhotos);
  const [activeFilter, setActiveFilter] = useState('all');

  const handleUploadClick = () => {
    console.log('업로드 버튼 클릭');
    // TODO: 업로드 모달 열기
  };

  const handlePhotoClick = (photo: Photo) => {
    console.log('사진 클릭:', photo);
    // TODO: 사진 상세 보기 모달 열기
  };

  const totalSize = photos.reduce((sum, photo) => sum + photo.size, 0);
  const formatSize = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(1)}GB`;
  };

  const filters = [
    { id: 'all', label: 'All Photos' },
    { id: 'recent', label: 'Recent' },
    { id: 'favorites', label: 'Favorites' },
    { id: 'shared', label: 'Shared' },
  ];

  return (
    <Layout onUploadClick={handleUploadClick} photoCount={photos.length}>
      <GalleryContainer>
        <GalleryHeader
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <TitleSection>
            <GalleryTitle>My Gallery</GalleryTitle>
            <GallerySubtitle>
              Your personal photo collection, beautifully organized
            </GallerySubtitle>
          </TitleSection>
          
          <StatsSection>
            <StatCard
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <StatNumber>{photos.length}</StatNumber>
              <StatLabel>Photos</StatLabel>
            </StatCard>
            <StatCard
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <StatNumber>{formatSize(totalSize)}</StatNumber>
              <StatLabel>Storage</StatLabel>
            </StatCard>
          </StatsSection>
        </GalleryHeader>

        <FilterSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {filters.map((filter) => (
            <FilterButton
              key={filter.id}
              $active={activeFilter === filter.id}
              onClick={() => setActiveFilter(filter.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {filter.label}
            </FilterButton>
          ))}
        </FilterSection>
        
        <PhotoGrid 
          photos={photos} 
          onPhotoClick={handlePhotoClick}
          onUploadClick={handleUploadClick}
        />
      </GalleryContainer>
      
      <FloatingActionButton onClick={handleUploadClick} />
    </Layout>
  );
};