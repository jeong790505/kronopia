# signalloop

개인 홈페이지 모노레포. 정적 블로그(Hugo) + 동적 앱(Next.js) 하이브리드 구조.

## 구조

```
blog/    Hugo + PaperMod, GitHub Pages 배포 (메인 도메인)
app/     Next.js + TS + Tailwind, Vercel 배포 (app.<도메인>)
```

## 로컬 개발

```bash
# 블로그
cd blog && hugo server -D

# 앱
cd app && npm run dev
```

## 배포

- `blog/` 변경 시 `.github/workflows/deploy-blog.yml`가 자동 빌드 → GitHub Pages
- `app/` 변경 시 Vercel이 자동 빌드 (Phase 2 이후 연결)

## 콘텐츠 추가

`blog/content/posts/<category>/<slug>.md` 형식. 카테고리: `tech` / `essay` / `tutorial`.

`blog_automation` 파이프라인이 생성한 마크다운(`passed: true`)을 위 경로로 복사하면 푸시만으로 배포됨.

## Agent Teams 운영

### 에이전트 가두리 (Guardrails) — 셋업 완료

각 teammate는 **물리적·구조적 제약**으로 범위 이탈이 봉쇄돼 있음:

| Teammate | 모델 | 도구 권한 | 핵심 제약 |
|---|---|---|---|
| `signalloop-planner` | Sonnet | Read/Grep/Glob/WebFetch (코드 수정 ❌) | 사용자 요청 외 작업 계획에 끼지 않음 |
| `signalloop-coder` | Sonnet + Ollama | Read/Write/Edit/Bash + ollama_generate (외부 검색 ❌) | task 외 파일 수정 금지, 항상 plan-first |
| `signalloop-reviewer` | Opus | Read/Grep/Glob/Bash(read-only) | diff 밖 코드 BLOCKER로 평가 금지 |

`~/.claude/settings.json`의 `permissions.deny`에 위험 명령 26종 차단:
`rm -rf`, `git push --force`, `git reset --hard`, `--no-verify`, `.env*` 직접 수정, `node_modules/` 직접 수정 등.

### 권장 spawn 패턴

코드 변경이 들어가는 작업은 항상 **plan-approval 명시**:

```
signalloop-planner와 signalloop-coder, signalloop-reviewer를 spawn해.
코더는 plan approval required로 — 코드 수정 전 반드시 계획을 lead에게 제출하고 
승인받아야 시작.

작업: <구체적인 작업>
```

분석·검토만 필요하면 코더 없이:

```
signalloop-planner와 signalloop-reviewer만 spawn해. 코드 변경 없음.
작업: <분석/검토 작업>
```

### 작업 감사 로그 (`.signalloop-runs/`)

`~/.claude/hooks/signalloop-stop.py` Stop 훅이 매 턴 종료 시 자동 누적:

```
.signalloop-runs/
└── YYYY-MM-DD/
    ├── lead-<team>.md
    ├── signalloop-planner.md
    ├── signalloop-coder.md
    ├── signalloop-reviewer.md
    └── solo-<sid8>.md       # 팀 없이 단독 세션일 때
```

각 파일은 turn별로 시각·세션ID·사용된 툴·사용자 메시지·어시스턴트 응답 누적.
gitignore 처리됨 (public repo로 대화 노출 방지). 원본 raw는 `~/.claude/projects/.../<session>.jsonl`.

## 단계별 계획

전체 계획은 `~/.claude/plans/typed-yawning-noodle.md` 참고.

- [x] Phase 0: 스캐폴딩
- [ ] Phase 1: 도메인 연결 + Blogger 선별 이전 + 자동화 연동
- [ ] Phase 2: 소셜 로그인 + 회원 영역
  - [x] 2.1 Google OAuth + Supabase 프로필 영속화
  - [x] 2.2 Naver OAuth
  - [ ] 2.3 회원 home 레이아웃 (구성 C — 프로필 / 블로그 피드 / Phase 3 슬롯)
  - [ ] 2.4 로그인 에러 UI + 프로필 편집
  - [ ] 2.5 앱 도메인 연결 (Vercel custom domain)
- [ ] Phase 3: 결제 + 자료방 + 서비스 마켓플레이스
