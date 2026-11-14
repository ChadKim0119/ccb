// GSP DVT 결과 보드 — 화면의 모든 문구와 숫자는 이 파일 한 곳에서 나온다.
// 기준: Confluence GSP (1·2·3차 DVT 결과, PM 정례 10/07·10/21·10/28·11/03·11/11, E2E 사전준비 11/11),
//       GSP DB(GSP_이슈트래킹_통합_최신 11/11, GSP_DVT_Kensho_일정_최신 11/11). 조회일 2026-11-14.
const W = "https://toyotasystem.atlassian.net/wiki/spaces/GSP/pages/";
const src = {
  r1: { t: "1차 DVT 결과", u: W + "1077018632" },
  r2: { t: "2차 DVT 결과", u: W + "1103003658" },
  r3: { t: "3차 DVT 결과 (v4, 11/12)", u: W + "1133412396" },
  st: { t: "DVT_SystemTest (TC 문서)", u: W + "1016135985" },
  pm1007: { t: "(10/07) PM 정례회의", u: W + "1079279680" },
  pm1021: { t: "(10/21) PM 정례회의", u: W + "1100906654" },
  pm1028: { t: "(10/28) PM 정례회의", u: W + "1113784433" },
  pm1103: { t: "(11/03) PM 정례회의", u: W + "1121189948" },
  pm1111: { t: "(11/11) PM 정례회의", u: W + "1137704961" },
  pre: { t: "E2E 사전준비 (11/11)", u: W + "1133608962" },
  sch: { t: "E2E 세부일정 (11/03)", u: W + "1121320967" },
  db: { t: "GSP DB · 이슈트래킹 통합본 (11/11)", u: "" },
};

// ── 차수별 최종 결과 ──
const rounds = [
  { id: "r1", name: "1차", period: "10/06 ~ 10/14", scope: "GS", tc: 290, pass: 132, fail: 14, nt: 144, rest: 0, src: "r1",
    note: "e-Care 미실시(9/22 계획: “e-Care가 테스트 불가라서 GS만”)" },
  { id: "r2", name: "2차", period: "10/22 ~ 10/30", scope: "GS + e-Care(OPW·CCW)", tc: 854, pass: 523, fail: 8, nt: 323, rest: 0, src: "r2",
    note: "CCW 236 TC 전량 NT (CTI 미개발)" },
  { id: "r3", name: "3차", period: "11/11 ~ (진행 중)", scope: "GS + e-Care + DMS + VDP Diag", tc: 80, pass: 18, fail: 5, nt: 33, rest: 24, src: "r3",
    note: "11/12 누적. 미수행 24건은 VDP Diag 신규 TC(11/13 TMC와 시험 예정)" },
];

// ── 일별 기록 ──
const daily = {
  r1: { head: ["일자", "Acted", "Pass", "Fail", "NT", "Remained TC"], rows: [
    ["10/06", "40", "22", "15", "3", "250"],
    ["10/07", "290", "50", "207", "33", "0"],
    ["10/08", "125", "36", "52", "37", "165"],
    ["10/12", "215", "71", "106", "38", "75"],
    ["10/13", "290", "119", "14", "157", "-"],
    ["10/14 (통합)", "290", "132", "14", "144", "-"],
  ], notes: [
    "원본 표의 Planned(old)는 일자별 38·64·69·56·63, 합계 290. 10/12·10/13은 Planned(new) 82·83으로 재계획",
    "10/07 Fail 207건 → 10/13 14건: 10/07 PM 정례에서 “Block 분류 폐지, Block은 Fail로 재분류, NT는 진입 자체가 불가한 항목으로 한정”하기로 한 뒤 재판정·재시험이 이어짐",
    "GSP DB 정리: 10/13 NT 157건 중 112건이 선행 Fail에 의한 Block(ADF 미등록, Skip Vehicle Association 등)",
  ] },
  r2cum: { head: ["일자", "누적 Acted", "Pass", "Fail", "NT", "비고"], rows: [
    ["10/22", "598", "199", "37", "362", "CCW 236 포함"],
    ["10/23", "667", "350", "29", "288", "ADF 선행조건 NT를 시험 가능 조건으로 변경"],
    ["10/26", "755", "411", "30", "314", "Fail에 의한 Blocked 포함"],
    ["10/28", "833", "501", "16", "316", ""],
    ["10/29", "839", "512", "13", "314", ""],
    ["10/30", "854", "523", "8", "323", "최종"],
  ] },
  r2area: { head: ["영역", "TC", "Pass", "Fail", "NT"], rows: [
    ["Global South (GS)", "326", "262", "5", "59"],
    ["오퍼레이션 웹 (OPW)", "292", "261", "3", "28"],
    ["콜센터 웹 (CCW)", "236", "0", "0", "236"],
    ["합계", "854", "523", "8", "323"],
  ] },
  r3area: { head: ["영역", "TC", "구성", "Pass", "Fail", "NT", "미수행"], rows: [
    ["GS", "20", "2차 Fail 5 + NT 15", "2", "3", "15", "0"],
    ["e-Care (OPW)", "9", "2차 Fail 3 + NT 6", "9", "0", "0", "0"],
    ["DMS 연동", "27", "Fail 6 + NT 21", "7", "2", "18", "0"],
    ["VDP (Diag) 연동", "24", "3차 신규 TC", "0", "0", "0", "24"],
    ["합계", "80", "", "18", "5", "33", "24"],
  ] },
  r3day: { head: ["일자", "Planned", "Acted", "Pass", "Fail", "NT", "Remained TC"], rows: [
    ["11/11", "-", "55", "11", "9", "35", "25"],
    ["11/12", "1", "8", "7", "1", "0", "24"],
    ["11/12 누적", "", "56", "18", "5", "33", "24"],
    ["11/13", "24", "", "", "", "", ""],
    ["11/16 ~ 11/19", "TBD", "", "", "", "", ""],
  ], notes: [
    "11/12 Acted 8건 중 7건은 11/11 Fail 재시험(누적 Acted 55 → 56). 누적 Fail 9 → 5, NT 35 → 33",
    "OPW 9건은 2차 Fail 3 + NT 6 전량 Pass(11/12)",
    "11/13 이후 결과는 Confluence에 아직 게시되지 않음(조회 11/14). 결과 페이지에는 첨부가 없음 — LG U+ 보안정책(SASE)으로 업로드 실패(ISS-037)",
  ] },
};

