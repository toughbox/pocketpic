export const theme = {
  colors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
    background: {
      primary: '#0f0f23',
      secondary: '#1a1a2e',
      tertiary: '#16213e',
      card: 'rgba(26, 26, 46, 0.8)',
      glass: 'rgba(255, 255, 255, 0.05)',
      overlay: 'rgba(0, 0, 0, 0.8)',
    },
    text: {
      primary: '#ffffff',
      secondary: '#a1a1aa',
      light: '#71717a',
      muted: '#52525b',
    },
    border: 'rgba(255, 255, 255, 0.1)',
    borderHover: 'rgba(255, 255, 255, 0.2)',
    error: '#f87171',
    success: '#34d399',
    warning: '#fbbf24',
    gradient: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      accent: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      dark: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 100%)',
      hero: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    },
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    '3xl': '64px',
    '4xl': '80px',
  },
  
  borderRadius: {
    sm: '6px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
    round: '50%',
  },
  
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.3)',
    md: '0 8px 24px rgba(0, 0, 0, 0.4)',
    lg: '0 16px 40px rgba(0, 0, 0, 0.5)',
    xl: '0 24px 64px rgba(0, 0, 0, 0.6)',
    glow: '0 0 20px rgba(59, 130, 246, 0.3)',
    glowPurple: '0 0 30px rgba(139, 92, 246, 0.4)',
    glowCyan: '0 0 25px rgba(6, 182, 212, 0.3)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
  },
  
  typography: {
    fontFamily: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      display: "'Space Grotesk', 'Inter', sans-serif",
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '32px',
      '4xl': '40px',
      '5xl': '48px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.8,
    },
  },
  
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1200px',
  },
  
  zIndex: {
    dropdown: 1000,
    modal: 1050,
    toast: 1100,
  },
  
  transitions: {
    fast: '0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: '0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  
  effects: {
    backdropBlur: 'blur(16px)',
    glassEffect: 'backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);',
  },
};

export type Theme = typeof theme;