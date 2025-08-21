# PocketPic 프로젝트 공통 룰

## 코딩 스타일 가이드

### 1. 이모티콘 및 이모지 사용 금지
- **디자인**: UI 컴포넌트에서 이모지 사용 금지
- **로그 메시지**: 콘솔 로그, 에러 메시지에서 이모지 사용 금지
- **코멘트**: 코드 주석에서 이모지 사용 금지
- **문서**: README, 문서 파일에서 이모지 사용 금지 (본 룰 문서 제외)

#### 대안
- SVG 아이콘 사용
- CSS로 구현한 아이콘
- 아이콘 라이브러리 (예: Lucide, Heroicons)
- 텍스트 기반 표현

### 2. TypeScript 규칙
- 모든 컴포넌트는 TypeScript로 작성
- Type-only imports 사용 (`import type { ... }`)
- Props 인터페이스 명시적 정의
- `React.FC` 대신 `FC` 사용

### 3. 스타일링 규칙
- Styled Components 사용
- 테마 시스템 활용
- 반응형 디자인 필수
- 글래스모피즘 효과 적극 활용

### 4. 파일 구조
```
src/
├── components/     # 재사용 가능한 컴포넌트
├── pages/         # 페이지 컴포넌트
├── styles/        # 테마, 글로벌 스타일
├── types/         # TypeScript 타입 정의
├── hooks/         # 커스텀 훅
└── utils/         # 유틸리티 함수
```

### 5. 네이밍 컨벤션
- 컴포넌트: PascalCase (예: `PhotoGrid`)
- 파일명: PascalCase (예: `PhotoGrid.tsx`)
- 변수/함수: camelCase (예: `handleClick`)
- 상수: UPPER_SNAKE_CASE (예: `MAX_FILE_SIZE`)

### 6. 성능 최적화
- Lazy loading 적용
- 이미지 최적화
- 불필요한 리렌더링 방지
- Bundle size 최소화

### 7. 접근성 (A11y)
- 키보드 네비게이션 지원
- 스크린 리더 호환
- 적절한 ARIA 속성 사용
- 색상 대비 준수

### 8. 에러 처리
- 명확한 에러 메시지
- 사용자 친화적 에러 UI
- 로그 레벨 구분 (error, warn, info)

### 9. 코드 품질
- ESLint 규칙 준수
- Prettier 포맷팅
- 코드 리뷰 필수
- 테스트 코드 작성

### 10. 커밋 메시지
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 코드
chore: 빌드, 설정 파일 수정
```

## 금지 사항
- ❌ 이모지/이모티콘 사용
- ❌ 인라인 스타일
- ❌ any 타입 사용
- ❌ console.log 프로덕션 코드에 남기기
- ❌ 하드코딩된 값
- ❌ 글로벌 CSS 오염

## 권장 사항
- ✅ TypeScript strict 모드
- ✅ 컴포넌트 분리
- ✅ 커스텀 훅 활용
- ✅ 의미있는 변수명
- ✅ 주석을 통한 문서화
- ✅ 성능 모니터링
