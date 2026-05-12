# Kronopia

5-버티컬 컨텐츠 포트폴리오 + 공통 회원 영역. 각 버티컬은 독립 서브도메인 + 독립 자동발행 파이프라인.

## 버티컬 맵

| 버티컬 | 도메인 | 콘텐츠 | 상태 |
|---|---|---|---|
| SAP | `kronopia.com` (apex, Blogger 커스텀 연결 — 2026-05-12 재연결) | 수동 (signalloop.blogspot.com) | 라이브, AdSense 본진 (Pub `pub-3356024734687672`, 검증 진행 중) |
| 도시역사 | `history.kronopia.com` (Hugo + GitHub Pages) | 자동 + 승인 | 라이브, 파이프라인 구축 중 |
| AI지식 | `ai.kronopia.com` (예정) | 자동 + 승인 | 계획 |
| IT기기 | `tech.kronopia.com` (예정) | 자동 + 승인 | 계획 |
| 복리 | `fire.kronopia.com` (예정) | 자동 + 승인 | 계획 |
| 회원 영역 | `app.kronopia.com` | Next.js | 인프라 ✓, custom domain 미연결 |

## 모노레포 구조

```
blog/    Hugo (history.kronopia.com 서빙) + PaperMod
app/     Next.js + TS + Tailwind, Vercel 배포 (app.kronopia.com 예정)
```

향후 vertical 추가 시 `ai/`, `tech/`, `fire/` 폴더가 형제로 들어옴 (각자 hugo.toml + 별도 GH workflow).

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
| `kronopia-planner` | Sonnet | Read/Grep/Glob/WebFetch (코드 수정 ❌) | 사용자 요청 외 작업 계획에 끼지 않음 |
| `kronopia-coder` | Sonnet + Ollama | Read/Write/Edit/Bash + ollama_generate (외부 검색 ❌) | task 외 파일 수정 금지, 항상 plan-first |
| `kronopia-reviewer` | Opus | Read/Grep/Glob/Bash(read-only) | diff 밖 코드 BLOCKER로 평가 금지 |

`~/.claude/settings.json`의 `permissions.deny`에 위험 명령 26종 차단:
`rm -rf`, `git push --force`, `git reset --hard`, `--no-verify`, `.env*` 직접 수정, `node_modules/` 직접 수정 등.

### 권장 spawn 패턴

코드 변경이 들어가는 작업은 항상 **plan-approval 명시**:

```
kronopia-planner와 kronopia-coder, kronopia-reviewer를 spawn해.
코더는 plan approval required로 — 코드 수정 전 반드시 계획을 lead에게 제출하고 
승인받아야 시작.

작업: <구체적인 작업>
```

분석·검토만 필요하면 코더 없이:

```
kronopia-planner와 kronopia-reviewer만 spawn해. 코드 변경 없음.
작업: <분석/검토 작업>
```

### 작업 감사 로그 (`.kronopia-runs/`)

`~/.claude/hooks/kronopia-stop.py` Stop 훅이 매 턴 종료 시 자동 누적:

```
.kronopia-runs/
└── YYYY-MM-DD/
    ├── lead-<team>.md
    ├── kronopia-planner.md
    ├── kronopia-coder.md
    ├── kronopia-reviewer.md
    └── solo-<sid8>.md       # 팀 없이 단독 세션일 때
```

각 파일은 turn별로 시각·세션ID·사용된 툴·사용자 메시지·어시스턴트 응답 누적.
gitignore 처리됨 (public repo로 대화 노출 방지). 원본 raw는 `~/.claude/projects/.../<session>.jsonl`.

## 단계별 계획

전체 계획은 `~/.claude/plans/typed-yawning-noodle.md` 참고.

- [x] Phase 0: 스캐폴딩
- [ ] Phase 1: 버티컬 인프라 + 콘텐츠 파이프라인
  - [x] 1.1 도메인 + DNS (kronopia.com 구매, Cloudflare DNS 관리)
  - [x] 1.2 도시역사 버티컬 라이브 (history.kronopia.com, GitHub Pages, HTTPS)
  - [x] 1.2b SAP Blogger를 kronopia.com (apex)에 재연결, AdSense 검증 (2026-05-12 최종)
  - [ ] 1.3 자동발행 파이프라인 (도시역사용) — 사용자 별 트랙
  - [ ] 1.4 향후 버티컬 (AI지식 / IT기기 / 복리) — 도시역사 안정화 후
  - [~] 1.5 Blogger 선별 이전 — 폐기 (Blogger는 SAP 버티컬로 유지)
- [ ] Phase 2: 소셜 로그인 + 회원 영역
  - [x] 2.1 Google OAuth + Supabase 프로필 영속화
  - [x] 2.2 Naver OAuth
  - [x] 2.3 회원 home 레이아웃 (구성 C — 프로필 / 블로그 피드 / Phase 3 슬롯)
  - [x] 2.4 로그인 에러 UI + 닉네임 편집 (+ signIn upsert 회귀 fix)
  - [~] 2.5 앱 도메인 연결 — 2.5a (BLOG_FEED_URL) ✓, 2.5b (Vercel custom domain) 보류
- [ ] Phase 3: 결제 + 자료방 + 서비스 마켓플레이스
