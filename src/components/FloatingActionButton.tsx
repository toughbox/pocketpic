import type { FC } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '../styles/theme';

const FABContainer = styled(motion.button)`
  position: fixed;
  bottom: ${theme.spacing['3xl']};
  right: ${theme.spacing['3xl']};
  width: 72px;
  height: 72px;
  background: ${theme.colors.gradient.hero};
  color: white;
  border-radius: ${theme.borderRadius.round};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  box-shadow: ${theme.shadows.xl};
  z-index: ${theme.zIndex.dropdown};
  cursor: pointer;
  border: 2px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: ${theme.colors.gradient.hero};
    border-radius: ${theme.borderRadius.round};
    z-index: -1;
    opacity: 0;
    transition: opacity ${theme.transitions.fast};
  }

  &:hover::before {
    opacity: 0.8;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, transparent 30%, rgba(255, 255, 255, 0.1) 100%);
    opacity: 0;
    transition: opacity ${theme.transitions.fast};
  }

  &:hover::after {
    opacity: 1;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    bottom: ${theme.spacing.xl};
    right: ${theme.spacing.xl};
    width: 64px;
    height: 64px;
    font-size: ${theme.typography.fontSize.xl};
  }
`;

const PulseRing = styled(motion.div)`
  position: absolute;
  inset: -8px;
  border: 2px solid rgba(59, 130, 246, 0.3);
  border-radius: ${theme.borderRadius.round};
  z-index: -2;
`;

const PlusIcon = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 28px;
    height: 28px;
    stroke-width: 2.5;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    svg {
      width: 24px;
      height: 24px;
    }
  }
`;

const Tooltip = styled(motion.div)`
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: ${theme.spacing.md};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${theme.colors.background.card};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  white-space: nowrap;
  box-shadow: ${theme.shadows.lg};
  backdrop-filter: blur(16px);
  z-index: 1;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    right: ${theme.spacing.lg};
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid ${theme.colors.background.card};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    display: none;
  }
`;

interface FloatingActionButtonProps {
  onClick?: () => void;
  showTooltip?: boolean;
}

export const FloatingActionButton: FC<FloatingActionButtonProps> = ({ 
  onClick, 
  showTooltip = true 
}) => {
  return (
    <>
      <FABContainer
        onClick={onClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          delay: 0.5 
        }}
        title="Add new photo"
      >
        <PulseRing
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <PlusIcon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </PlusIcon>

        {showTooltip && (
          <Tooltip
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            Add Photo
          </Tooltip>
        )}
      </FABContainer>
    </>
  );
};