// ── NT 원인 (2차 NT 323건을 영역 → 차단 요인으로 분해) ──
const ntWhy = {
  total: 323,
  parts: [
    { k: "ccw", label: "CCW", n: 236, cause: "CTI 미개발", owner: "tck", fact: "10/21 PM: “Call Center Web은 CTI 미연동 항목에 대해 사유를 기재하여 N/T 처리”. 11/03 PM: “CTI 미개발 영향으로 N/T 비중이 높은 상황”" },
    { k: "gs", label: "GS", n: 59, cause: "HU·MM·GSA + 선행 Fail", owner: "mix", fact: "2차 결과표: “Fail에 의한 Blocked 포함”. 11/11 PM: “MM Update 이후 기존 N/T였던 요금제/Provisioning 관련 항목 재검증”" },
    { k: "opw", label: "OPW", n: 28, cause: "VDP·DMS 연동", owner: "mix", fact: "10/21 PM: “TMC/VDP, TCK/CTI, DMS 등 외부 연동 제약으로 전체 TC 수행 제한”. 10/28 PM: “e-Care는 Emulator 기반 검증 비중이 높아 실제 연동 검증에는 제약”" },
  ],
  // 원인 제공 조직별 차단 요인. tc = 영향 TC(근거가 있는 숫자만), when = 해소 예정
  owners: [
    { id: "tmc", name: "TMC", sub: "일본 원청 · VDP · TSC", tone: "a" },
    { id: "tck", name: "TMKR 측 협력사", sub: "TCK(CTI) · SE파트너스(DMS)", tone: "b" },
    { id: "lgu", name: "LG U+", sub: "단말 개통 · uCube · 장비", tone: "c" },
    { id: "dsn", name: "Dasan", sub: "개발 · 시험 수행", tone: "d" },
  ],
  blockers: [
    { id: "cti", owner: "tck", title: "CTI 미개발 → 콜센터 웹 시험 불가", iss: "ISS-001", tc: "CCW 236 TC (2차 NT의 73%)", when: "12월 (확정일 없음)",
      facts: ["10/28 PM: 대체방안은 안정성 우려로 철회, 정식 추가 개발 착수 — 약 1개월 반 소요", "11/03 PM: 완료 시점 12월 수준, 실제 연동 가능 시점은 TCK와 재확인 필요", "E2E 사전준비 #10 CTI 중계: 상태 ‘외부일정대기’, 마감일 ‘???’, PIC TMKR", "GSP DB: TCK 견적이 Dasan 회신 누락으로 홀딩된 기간이 있었음(10/22, 권다운 지적)"],
      src: ["pm1028", "pm1103", "pre", "db"] },
    { id: "vdp", owner: "tmc", title: "VDP 접속정보 지연·오류 → e-Care 진단 데이터 미수신", iss: "ISS-002 · 025", tc: "VDP Diag 24 TC 미수행, OPW NT 일부", when: "11/13 1차 · 11/16 ~ 20 2차",
      facts: ["10/28 PM: 접속 지연 원인은 Endpoint URL·IP·API Key 등 접속정보 확보 지연. 접속 후에도 ‘유효하지 않은 차량’ Error", "GSP DB: TMC 접속정보·Endpoint·ID 안내 오류·누락이 10/6 ~ 11/2 반복(Dasan 정리표), CoCo 5 / Diag 032로 ID 안내 불일치", "11/11 Teams(이준제): “아직도 연동이 안 되기 때문에 의미는 없다, API 테스트 가능 여부만 의미”", "E2E 사전준비: VDP Diag 별도 접속정보 필요, GetAllDTC 결과 수신 테스트 지연(Backlog PRJ_0333-32)"],
      src: ["pm1028", "db", "pre"] },
    { id: "hu", owner: "tmc", title: "HU 소프트웨어가 SU#1 → MM Flag 미반환, HU 화면 시험 불가", iss: "ISS-003 · 004", tc: "GS NT 중 요금제·Provisioning·HU 화면 항목", when: "11/13 원격 업데이트(TMC 지원)",
      facts: ["11/03 PM: HU 물리 연결은 완료, Firmware 미수령으로 OTT·Wi-Fi·e-Care 화면 기반 검증 제한", "E2E 사전준비 #4 SU#2 H/U SW Update: ‘진행중’, PIC TMC", "11/11 TMC MM팀(Kawata): TMKR HU가 SU#1 SW라서 MM Provisioning 불가. TMC 사양 문제는 아님", "GSP DB는 원인을 ‘TMC 공급 HU SW 구버전 + 한국 측 업데이트 미실행’ 복합으로 기록"],
      src: ["pm1103", "pre", "db"] },
    { id: "gsa", owner: "tmc", title: "GSA 신규 버전·Auth0 → 딥링크 흰 화면", iss: "ISS-007", tc: "GS GSA·DeepLink 항목", when: "TMC 일정 대기",
      facts: ["E2E 사전준비 #14·#17: GSA App 신규 버전·Service Package 수정본 ‘외부일정대기’, PIC TMC", "GSP DB: Global App이 TMC Auth0(tr-th-acos)를 써서 Local App 딥링크 시 흰 화면 — TMC가 원인 인정(11/6)", "11/11 PM: DVT 3차 중점 항목에 GSA 설치·Login, DeepLink/상품가입 Flow 포함"],
      src: ["pre", "db", "pm1111"] },
    { id: "dtc", owner: "tmc", title: "DTC 재현 방법(CANoe) 미확정", iss: "Backlog PRJ_0333-54", tc: "e-Care 경고·DTC 시나리오", when: "미정",
      facts: ["E2E 사전준비 #5: e-Care 시험용 고장진단코드 생성·재현 ‘진행중’, TMC에서 유형별 코드 발생 필요, PIC TMC", "10/21 PM: CANoe 파일 제공을 TMC에 요청 중, 지연 시 TMC가 직접 Warning Event Trigger하는 방안 병행 문의"],
      src: ["pre", "pm1021"] },
    { id: "dms", owner: "tck", title: "DMS 사양 변경 지속 → 시나리오 재작성", iss: "ISS-008", tc: "DMS 연동 27 TC (3차 NT 18)", when: "API 5 → 24개 반영 중",
      facts: ["10/21 PM: DVT 진행 중 DMS 추가 요구사항이 지속 유입, 10/23 기준 개발 범위 Freeze 합의", "E2E 사전준비 #9: DMS API 개통 5 → 24개 변경, 시나리오 업데이트 필요, PIC TMKR", "e-Care IF 정의서 v1.23(11/05): warningClearFlag 처리 등 변경 계속", "11/11 e-Care4: DMS 칩 생성 기준 변경 제안(선호센터 칩 우선) — 결정 대기"],
      src: ["pm1021", "pre", "db"] },
    { id: "adf", owner: "lgu", title: "DCM 개통·ADF 미업로드 → 1차 NT의 주원인", iss: "ISS-018 · 032", tc: "1차 NT 157 중 Block 112(GSP DB)", when: "2차 착수 직후 정상화(10/23)",
      facts: ["10/21 PM: DVT 2차는 DCM ADF 미업로드로 제한. ADF가 정상화되지 않으면 1차와 동일한 제약이 발생하므로 2차 진행 자체를 재판단", "10/21 PM: LG전자에서 Firmware 업데이트 DCM 수령, uCube 개통·단말 등록 확인 후 ADF 재시도", "2차 결과(10/23): “NT 항목 중 ADF 선행 조건에 대해서 시험 가능 조건으로 변경” → NT 362 → 288", "GSP DB: 8840 DCM은 1A SIM이라 CV 전환 불가로 사용 중단"],
      src: ["pm1021", "r2", "db"] },
    { id: "ucube", owner: "lgu", title: "uCube API 오류·단말 개통 불일치", iss: "ISS-032 · 018", tc: "3차 단말·요금제 시험", when: "11/11 이후 정상화 예정",
      facts: ["GSP DB: 선개통 F30005, 부가서비스 삭제 오류, 서비스해지 F39999 — uCube 데이터 손상·6월 버전 복귀 영향", "E2E 사전준비 #11 U-Cube API 정상 처리(SU#2): ‘진행중’, PIC LGU+", "11/11 MVNO방: 오비고 MM 단말이 초기 uCube 강제 개통(LGU+ 명의)으로 조회 불가 → 검증계 서비스중지 해제"],
      src: ["db", "pre"] },
    { id: "cable", owner: "lgu", title: "HU-PC 연결 케이블 미보유 · 보안정책(SASE)", iss: "ISS-038 · 037", tc: "11/13 HU 업데이트 위험, 결과 문서 업로드 지연", when: "11/12까지 케이블 확보 필요",
      facts: ["GSP DB: 11/13 HU SW 업데이트에 필요한 HU-PC 케이블이 Dasan 장비 구성에 없음, 아이나비·오비고 대여 요청", "GSP DB: 10/29부터 LG U+ SASE로 외부 Confluence·Jira 업로드 제한 → 3차 결과 첨부 업로드 실패(11/11)"],
      src: ["db"] },
    { id: "fix", owner: "dsn", title: "2차 Fail 8건 수정 · 3차 재시험", iss: "ISS-009", tc: "GS Fail 5 · OPW Fail 3", when: "OPW 3건 11/12 Pass, GS 잔여 Fail 3",
      facts: ["11/03 PM: Fail 8건은 3차 전 수정 가능한 범위로 판단", "3차 11/12 누적: OPW 9건 전량 Pass, GS Pass 2 · Fail 3 · NT 15", "GSP DB: Dasan 측 CTI 견적 회신 누락(10/22)이 CTI 일정 홀딩에 영향"],
      src: ["pm1103", "r3", "db"] },
  ],
};

