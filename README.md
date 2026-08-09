**🎯 작심삼일**

면접 준비에 필요한 질문을 등록하고 다른 사용자와 의견을 나누며 함께 학습할 수 있는 면접 질문 게시판 서비스입니다.

질문에 대한 찬성·반대 투표를 통해 좋은 질문을 선별하고 선정된 질문을 매일 아침 7시에 Discord 알림으로 받아볼 수 있도록 구현했습니다.

**🌐 배포 사이트**

[작심삼일 바로가기](http://15.135.81.125/)

**📕 프로젝트 소개**

**💡 기획 배경**

면접 준비를 하다 보면 좋은 질문과 답변 자료가 여러 곳에 흩어져 복습하기 어렵습니다. 사용자가 직접 면접 질문을 등록하고 질문에 대한 설명과 댓글을 공유하며 유용한 질문을 다시 학습할 수 있도록 돕는 서비스입니다.

**☀️ 주요 기능**

- 이메일·비밀번호 기반 회원가입 및 로그인
- 프로필 이미지와 닉네임을 포함한 회원정보 관리
- 면접 질문 등록, 조회, 수정, 삭제
- FRONTEND, BACKEND, CS 카테고리별 질문 필터링
- 질문에 대한 찬성·반대 투표 및 투표 취소
- 질문별 댓글 등록, 수정, 삭제
- 선정된 질문 목록과 페이지네이션
- 매일 아침 선정 질문을 받을 카테고리 설정
- Discord 계정 OAuth 연동 및 알림 설정
- JWT 기반 Access Token·Refresh Token 인증 및 Access Token 자동 재발급

**👥 개발 인원 및 기간**

| 구분 | 내용 |
| --- | --- |
| 개발 인원 | 프론트엔드 1명 |
| 개발 기간 | 2026.07.16 ~ 2026.08.07 |
| 담당 | React 기반 UI 구현, API 연동, 인증 처리, 테스트 및 배포 설정 |

**⚙️ 기술 스택**

| 분류 | 기술 및 도구 |
| --- | --- |
| Frontend | React 19, JavaScript |
| Routing | React Router 7 |
| 인증 | JWT, Discord OAuth |
| Test | Vitest | 
| Deployment | Docker, Nginx, GitHub Actions |
| Runtime | Node.js 22 |
| 협업 및 형상 관리 | Git, GitHub |

**🗂️ 폴더 구조**

```text
.
├── public/                     # favicon, 공용 SVG 아이콘
├── src/
│   ├── api/                    # 인증·게시판·댓글·사용자 API 모듈
│   ├── assets/                 # 폰트 등 번들에 포함되는 에셋
│   ├── components/             # Header, Input, Modal, 카테고리 UI 등 공통 컴포넌트
│   ├── pages/                  # 페이지 단위 기능과 페이지 전용 스타일·유틸
│   │   ├── loginPage/
│   │   ├── signupPage/
│   │   ├── boardPage/
│   │   ├── boardDetailPage/
│   │   ├── postWritePage/
│   │   ├── boardEditPage/
│   │   ├── selectedBoardPage/
│   │   ├── userEditPage/
│   │   ├── passwordEditPage/
│   │   └── notificationSettingsPage/
│   ├── routes/                 # BrowserRouter와 라우트 정의
│   ├── utils/                  # 검증, 날짜·이미지 변환, 카테고리 등 공통 로직
│   ├── index.css               # 전역 스타일
│   └── main.jsx                # 애플리케이션 진입점
├── docs/                       # 테스트 규칙 및 화면 자료
├── .github/workflows/ci-cd.yml # GitHub Actions 빌드·Docker·EC2 배포
├── .env.production             # 배포 환경 API 주소
├── Dockerfile                  # React 빌드 및 Nginx 이미지 구성
├── nginx.conf                  # SPA 라우팅 및 API 프록시 설정
├── vite.config.js              # Vite 설정 및 @ alias
└── package.json                # 실행·빌드·테스트 스크립트
```

페이지별 기능은 `src/pages/<pageName>/` 안에서 관리하고, 여러 페이지에서 재사용하는 UI는 `src/components/`, API 요청은 `src/api/`로 분리했습니다. 테스트 파일은 테스트 대상 코드와 같은 디렉터리에 배치했습니다.

**🖥️ 서비스 화면**

**🖼️ 화면 구성**

`홈`

| 로그인 | 회원가입 |
| --- | --- |
| <img src="docs/screens/로그인.png" width="300" alt="로그인" /> | <img src="docs/screens/회원가입.png" width="300" alt="회원가입" /> |

`게시글 목록`

| 전체 게시글 | 선정된 게시글 |
| --- | --- |
| <img src="docs/screens/면접 질문 게시판1.png" width="300" alt="전체 게시글" /> | <img src="docs/screens/선정된 면접 질문 게시판.png" width="300" alt="선정된 게시글" /> |

`게시글 작성 / 상세 / 수정 / 삭제`

| 게시글 작성 | 게시글 상세 | 게시글 수정 | 게시글 삭제 |
| --- | --- | --- | --- |
| <img src="docs/screens/질문 등록 페이지.png" width="220" alt="게시글 작성" /> | <img src="docs/screens/게시판 상세 페이지.png" width="220" alt="게시글 상세" /> | <img src="docs/screens/게시글 수정 페이지.png" width="220" alt="게시글 수정" /> | <img src="docs/screens/게시글 삭제 문구.png" width="220" alt="게시글 삭제" /> |

`댓글 목록 / 등록 / 삭제`

| 댓글 목록 및 등록 | 댓글 삭제 |
| --- | --- |
| <img src="docs/screens/게시판 상세 페이지.png" width="300" alt="댓글 목록 및 등록" /> | <img src="docs/screens/댓글 삭제 문구.png" width="300" alt="댓글 삭제" /> |

`회원정보 / 비밀번호 / 탈퇴`

| 회원정보 수정 | 비밀번호 수정 | 회원 탈퇴 |
| --- | --- | --- |
| <img src="docs/screens/내정보 페이지.png" width="250" alt="회원정보 수정" /> | <img src="docs/screens/비밀번호 수정 페이지.png" width="250" alt="비밀번호 수정" /> | <img src="docs/screens/회원 탈퇴 모달.png" width="250" alt="회원 탈퇴" /> |

`알림 설정`

| Discord 연동 및 알림 설정 |
| --- |
| <img src="docs/screens/디스코드 연결 페이지.png" width="450" alt="Discord 연동 및 알림 설정" /> |

**🔄 서비스 흐름**

```text
로그인/회원가입
      ↓
면접 질문 게시판 ──→ 선정된 질문
      ↓                 ↓
질문 상세 ←──── 투표·댓글 ──┘
      ↓
알림 설정 ──→ Discord 연동 및 카테고리별 알림 수신
```

**🧪 테스트**

Vitest와 Testing Library를 사용해 API 모듈, 공통 컴포넌트, 페이지별 유틸리티, 주요 페이지 동작을 테스트했습니다.

```bash
npm run test:run
npm run lint
npm run build
```

위 명령은 로컬 개발자가 변경 사항을 검증할 때 사용합니다. 운영 빌드와 배포는 GitHub Actions가 담당합니다.

**🚀 실행 방법**

Node.js 22 환경을 기준으로 합니다.

```bash
npm run dev
```

기본 개발 API 주소는 `http://localhost:8080`이며, 다른 주소를 사용할 경우 `VITE_API_BASE_URL` 환경 변수로 변경할 수 있습니다.

로컬에서 프로덕션 번들을 미리 확인하려면 다음 명령을 사용합니다.

```bash
npm run build
npm run preview
```
