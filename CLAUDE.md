# 소리결 (소리의 과학과 생활) 운영 안내

이 폴더는 소리결 사이트의 소스입니다. 데시벨·주파수 같은 소리의 원리, 이어폰·소음과 청각 건강, 층간소음·방음·잔향을 공식 자료로 확인해 쉬운 해요체로 풀어 쓰는 정적 사이트입니다. guideruri.com(`D:\guidejung\key\digital-guide-site`)과 같은 방식으로 만들었고, 글은 공유하지 않습니다.

## 구조
- `config.mjs`: 도메인(ORIGIN), 사이트 이름, 필명(AUTHOR, 기본 ‘소리지기’), 이메일, **운영자 이야기(OPERATOR_STORY)**. 도메인이 바뀌면 여기만 고칩니다.
- `guides.mjs`: 모든 글. 새 글은 배열 **맨 앞**에 추가합니다.
  형식: slug, cat('소리의 원리'|'청각과 건강'|'공간과 소리'), icon('wave'|'ear'|'room'), title, desc, time, published/modified/reviewed, lead, note, sections([소제목, 본문], 본문 문단은 `\n\n`), extra(정리표 HTML), faq, sources([이름, URL]).
- `figures.mjs`: 글에 들어가는 그림. `chart()`로 식이나 기준값에서 직접 그린 SVG, 또는 `src: '/images/…png'`로 직접 캡처한 화면. `after`는 몇 번째 소제목 뒤에 넣을지(0부터).
- `shots.mjs`: 데시벨 계산기 화면을 Playwright로 캡처해 `images/`에 저장(미리보기 서버 8799 필요). Playwright는 `D:\guidejung\toss-src\tools\node_modules`를 빌려 씁니다.
- `tool.js`: 데시벨 계산기(두 소리 합치기, 거리 감쇠, NIOSH 노출 시간).
- 빌드: `node build.mjs && node optimize.mjs` → `dist/` (git에는 안 올림, Actions가 빌드). 페이지·사이트맵(xml·html)·RSS·ads.txt·CNAME·.nojekyll·애드센스 코드가 자동으로 들어갑니다.
- 미리보기: `python -m http.server 8799 --directory dist`

## 배포
- 저장소: kenshin240919-web/sorigyeol-site (**공개**, 키·개인정보 금지). `main`에 push하면 `.github/workflows/pages.yml`이 빌드해 GitHub Pages로 배포합니다.
- 도메인: Cloudflare에서 구매·DNS 관리. A 레코드 4개(185.199.108.153 / 109 / 110 / 111) + `www` CNAME → `kenshin240919-web.github.io`, **프록시 끔(회색 구름, DNS only)**. HTTPS 인증서는 GitHub가 발급·갱신합니다.

## 매일 자동 발행
- Claude 데스크톱 예약 작업 **`sorigyeol-daily-post`**(매일 09:00쯤). 지시문: `C:\Users\User\.claude\scheduled-tasks\sorigyeol-daily-post\SKILL.md`. 앱이 꺼져 있으면 다음에 켤 때 실행됩니다.
- 오늘 날짜 글이 이미 있으면 발행하지 않습니다.

## 지킬 것
- 공식·공신력 있는 출처(WHO, NIH/NIDCD, CDC/NIOSH, 질병관리청, 국가법령정보센터, 환경부, 대학·학회)를 직접 읽고 확인한 내용만 씁니다. `sources`에는 실제로 읽은 URL만.
- 경험·측정값·사례를 지어내지 않습니다. 식으로 계산한 값은 ‘계산 예시’라고 밝힙니다.
- 모든 글은 `anthropic-skills:korean-blog-anti-slop` 스킬로 다듬은 뒤 올립니다.
- 기존 글을 고쳐도 `published`·`modified`는 바꾸지 않습니다. 전날로 소급하지 않습니다.
- 애드센스 `ca-pub-1265732107215441`, `ads.txt`, CNAME은 그대로 둡니다. 유료 API는 쓰지 않습니다.

## 애드센스 신청 시점
- guideruri는 글 약 15편, ads.txt 없이 신청해 ‘가치가 별로 없는 콘텐츠’로 거절됐습니다.
- 소리결은 **글 25~30편 + 소개 페이지에 실제 운영자 이야기(OPERATOR_STORY)**가 들어간 뒤 사용자에게 먼저 알리고 신청합니다.