// ── 남은 TC ──
const remain = {
  // 3차 80 TC 현황
  r3: { pass: 18, fail: 5, nt: 33, rest: 24, tc: 80 },
  // 2차 NT 323 → 3차로 넘어간 NT
  carry: [
    { k: "GS", nt2: 59, in3: 15 },
    { k: "OPW·DMS", nt2: 28, in3: 27 },
    { k: "CCW", nt2: 236, in3: 0 },
  ],
  carryNote: "3차 범위 정의는 “2차 DVT의 fail 항목과 fail에 따른 N/T 항목”(3차 결과 페이지). 3차 NT 편성은 GS 15 + e-Care 6 + DMS 21 = 42. OPW·DMS의 27은 2차 OPW NT 28과 대응한다고 보고 계산한 값으로, DMS 27건의 2차 근거 행은 결과표에서 직접 확인되지 않음(2차 Fail은 GS 5·OPW 3뿐인데 3차 DMS는 Fail 6으로 표기)",
};

// ── 일정 (11/01 ~ 12/31) ──
const schedule = {
  axis: { start: [2026, 11], months: 2 },
  marker: { at: [2026, 11, 17], label: "11/17 DVT 종료(현행)" },
  rows: [
    { id: "dvt", label: "DVT 3차", sub: "GS · e-Care · DMS · VDP" },
    { id: "blk", label: "선행조건 해소", sub: "외부 의존" },
    { id: "ccw", label: "CCW 236 TC", sub: "CTI 선행" },
    { id: "e2e", label: "Kensho E2E", sub: "E2E 세부일정 11/03" },
  ],
  bars: [
    { row: "dvt", t: 0, kind: "dvt", plan: [[2026, 11, 11], [2026, 11, 17]], changed: [[2026, 11, 11], [2026, 11, 20]], pl: "3차 11/11 ~ 11/17", cl: "3차 연장(안) ~ 11/20", panel: "sched:dvt" },
    { row: "dvt", t: 1, kind: "add", plan: [[2026, 11, 16], [2026, 11, 20]], changed: [[2026, 11, 16], [2026, 11, 20]], pl: "", cl: "NT 재수행(안)", panel: "sched:rerun" },
    { row: "blk", t: 0, kind: "base", plan: [[2026, 11, 13], [2026, 11, 13]], changed: [[2026, 11, 13], [2026, 11, 13]], pl: "HU 업데이트", cl: "HU 업데이트", panel: "cause:hu" },
    { row: "blk", t: 0, kind: "base", plan: [[2026, 11, 16], [2026, 11, 20]], changed: [[2026, 11, 16], [2026, 11, 20]], pl: "VDP Diag 2차", cl: "VDP Diag 2차", panel: "cause:vdp" },
    { row: "blk", t: 1, kind: "base", plan: [[2026, 11, 13], [2026, 11, 13]], changed: [[2026, 11, 13], [2026, 11, 13]], pl: "VDP Diag 1차", cl: "VDP Diag 1차", panel: "cause:vdp" },
    { row: "blk", t: 1, kind: "open", plan: [[2026, 12, 1], [2026, 12, 31]], changed: [[2026, 12, 1], [2026, 12, 31]], pl: "CTI 개발 완료 12월 (일자 미정)", cl: "CTI 개발 완료 12월 (일자 미정)", panel: "cause:cti" },
    { row: "ccw", t: 0, kind: "risk", plan: [[2026, 12, 14], [2026, 12, 30]], changed: [[2026, 12, 14], [2026, 12, 30]], pl: "E2E 기간에 처음 시험", cl: "", panel: "sched:ccw" },
    { row: "ccw", t: 1, kind: "add", plan: [[2026, 12, 1], [2026, 12, 11]], changed: [[2026, 12, 1], [2026, 12, 11]], pl: "", cl: "CTI 완료 즉시 CCW DVT(안)", panel: "sched:ccw" },
    { row: "e2e", t: 0, kind: "e2e", plan: [[2026, 11, 23], [2026, 11, 30]], changed: [[2026, 11, 23], [2026, 11, 30]], pl: "24SU#2 LifeCycle", cl: "E2E 사전 테스트(GS)", panel: "sched:e2e" },
    { row: "e2e", t: 0, kind: "e2e", plan: [[2026, 12, 1], [2026, 12, 11]], changed: [[2026, 12, 1], [2026, 12, 11]], pl: "중점평가 · Ecall", cl: "중점평가 · Ecall", panel: "sched:e2e" },
    { row: "e2e", t: 1, kind: "e2e", plan: [[2026, 12, 14], [2026, 12, 30]], changed: [[2026, 12, 14], [2026, 12, 30]], pl: "e-Care · Deeplink/GSA", cl: "e-Care · Deeplink/GSA", panel: "sched:e2e" },
  ],
  points: [
    { at: [2026, 11, 13], label: "11/13 HU 업데이트 · VDP Diag 1차" },
    { at: [2026, 11, 20], label: "11/20 진척 보고회" },
  ],
};

