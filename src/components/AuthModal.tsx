import type { FC } from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../styles/theme';
import { authService } from '../lib/pocketbase';

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
  max-width: 400px;
  padding: ${theme.spacing['3xl']};
  position: relative;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.xl};
    margin: ${theme.spacing.md};
  }
`;

const ModalHeader = styled.div`
  text-align: center;
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
  margin: 0 0 ${theme.spacing.sm} 0;
`;

const ModalSubtitle = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.sm};
  margin: 0;
`;

const TabContainer = styled.div`
  display: flex;
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xs};
  margin-bottom: ${theme.spacing.xl};
`;

const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  transition: all ${theme.transitions.fast};
  border: none;
  cursor: pointer;
  
  ${props => props.$active ? `
    background: ${theme.colors.gradient.primary};
    color: white;
    box-shadow: ${theme.shadows.sm};
  ` : `
    background: transparent;
    color: ${theme.colors.text.secondary};
    
    &:hover {
      color: ${theme.colors.text.primary};
      background: rgba(255, 255, 255, 0.05);
    }
  `}
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const Label = styled.label`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text.primary};
`;

const Input = styled.input`
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
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: ${theme.colors.text.light};
  }
`;

const SubmitButton = styled(motion.button)`
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  background: ${theme.colors.gradient.primary};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize.md};
  font-weight: ${theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
  }
`;

const ErrorMessage = styled.div`
  background: rgba(248, 113, 113, 0.1);
  border: 1px solid rgba(248, 113, 113, 0.3);
  color: ${theme.colors.error};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.sm};
  text-align: center;
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: ${theme.spacing.lg};
  right: ${theme.spacing.lg};
  width: 32px;
  height: 32px;
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
    width: 16px;
    height: 16px;
  }
`;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

export const AuthModal: FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 로그인 폼 데이터
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  
  // 회원가입 폼 데이터
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await authService.login(loginData.email, loginData.password);
      console.log('Login successful');
      onAuthSuccess();
      onClose();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (registerData.password !== registerData.passwordConfirm) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      await authService.register(
        registerData.email,
        registerData.password,
        registerData.passwordConfirm,
        registerData.name
      );
      console.log('Registration successful');
      onAuthSuccess();
      onClose();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setLoginData({ email: '', password: '' });
    setRegisterData({ name: '', email: '', password: '', passwordConfirm: '' });
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

            <ModalHeader>
              <ModalTitle>Welcome to PocketPic</ModalTitle>
              <ModalSubtitle>
                {activeTab === 'login' ? 'Sign in to your account' : 'Create a new account'}
              </ModalSubtitle>
            </ModalHeader>

            <TabContainer>
              <TabButton
                $active={activeTab === 'login'}
                onClick={() => setActiveTab('login')}
                type="button"
              >
                Sign In
              </TabButton>
              <TabButton
                $active={activeTab === 'register'}
                onClick={() => setActiveTab('register')}
                type="button"
              >
                Sign Up
              </TabButton>
            </TabContainer>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            {activeTab === 'login' ? (
              <Form onSubmit={handleLogin}>
                <FormGroup>
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </FormGroup>

                <SubmitButton
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </SubmitButton>
              </Form>
            ) : (
              <Form onSubmit={handleRegister}>
                <FormGroup>
                  <Label htmlFor="register-name">Name</Label>
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="Enter your name"
                    value={registerData.name}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="Enter your email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Create a password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="register-password-confirm">Confirm Password</Label>
                  <Input
                    id="register-password-confirm"
                    type="password"
                    placeholder="Confirm your password"
                    value={registerData.passwordConfirm}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, passwordConfirm: e.target.value }))}
                    required
                  />
                </FormGroup>

                <SubmitButton
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? 'Creating account...' : 'Sign Up'}
                </SubmitButton>
              </Form>
            )}
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};
