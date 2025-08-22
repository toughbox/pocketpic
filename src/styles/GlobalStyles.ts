import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: smooth;
    width: 100%;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: ${theme.typography.fontFamily.primary};
    font-size: ${theme.typography.fontSize.md};
    line-height: ${theme.typography.lineHeight.normal};
    color: ${theme.colors.text.primary};
    background: ${theme.colors.background.primary};
    background-image: 
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%);
    min-height: 100vh;
    width: 100%;
    overflow-x: hidden;
    margin: 0;
    padding: 0;
  }

  #root {
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
  }

  /* 선택 텍스트 스타일 */
  ::selection {
    background-color: rgba(59, 130, 246, 0.3);
    color: ${theme.colors.text.primary};
  }

  /* 모바일 터치 최적화 */
  button, a {
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }

  /* 커스텀 스크롤바 */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.background.secondary};
    border-radius: ${theme.borderRadius.sm};
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary});
    border-radius: ${theme.borderRadius.sm};
    border: 2px solid ${theme.colors.background.secondary};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, ${theme.colors.secondary}, ${theme.colors.accent});
  }

  /* 포커스 스타일 */
  *:focus {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
    border-radius: ${theme.borderRadius.sm};
  }

  *:focus:not(:focus-visible) {
    outline: none;
  }

  /* 이미지 최적화 */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* 버튼 기본 스타일 리셋 */
  button {
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
    transition: all ${theme.transitions.fast};
  }

  /* 링크 기본 스타일 */
  a {
    text-decoration: none;
    color: inherit;
    transition: all ${theme.transitions.fast};
  }

  /* 입력 필드 기본 스타일 */
  input, textarea {
    font-family: inherit;
    font-size: inherit;
    border: none;
    outline: none;
    background: transparent;
    color: ${theme.colors.text.primary};
  }

  input::placeholder,
  textarea::placeholder {
    color: ${theme.colors.text.light};
  }

  /* 글래스모피즘 효과를 위한 공통 클래스 */
  .glass {
    ${theme.effects.glassEffect}
    background: ${theme.colors.background.glass};
    border: 1px solid ${theme.colors.border};
  }

  .glass-card {
    ${theme.effects.glassEffect}
    background: ${theme.colors.background.card};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.lg};
    box-shadow: ${theme.shadows.md};
  }

  /* 애니메이션 */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes glow {
    0%, 100% {
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
    }
    50% {
      box-shadow: 0 0 40px rgba(59, 130, 246, 0.6);
    }
  }

  @keyframes spin {
    0% { 
      transform: rotate(0deg); 
    }
    100% { 
      transform: rotate(360deg); 
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.6s ${theme.transitions.normal};
  }

  .animate-slideIn {
    animation: slideIn 0.6s ${theme.transitions.normal};
  }

  .animate-glow {
    animation: glow 2s ease-in-out infinite;
  }

  /* 모바일 뷰포트 최적화 */
  @media (max-width: ${theme.breakpoints.mobile}) {
    html {
      font-size: 14px;
    }
    
    body {
      background-attachment: fixed;
    }
  }

  /* 다크모드 최적화 */
  @media (prefers-color-scheme: dark) {
    html {
      color-scheme: dark;
    }
  }

  /* 고대비 모드 지원 */
  @media (prefers-contrast: high) {
    .glass,
    .glass-card {
      border-color: ${theme.colors.borderHover};
      background: ${theme.colors.background.secondary};
    }
  }

  /* 모션 감소 설정 지원 */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;