module.exports = {
  meta: {
    title: "GSP DVT 결과 보드",
    owner: "LG U+",
    project: "Global South · e-Care",
    date: "2026.11.14",
    asof: "Confluence 11/12 · GSP DB 11/11 기준",
    modes: { plan: "현행 계획", planSub: "11/17 종료", changed: "제안", changedSub: "연장 · 분리" },
    changelog: [
      { v: "v1.1", at: "2026.11.14", items: [
        "화면 편집 기능 추가 — 상단 바 ✎ 편집에서 글자 수정, 도형(사각형 · 원 · 선 · 화살표 · 글상자), 블록 배경 · 글자색 변경",
        "수정 내용은 edits.json 에 저장되어 git(dvt-board)에 커밋되고, 자동 배포로 사이트에 반영 (저장은 GitHub 토큰이 있는 편집자만 가능)",
        "파비콘 추가. 보드의 숫자 · 근거 데이터는 v1 과 동일",
      ] },
      { v: "v1", at: "2026.11.14", items: [
        "1 · 2 · 3차 DVT 결과(Confluence)와 PM 정례 10/07 ~ 11/11, E2E 사전준비, GSP DB 이슈트래킹을 한 보드로 정리",
        "NT 원인을 원인 제공 조직(TMC · TMKR 측 협력사 · LG U+ · Dasan)별로 분류",
        "3차 결과는 11/12 누적까지 반영. 11/13 HU 업데이트 · VDP Diag 1차 결과는 미게시라 미반영",
      ] },
    ],
  },
  src, rounds, daily, ntWhy, remain, schedule,
  summary: {
    kicker: "DVT 1 · 2 · 3차 종합 · 2026.11.12 누적",
    headline: "DVT 종료(11/17)를 앞둔 11/12 기준, 3차 80 TC 중 Pass는 18건. NT는 결함이 아니라 ‘시험 진입 불가’이고, 원인은 외부 연동과 시험 환경에 있다",
    ask: "그래서 DVT는 11/17에 닫지 말고, 선행조건이 풀리는 일정에 맞춰 연장 · 분리해야 한다",
    steps: [
      { n: 1, tag: "사실", title: "NT가 줄지 않았다", body: "1차 NT 144(50%), 2차 NT 323(38%), 3차 11/12 기준 NT 33 + 미수행 24. 2차 NT의 73%가 CCW 236 TC", link: "차수별 결과 보기", go: "rounds" },
      { n: 2, tag: "원인", title: "NT는 ‘진입 불가’ — 외부 연동 · 환경 때문", body: "10/07 PM 합의: NT는 진입 자체가 불가한 항목. CTI(TCK), VDP · HU · GSA(TMC), 개통 · uCube(LG U+)가 막고 있음", link: "원인 분석 보기", go: "why" },
      { n: 3, tag: "결론", title: "막던 조건이 11/17까지 다 풀리지 않는다", body: "HU 업데이트 11/13 → 이후 재수행 필요, VDP Diag 2차 11/16 ~ 20, CTI 12월. 11/17 종료는 시험하지 못한 TC를 E2E로 넘기는 것", link: "일정 · 제안 보기", go: "plan" },
    ],
    status: [
      { k: "11/03 PM 합의", v: "Kensho E2E 진입 시점에는 사전에 알고 있는 제약사항으로 N/T가 발생하지 않도록 세부 일정을 재구성", panel: "src:pm1103", link: "회의록 근거" },
      { k: "11/11 PM 합의", v: "E2E는 토요타 공식 검증 Event. Test Case 등 공식 문서를 기준으로 판단하고 구두 설명만으로 이슈를 종료하지 않음", panel: "src:pm1111", link: "회의록 근거" },
      { k: "11/11 TMKR 의견 (합의 아님)", v: "DVT 지연에 따른 대기 · 유지 공수는 추가비용 인정 어려움. 단, DVT Scope가 늘어 실제 추가 Test가 발생하면 근거 기준으로 별도 검토 가능", facts: [["24", "VDP Diag 3차 신규 TC"], ["5 → 24", "DMS API 변경"], ["NT", "MM 업데이트 후 재수행"]], panel: "src:pm1111", link: "연장 요청이 ‘대기’가 아닌 근거" },
    ],
  },
  appendix: {
    a1: { id: "apx-r1", code: "A1", title: "1차 DVT 일별 결과 (GS 290 TC)", message: "1차는 GS만 시험. 10/07 Fail 207건은 Block 분류 폐지(10/07 PM) 이후 재판정되어 10/13 Fail 14 · NT 157로 바뀌었다.", source: "r1" },
    a2: { id: "apx-r2", code: "A2", title: "2차 DVT 일별 · 영역별 결과 (854 TC)", message: "누적 NT는 362 → 288(ADF 조건 변경) 이후 300 안팎에서 멈췄다. 남은 NT 323건 중 236건이 콜센터 웹이다.", source: "r2" },
    a3: { id: "apx-r3", code: "A3", title: "3차 DVT 진행 (80 TC, 11/12 누적)", message: "2차 Fail과 Fail에 따른 NT만 다시 시험한다. VDP Diag 24건은 아직 한 건도 수행하지 못했다.", source: "r3" },
    a4: { id: "apx-cause", code: "A4", title: "차단 요인 상세 (원인 제공 · 영향 · 해소 예정)", message: "원인 제공 조직은 회의록 · 사전준비표 · GSP DB 기록에서 읽은 것이며, 귀책 판정이 아니라 다음 행동을 정하기 위한 분류다.", source: "db" },
    a5: { id: "apx-pre", code: "A5", title: "E2E 사전준비 체크리스트 (11/11)", message: "21개 체크 항목 중 ‘준비완료’는 6건. 나머지 15건은 진행중 · 외부일정대기 · 확인필요다.", source: "pre",
      head: ["No", "대분류", "체크 항목", "현재 상태", "영향도", "PIC", "비고"],
      rows: [
        ["1", "환경구성", "SU#2 E2E 대응 기자재 1식", "준비완료", "H", "TMKR", "DCM · HU 연결, 통신개통(…8394)"],
        ["2", "환경구성", "회귀용 24DCM 기자재 1식", "준비완료", "H", "TMKR", ""],
        ["3", "Firmware", "SU#2 DCM Firmware Update", "준비완료", "H", "TMKR", "10/12 배포본. CV 1대 업데이트 중 멈춤 → LG전자"],
        ["4", "Firmware", "SU#2 H/U SW Update", "진행중", "H", "TMC", "OTA/OTT 등 MM 연계 영향"],
        ["5", "CANoe", "DTC 테스트 방법 확정", "진행중", "H", "TMC", "TMC에서 유형별 코드 발생 필요"],
        ["6", "IF연결", "ACOS DVT API 연결 테스트", "진행중", "H", "TMC", "안 되는 버전 정리 필요(6개)"],
        ["7", "IF연결", "VDP 서버정보 · 연동 테스트", "준비완료", "H", "TMC", "TMC 일정 확인 필요"],
        ["8", "IF연결", "TSC-DK 서버정보 · 연결", "외부일정대기", "L", "TMC", "12월"],
        ["9", "IF연결", "DMS 구축 · DVT 완료", "진행중", "H", "TMKR", "API 5 → 24개, 시나리오 업데이트 필요"],
        ["10", "IF연결", "e-Care 전용 CTI 연결", "외부일정대기", "H", "TMKR", "마감일 ???"],
        ["11", "IF연결", "U-Cube API 정상 처리(SU#2)", "진행중", "H", "LGU+", ""],
        ["12", "IF연결", "NAVER API 대체 서비스", "진행중", "M", "TMKR", "별도 키 · 구조 변경"],
        ["13", "IF연결", "일본 URL 확인회 종료", "확인필요", "H", "TMC", "Wi-Fi APN"],
        ["14", "App", "GSA 신규 버전 확보 · 설치", "외부일정대기", "H", "TMC", "10월 말 제공 예정이었음"],
        ["15", "App", "Local App 신규 버전", "준비완료", "H", "TMKR", ""],
        ["16", "App", "DealerApp 신규 버전", "확인필요", "L", "TMKR", "11/11 PM: Dealer Web 개발 제외 방향"],
        ["17", "App", "e-Care Call 버튼(WEB)", "확인필요", "M", "TMKR", "CCB 반영 필요"],
        ["17", "App", "GSA Service Package 수정본", "외부일정대기", "L", "TMC", ""],
        ["18", "설계문서", "개발문서 · LifeCycle 최종본", "진행중", "M", "TMKR", ""],
        ["19", "평가사양서", "E2E 평가사양서 최종본", "진행중", "M", "TMKR", "DMS 통합 시나리오 병합"],
        ["20", "상품구성", "SU#2 서비스 정상 등록(Wi-Fi · OTT)", "준비완료", "H", "LGU+", ""],
      ] },
    a6: { id: "apx-plan", code: "A6", title: "DVT 계획 변경 이력", message: "계약상 GS · e-Care DVT는 각 1개월(8월 · 9월)이었고, 실제는 10/06에 시작해 3차까지 왔다.", source: "db",
      head: ["시점", "내용", "출처"],
      rows: [
        ["계약", "GS DVT 2026.08(1M), e-Care DVT 2026.09(1M) → CCB 변경안: 각 2026.10 ~ 11(1.5M)", "CCB_TMKR_1109 요약(GSP DB)"],
        ["8/25", "DVT 9/1 ~ 9/30 계획(PRE-PROD)", "Teams U+D"],
        ["9/02", "3단계: 1차 GS → 2차 GS 버그 + e-Care → 3차 전체 미진 항목. Kensho 11/1 목표", "(09/02) PM 정례"],
        ["9/22", "1차 10/6 ~ 10/13 GS만, 2차 10/26 ~ 11/6 GS + e-Care", "Teams U+D"],
        ["10/01", "DVT 종료 11/30 → 11/17로 2주 단축안", "Teams U+D"],
        ["10/07", "2차 시작 10/21 확정. Block 폐지, NT = 진입 불가로 한정, Fail에 원인 주체(TMC/한국/일본) 컬럼 추가", "(10/07) PM 정례"],
        ["10/21", "2차: GS는 ADF 정상화 후, e-Care는 VDP · CTI · DMS 제약으로 가능 범위만. CCW는 CTI 미연동 사유로 NT", "(10/21) PM 정례"],
        ["11/03", "3차 11/11부터, 11/20 전후 DVT 종료 · Kensho 전환 준비", "(11/03) PM 정례"],
        ["11/11", "3차 착수 80 TC. MM Update 후 기존 NT · VDP · GSA/DeepLink 중점", "3차 결과 · (11/11) PM"],
      ] },
    a7: { id: "apx-src", code: "A7", title: "근거 자료와 첨부 목록", message: "1 · 2차 결과 페이지의 첨부(일별 TC 엑셀 13건, 캡처 3건)와 TC 문서 버전 이력이다. 엑셀 본문은 이 작업 환경에서 내려받을 수 없어(외부 접속 차단), TC 행 단위 NT 사유는 이번 판에 반영하지 못했다.", source: "st",
      files: [
        ["1차", "20261006_GS_DVT_SystemTestCase_v1.3_1006_진행1일차.xlsx", "10/06", "이준제"],
        ["1차", "20261007_GS_DVT_SystemTestCase_v1.3.xlsx", "10/07", "유창성"],
        ["1차", "20261008_GS_DVT_SystemTestCase_v1.3.xlsx", "10/08", "유창성"],
        ["1차", "20261012_GS_DVT_SystemTestCase_v1.3.xlsx", "10/12", "유창성"],
        ["1차", "20261013_GS_DVT_SystemTestCase_v1.3.xlsx", "10/13", "유창성"],
        ["1차", "20261014_GS_DVT_SystemTestCase_v1.3_취합본.xlsx", "10/14", "유창성"],
        ["2차", "20261022_GS_DVT_SystemTestCase_v1.4.xlsx", "10/22", "이준제"],
        ["2차", "20261022_eCare_DVT_SystemTestCase_v1.3.xlsx", "10/22", "이준제"],
        ["2차", "image-20261022-095931 · 095956 · 100307.png (3건)", "10/22", "이준제"],
        ["2차", "20261023_GS_DVT_SystemTestCase_v1.4.xlsx", "10/23", "이준제"],
        ["2차", "20261028_GS_DVT_SystemTestCase_v1.4 1.xlsx", "10/28", "이준제"],
        ["2차", "20261028_eCare_DVT_SystemTestCase_v1.3.xlsx", "10/28", "이준제"],
        ["2차", "20261029_GS_DVT_SystemTestCase_v1.4.xlsx", "10/29", "유창성"],
        ["2차", "20261029_eCare_DVT_SystemTestCase_v1.3.xlsx", "10/29", "유창성"],
        ["2차", "20261030_GS_DVT_SystemTestCase_v1.4.xlsx", "10/30", "유창성"],
        ["3차", "첨부 없음 — SASE 보안정책으로 업로드 실패(ISS-037)", "11/11", "-"],
      ],
      tcHist: [
        ["v1.0", "08/24", "초안"],
        ["v1.1", "08/31", "개발팀 검토 반영, 시험결과 관리 기준 조건 반영"],
        ["v1.2", "09/08 · 09/22", "e-Care 상담 이력 목록 개선, 사전 필요데이터 분류, DVT 진행 가능 여부 · 외부 연동 시험 여부 조건 반영"],
        ["v1.3", "09/22", "e-Care 상담 이력 응대 중 오류 대응 변경"],
        ["v1.4 (GS)", "10/22 ~ 10/30", "2차 DVT 시험 기록본"],
      ] },
  },
  plan: {
    title: "11/17에 닫으면 시험하지 못한 TC가 그대로 E2E로 넘어간다",
    lede: "선행조건이 풀리는 날짜 기준으로 DVT를 연장 · 분리하는 안. 위 전환으로 현행 계획과 제안을 비교한다. 제안은 아직 합의된 일정이 아니다.",
    steps: [
      { n: 1, title: "3차를 11/20까지", body: "VDP Diag 2차(11/16 ~ 20) 종료일에 맞춰 GS · DMS · VDP 잔여 시험", panel: "sched:dvt" },
      { n: 2, title: "MM 업데이트 후 재수행", body: "11/13 HU 업데이트 결과로 요금제 · Provisioning NT를 3차 안에서 재시험", panel: "sched:rerun" },
      { n: 3, title: "11/23은 ‘E2E 사전 테스트’", body: "남은 NT가 풀리기 전엔 공식 E2E가 아닌 사전 테스트로 명명(11/06 박준현 제안)", panel: "sched:e2e" },
      { n: 4, title: "CCW 236은 별도 DVT", body: "CTI 완료 즉시 콜센터 웹 DVT 후 e-Care E2E(12/14) 진입", panel: "sched:ccw" },
    ],
    sched: {
      dvt: { kicker: "제안 1", title: "DVT 3차를 VDP Diag 2차 종료일(11/20)까지", body: ["3차 결과 페이지 일정 칸은 11/17 ~ 11/19가 TBD로 비어 있고, VDP Diag 2차 시험은 11/16 ~ 11/20 계획(Teams E2E 실무방 11/04 박용희)", "11/03 PM도 ‘11/20 전후 DVT 종료 · Kensho 전환 준비’로 기록 — 11/17 종료(E2E 세부일정)와 출처끼리 날짜가 다름", "VDP Diag 24건은 3차에 처음 편성된 신규 TC. TMKR 11/11 의견의 ‘Scope 증가에 따른 실제 추가 Test’에 해당"], src: ["r3", "pm1103", "pm1111"] },
      rerun: { kicker: "제안 2", title: "HU · MM 업데이트 직후 기존 NT 재수행", body: ["11/11 PM 합의: DVT 3차에서 MM Update 이후 기존 N/T였던 요금제 · Provisioning 항목 재검증", "업데이트는 11/13(금) 13:30 ~ 16:30 TMC 원격 회의 중 실시 예정. HU-PC 케이블 확보가 전제(ISS-038)", "3차 결과표 80 TC에는 이 재수행 건수가 따로 없음 → 재수행 TC 수를 결과표에 추가해야 함"], src: ["pm1111", "db"] },
      e2e: { kicker: "제안 3", title: "11/23 시작분은 ‘E2E 사전 테스트’로 구분", body: ["E2E 세부일정(11/03): 24SU#2 LifeCycle 11/23 ~ 11/30 (508 TC), 중점평가 · Ecall 12/01 ~ 12/11 (161 TC), e-Care 12/14 ~ 12/30 (212 TC)", "박용희(11/05): 현재 상태로는 11/23 전체 E2E 시나리오를 정상 수행하기 어려울 가능성이 높음", "박준현(11/06): 공식 E2E가 아닌 시험에 E2E를 쓰면 일본에 혼선 → ‘11/23 E2E 사전 테스트’로 구분"], src: ["sch", "db"] },
      ccw: { kicker: "제안 4", title: "CCW 236 TC는 CTI 완료 즉시 별도 DVT", body: ["CCW는 1 · 2 · 3차 어디에서도 한 건도 시험되지 않았고, 3차 범위에도 없음", "현행 일정대로면 e-Care E2E(12/14 ~ 12/30) 기간에 처음 시험하게 됨 — 11/03 PM 합의(알려진 제약으로 E2E에서 NT 발생 금지)와 충돌", "10/28 PM: CTI 없이 선행 가능한 e-Care 시나리오(B/C 등)를 분리해 전진 배치 검토 — 같은 원칙을 DVT에 적용", "CTI 완료일이 확정되지 않아 제안 막대의 시점은 CTI 완료일에 따라 움직임"], src: ["r2", "pm1103", "pm1028"] },
    },
  },
};
