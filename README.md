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

## 단계별 계획

전체 계획은 `~/.claude/plans/typed-yawning-noodle.md` 참고.

- [x] Phase 0: 스캐폴딩
- [ ] Phase 1: 도메인 연결 + Blogger 선별 이전 + 자동화 연동
- [ ] Phase 2: 소셜 로그인 (Google + Naver) + 회원 영역
- [ ] Phase 3: 결제 + 자료방 + 서비스 마켓플레이스
