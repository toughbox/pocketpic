import type { FC } from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import { PhotoGrid } from '../components/PhotoGrid';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { UploadModal } from '../components/UploadModal';
import type { Photo } from '../types';
import { theme } from '../styles/theme';
import { photoService, testPocketBase } from '../lib/pocketbase';
import pb from '../lib/pocketbase';

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

// PocketBase 데이터를 UI용 Photo 타입으로 변환
const transformPhoto = (record: any): Photo => ({
  ...record,
  url: pb.files.getUrl(record, record.image),
  thumbnailUrl: record.thumbnail 
    ? pb.files.getUrl(record, record.thumbnail)
    : pb.files.getUrl(record, record.image, { thumb: '400x400' }),
  uploadedAt: new Date(record.created),
});

export const Gallery: FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // PocketBase에서 사진 데이터 로드
  const loadPhotos = async () => {
    try {
      console.log('Reloading photos...');
      setIsLoading(true);
      setError(null);
      const records = await photoService.getPhotos();
      const transformedPhotos = records.map(transformPhoto);
      console.log('Reloaded photos:', transformedPhotos.length);
      setPhotos(transformedPhotos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load photos');
      console.error('Error loading photos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    let isCancelled = false;
    
    const init = async () => {
      if (isCancelled) return;
      
      console.log('Loading photos...');
      try {
        setIsLoading(true);
        setError(null);
        const records = await photoService.getPhotos();
        
        if (!isCancelled) {
          const transformedPhotos = records.map(transformPhoto);
          console.log('Loaded photos:', transformedPhotos.length);
          setPhotos(transformedPhotos);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load photos');
          console.error('Error loading photos:', err);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };
    
    init();
    
    // Cleanup function
    return () => {
      isCancelled = true;
    };
  }, []);

  const handleUploadClick = () => {
    setIsUploadModalOpen(true);
  };

  const handleUploadComplete = () => {
    // 업로드 완료 후 사진 목록 새로고침
    loadPhotos();
  };

  const handlePhotoClick = (photo: Photo) => {
    console.log('사진 클릭:', photo);
    // TODO: 사진 상세 보기 모달 열기
  };

  const totalSize = photos.reduce((sum, photo) => sum + (photo.size || 0), 0);
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

  if (error) {
    return (
      <Layout onUploadClick={handleUploadClick} photoCount={photos.length}>
        <GalleryContainer>
          <div style={{ 
            textAlign: 'center', 
            padding: theme.spacing['4xl'],
            color: theme.colors.error 
          }}>
            <h2>Error loading photos</h2>
            <p>{error}</p>
            <button 
              onClick={loadPhotos}
              style={{
                marginTop: theme.spacing.lg,
                padding: `${theme.spacing.md} ${theme.spacing.xl}`,
                background: theme.colors.gradient.primary,
                color: 'white',
                border: 'none',
                borderRadius: theme.borderRadius.lg,
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
          </div>
        </GalleryContainer>
      </Layout>
    );
  }

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
        
        {isLoading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: theme.spacing['4xl'],
            color: theme.colors.text.secondary 
          }}>
            <p>Loading photos...</p>
          </div>
        ) : (
          <PhotoGrid 
            photos={photos} 
            onPhotoClick={handlePhotoClick}
            onUploadClick={handleUploadClick}
          />
        )}
      </GalleryContainer>
      
      <FloatingActionButton onClick={handleUploadClick} />
      
      <UploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={handleUploadComplete}
      />
    </Layout>
  );
};