import type { FC } from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '../styles/theme';
import { authService, type User } from '../lib/pocketbase';

const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  z-index: ${theme.zIndex.dropdown};
  ${theme.effects.glassEffect}
  background: ${theme.colors.background.glass};
  border-bottom: 1px solid ${theme.colors.border};
  padding: ${theme.spacing.lg} ${theme.spacing.md};
  backdrop-filter: ${theme.effects.backdropBlur};
  -webkit-backdrop-filter: ${theme.effects.backdropBlur};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: ${theme.colors.gradient.hero};
    opacity: 0.6;
  }

  @media (max-width: ${theme.breakpoints.desktop}) {
    padding: ${theme.spacing.lg} ${theme.spacing.sm};
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.md} ${theme.spacing.xs};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.md} ${theme.spacing.xs};
  }
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const LogoSection = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const LogoIcon = styled.div`
  width: 44px;
  height: 44px;
  background: ${theme.colors.gradient.primary};
  border-radius: ${theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: ${theme.shadows.glow};
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: -2px;
    background: ${theme.colors.gradient.primary};
    border-radius: ${theme.borderRadius.lg};
    z-index: -1;
    opacity: 0;
    transition: opacity ${theme.transitions.fast};
  }

  &:hover::after {
    opacity: 0.3;
  }

  svg {
    width: 24px;
    height: 24px;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 40px;
    height: 40px;
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const LogoText = styled.h1`
  font-family: ${theme.typography.fontFamily.display};
  font-size: ${theme.typography.fontSize['3xl']};
  font-weight: ${theme.typography.fontWeight.extrabold};
  background: ${theme.colors.gradient.hero};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: -0.02em;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.typography.fontSize['2xl']};
  }
`;

const ActionSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    display: none;
  }
`;

const UserName = styled.span`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.primary};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const LogoutButton = styled(motion.button)`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.xs};
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: ${theme.colors.text.primary};
  }
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: ${theme.colors.gradient.primary};
  color: white;
  border-radius: ${theme.borderRadius.xl};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  box-shadow: ${theme.shadows.md};
  border: 1px solid ${theme.colors.border};
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${theme.colors.gradient.secondary};
    opacity: 0;
    transition: opacity ${theme.transitions.fast};
  }

  &:hover::before {
    opacity: 1;
  }

  span {
    position: relative;
    z-index: 1;
  }

  .icon {
    position: relative;
    z-index: 1;
    font-size: ${theme.typography.fontSize.lg};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.typography.fontSize.xs};
    
    span {
      display: none;
    }
  }
`;

const StatsSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: none;
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

const StatNumber = styled.span`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
`;

const StatLabel = styled.span`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.text.light};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

interface HeaderProps {
  onUploadClick?: () => void;
  photoCount?: number;
}

export const Header: FC<HeaderProps> = ({ onUploadClick, photoCount = 0 }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // 현재 사용자 정보 가져오기
    setCurrentUser(authService.getCurrentUser());
    
    // 인증 상태 변경 리스너
    const unsubscribe = authService.onAuthChange((user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  const handleLogout = () => {
    authService.logout();
    window.location.reload(); // 페이지 새로고침으로 상태 초기화
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <LogoSection
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <LogoIcon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
              <circle cx="12" cy="13" r="3"/>
            </svg>
          </LogoIcon>
          <LogoText>PocketPic</LogoText>
        </LogoSection>

        <ActionSection>
          <StatsSection>
            <StatItem>
              <StatNumber>{photoCount}</StatNumber>
              <StatLabel>Photos</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>2.4GB</StatNumber>
              <StatLabel>Storage</StatLabel>
            </StatItem>
          </StatsSection>

          {currentUser && (
            <UserSection>
              <UserName>{currentUser.name || currentUser.email}</UserName>
              <LogoutButton
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Logout
              </LogoutButton>
            </UserSection>
          )}

          <ActionButton
            onClick={onUploadClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="icon">+</span>
            <span>Add Photo</span>
          </ActionButton>
        </ActionSection>
      </HeaderContent>
    </HeaderContainer>
  );
};