# GSP DVT 결과 보드 — 인수인계 · TODO

- 공개 주소: https://gsp-dvt.vercel.app (Vercel 프로젝트 `gsp-dvt`, 팀 vibe-code-class, 로그인 보호 꺼짐)
- 브랜치: `ChadKim0119/ccb` 의 `dvt-board` (main과 이력이 이어지지 않은 독립 브랜치, main은 acos-ccb 보드)
- 현재 버전: v1 (2026.11.14) · 메인 5장 + Appendix 7장
- 데이터 기준: Confluence GSP 3차 DVT 결과 v4(11/12 누적), PM 정례 10/07·10/21·10/28·11/03·11/11, E2E 사전준비(11/11), GSP DB 이슈트래킹(11/11)
- 스타일·엔진 원본: acos-ccb 핸드오프 문서 https://claude.ai/artifact/Jb2H7fU6BsKfnhW3UA2qbp (구성 요소 1~7번 엔진 재사용)

## 파일 구조

| 파일 | 역할 |
|---|---|
| `src/content.js` | 화면의 모든 문구·숫자. 고칠 곳은 대부분 여기 |
| `src/app.js` | 페이지 렌더 함수(vSummary·vRounds·vWhy·vRemain·vPlan·Appendix)와 패널 내용(panelContent). `/*__ENGINE__*/` 자리에 engine.js가 들어감 |
| `src/engine.js` | ccb 엔진(페이지 넘김·레일·fit·휠·토글·패널·합계 오버레이·전체 화면) — 가능하면 수정하지 않음 |
| `src/shell_head.html` · `src/extra.css` | ccb CSS·셸 / DVT 보드 전용 CSS |
| `src/assemble.py` · `src/build_html.js` | 조립·빌드 |
| `index.html` | 배포물(빌드 결과를 루트로 복사) |

## 빌드·배포

```bash
cd src
python3 assemble.py              # shell_head + extra.css + app.js + engine.js → page.html
node build_html.js               # content.js 를 page.html 에 넣어 out/index.html 생성
cp out/index.html ../index.html  # 루트 배포물 갱신
```

- 이 브랜치는 Vercel 자동 배포에 **연결되어 있지 않음**. 푸시 후 Vercel에서 `gsp-dvt` 프로젝트로 배포를 직접 만들어야 함
  (예: Vercel MCP `create_deployment` — project `gsp-dvt`, target `production`, gitSource github ChadKim0119/ccb, ref `dvt-board`, sha 최신 커밋)
- 배포 후 확인: https://gsp-dvt.vercel.app 로그인 없이 열림, `/src/content.js` 404
- `content.js` 의 `meta.changelog` 맨 위에 버전 항목 추가(v2, 날짜, 변경 내용)

## TODO (우선순위 순)

### 1. 데이터 갱신 (v2)
- [ ] 3차 DVT 결과 11/13 이후 반영 — Confluence 페이지 1133412396 (`daily.r3area`, `daily.r3day`, `rounds[2]`, `remain.r3`)
  - VDP Diag 24 TC(11/13 1차) 결과, 11/16~11/19 결과
- [ ] 11/13 HU SW 업데이트·MM Provisioning 재시험 결과 반영 (`ntWhy.blockers` 의 `hu`, `cable` 카드 when/facts)
- [ ] VDP Diag 2차(11/16~20) 진행 결과 반영 (`vdp` 카드)
- [ ] DVT 종료일 확정 여부 반영 — 출처 불일치: 11/17(E2E 세부일정) / 11/19 TBD(3차 결과표) / 11/20 전후(11/03 PM)
- [ ] 11/18 이후 PM 정례회의록에서 DVT 연장·CCB 관련 결정 확인 → `summary.status`, `plan` 문구 수정
- [ ] 각 수치 변경 시 헤드라인(`summary.headline`, 각 장 h2 — app.js 에 일부 하드코딩)도 함께 수정

### 2. 근거 보강
- [ ] TC 엑셀 본문으로 NT 사유 행 단위 집계 — v1은 엑셀을 내려받지 못해 영역 단위(CCW 236 / GS 59 / OPW 28)까지만 확정
  - 대상: 2차 결과 페이지 1103003658 첨부 `20261030_GS_DVT_SystemTestCase_v1.4.xlsx`, `20261029_eCare_DVT_SystemTestCase_v1.3.xlsx`
  - 결과로 `ntWhy.blockers[].tc` 를 건수로 바꾸고, 3장 막대를 원인 조직별 건수로 재구성
- [ ] 3차 DMS 연동 27 TC의 2차 근거 확인 — 3차 표기는 "Fail 6 + NT 21"인데 2차 Fail은 GS 5·OPW 3뿐 (`remain.carryNote`)
- [ ] "3차 범위 밖 NT 281건"(= 323 − 42) 산식 재검증 — OPW·DMS 27이 2차 OPW NT 28에 대응한다는 가정
- [ ] MM 업데이트 후 재수행 TC 건수(11/11 PM 합의)가 3차 결과표에 추가됐는지 확인

### 3. 화면 개선
- [ ] 3장 `sbar` 의 GS·OPW 구간이 좁아 라벨이 잘림 — 라벨을 막대 아래로 빼거나 툴팁 처리
- [ ] 5장 간트 핀 라벨(HU 업데이트·VDP Diag 1차)이 좁은 화면에서 왼쪽으로 잘림 — 1280×720, 폭 390 확인
- [ ] 2장 추이 그래프에 3차 일별 추이 추가 검토
- [ ] 폭 390(모바일) 전 페이지 점검, playwright로 콘솔 오류 0건 확인

### 4. 운영
- [ ] 공개 범위 재확인 — 실명·이슈 번호·TMKR 비용 의견(11/11 PM, 합의 아님) 포함. 외부 공유 전 TMKR 공유용 문구 검토
- [ ] 필요 시 `dvt-board` 를 자동 배포로 연결(Vercel 프로젝트에 Git 연결 + production branch = dvt-board)
- [ ] 갱신 결과를 GS_DB 프로젝트 문서 `claude/GSP_DVT_결과_통합_20261114.md` 에도 반영(날짜 붙여 새 판)

## 지켜야 할 원칙
- 숫자·사실은 Confluence·회의록·GSP DB 기록 기준. 출처 없는 수치는 넣지 않고, 계산값은 "산식"으로 표시
- 원인 제공 조직 분류는 귀책 판정이 아니라 다음 행동 분류(화면 문구 유지)
- 5장 제안 일정은 "(안)" 표기 유지 — 합의 전까지 확정처럼 쓰지 않음
- 합계 숫자는 `data-sum` / `data-sp` 로 연결해 클릭 시 계산식이 맞는지 확인
