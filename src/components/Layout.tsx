import type { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Header } from './Header';
import { theme } from '../styles/theme';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${theme.colors.background.primary};
  position: relative;
  overflow-x: hidden;

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.08) 0%, transparent 50%);
    z-index: -1;
    pointer-events: none;
  }
`;

const MainContent = styled(motion.main)`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0;
  max-width: none;
  margin: 0;
  width: 100%;
  position: relative;

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: 0 ${theme.spacing.xs};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 0 ${theme.spacing.xs};
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const BackgroundElements = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 10%;
    right: 10%;
    width: 300px;
    height: 300px;
    background: ${theme.colors.gradient.primary};
    border-radius: ${theme.borderRadius.round};
    opacity: 0.03;
    filter: blur(60px);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 20%;
    left: 15%;
    width: 400px;
    height: 400px;
    background: ${theme.colors.gradient.secondary};
    border-radius: ${theme.borderRadius.round};
    opacity: 0.02;
    filter: blur(80px);
  }
`;

const FloatingOrb = styled(motion.div)<{ $top: string; $left: string; $delay: number }>`
  position: absolute;
  top: ${props => props.$top};
  left: ${props => props.$left};
  width: 60px;
  height: 60px;
  background: ${theme.colors.gradient.accent};
  border-radius: ${theme.borderRadius.round};
  opacity: 0.1;
  filter: blur(20px);
`;

interface LayoutProps {
  children: ReactNode;
  onUploadClick?: () => void;
  photoCount?: number;
}

export const Layout: FC<LayoutProps> = ({ children, onUploadClick, photoCount }) => {
  const orbs = [
    { top: '15%', left: '85%', delay: 0 },
    { top: '70%', left: '10%', delay: 2 },
    { top: '40%', left: '75%', delay: 4 },
    { top: '80%', left: '60%', delay: 6 },
  ];

  return (
    <LayoutContainer>
      <BackgroundElements>
        {orbs.map((orb, index) => (
          <FloatingOrb
            key={index}
            $top={orb.top}
            $left={orb.left}
            $delay={orb.delay}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: orb.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </BackgroundElements>

      <Header onUploadClick={onUploadClick} photoCount={photoCount} />
      
      <MainContent
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <ContentWrapper>
          {children}
        </ContentWrapper>
      </MainContent>
    </LayoutContainer>
  );
};