// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  // StrictMode 일시적으로 비활성화 (개발 중 중복 실행 방지)
  // <StrictMode>
    <App />
  // </StrictMode>,
)
