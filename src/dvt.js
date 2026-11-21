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
  hp: { t: "E2E Conditional Entry Handoff 패키지 (11/14)", u: "", n: "내부 자료" },
  pmr: { t: "E2E · DVT PM 보고서 (11/06)", u: "", n: "내부 자료" },
  wk: { t: "주간보고 10월 3주차 (10/19)", u: "", n: "내부 자료" },
  mail0915: { t: "일정 협의 요청 메일 (9/15)", u: "", n: "내부 자료" },
  mail1027: { t: "추가 투입 공수 관련 메일 (10/27)", u: "", n: "내부 자료" },
  ccb: { t: "추가 인력 투입 CCB (11/07 v43)", u: "", n: "내부 자료" },
  cto: { t: "CTO DVT Gating 프로세스", u: "", n: "일반 원칙" },
  tm1113: { t: "Teams 11/13 17:55 이준제 보고 (DVT 3차 진행 현황)", u: "", n: "내부 자료" },
};

// ── 차수별 최종 결과 ──
const rounds = [
  { id: "r1", name: "1차", period: "10/06 ~ 10/14", scope: "GS", tc: 290, pass: 132, fail: 14, nt: 144, rest: 0, src: "r1",
    note: "e-Care 미실시(9/22 계획: “e-Care가 테스트 불가라서 GS만”)" },
  { id: "r2", name: "2차", period: "10/22 ~ 10/30", scope: "GS + e-Care(OPW·CCW)", tc: 854, pass: 523, fail: 8, nt: 323, rest: 0, src: "r2",
    note: "CCW 236 TC 전량 NT (CTI 미개발)" },
  { id: "r3", name: "3차", period: "11/11 ~ (진행 중)", scope: "GS + e-Care + DMS + VDP Diag", tc: 80, pass: 18, fail: 5, nt: 33, rest: 24, src: "r3",
    note: "최종 NT 39건(11/19 수정). 아래 표는 11/12 누적 기준 — 미수행 24건은 VDP Diag 신규 TC(11/13 TMC와 시험 예정)" },
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
    "GSP DB 정리: 10/13 NT 157건 중 112건이 선행 Fail에 의한 Block(Skip Vehicle Association 등)",
  ] },
  r2cum: { head: ["일자", "누적 Acted", "Pass", "Fail", "NT", "비고"], rows: [
    ["10/22", "598", "199", "37", "362", "CCW 236 포함"],
    ["10/23", "667", "350", "29", "288", "선행조건 NT를 시험 가능 조건으로 변경"],
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
    "최종 NT는 39건(11/19 수정). 이 표는 11/12 누적 기준", "11/12 Acted 8건 중 7건은 11/11 Fail 재시험(누적 Acted 55 → 56). 누적 Fail 9 → 5, NT 35 → 33",
    "OPW 9건은 2차 Fail 3 + NT 6 전량 Pass(11/12)",
    "11/13 이후 결과는 Confluence에 아직 게시되지 않음(조회 11/14). 결과 페이지에는 첨부가 없음",
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

// ── 3장 본문 + 근거(드로어) + Timeline — 2026-11-14 DVT·E2E 논의 + Copilot 핸드오프 패키지 기준 ──
const deck = {
  s1: {
    kicker: "메인 · 핵심 메시지",
    title: "DVT 잔여 이슈는 일정 조율을 통해 지속 관리하고, E2E는 병행 수행 예정임. 초반 E2E는 GS TC 위주로 진행하며, 이를 위해 내년 1월까지 추가 인력 25 MM이 필요함",
    lede: "DVT 통합 992 TC 중 Pass 656건(66.1%), Fail 2건, NT 334건임. VDP 서버 영향으로 e-Care E2E는 현재 진행이 불가하여, 초반 E2E는 GS TC 위주로 진행할 예정임.",
    kpis: [
      { k: "ev:status", small: "DVT 통합 결과 (최신)", v: "656", em: "/ 992 TC Pass", d: "Fail 2 · NT 334", hot: true },
      { k: "ev:status", small: "잔여 NT", v: "334", em: "건", d: "CCW 236건(CTI 미연동) 포함", hot: true },
      { k: "ev:e2e11", small: "Kensho E2E 병행 수행", v: "GS TC", em: "위주", d: "e-Care E2E는 VDP 서버 영향으로 진행 불가" },
      { k: "ev:c3", small: "추가 인력 (11/18 ~ 1/29)", v: "25.00", em: "MM", d: "청구 월 10 MM(11월 5) · 대기 · 운영 15명 내외", hot: true },
    ],
    cols: [
      { tag: "Situation · 현황", head: "DVT 통합 992 TC 중 Pass 656건, 잔여는 Fail 2건 · NT 334건임", body: "영역별 NT는 GS 38 · OPW 23 · CCW 236 · DMS 35 · VDP(Diag) 2건이며, Fail은 DMS 1건 · VDP(Diag) 1건임. CCW 236건은 CTI 미연동으로 전량 NT 상태임.", ev: "ev:status", more: "DVT 결과 근거" },
      { tag: "Complication · 원인", head: "잔여 이슈는 TMC · TMKR 측 선행 조건 해소가 필요함", body: "HU SubMCU 업데이트 후 추가 테스트 필요, VDP 서버 영향으로 e-Care 연계 시험 제약, CTI 27CY SU#2 전용 연계환경 필요, DMS는 VDP 실데이터 미수신으로 시뮬레이터 대체 시험, ACOS API 변경 영향 지속.", ev: "ev:blk", more: "블로킹 이슈 근거" },
      { tag: "Plan · 진행 기조", head: "DVT 잔여 이슈는 일정 조율로 지속 관리하고, E2E는 GS TC 위주로 병행 수행함", body: "VDP 서버 영향으로 e-Care E2E는 진행이 불가하여 초반 E2E는 GS TC 위주로 진행할 예정임. DVT 잔여 대응과 E2E가 겹치는 11/18 ~ 1/29 기간에 대기 · 운영 15명 내외, 청구 월 10 MM(합계 25.00 MM)이 필요함.", ev: "ev:c3", more: "추가 인력 근거" },
    ],
    ask: "요청 사항: ① DVT 잔여 이슈는 Open Item으로 두고 일정 조율을 통해 지속 관리 ② E2E는 GS TC 위주로 병행 수행(e-Care는 VDP 서버 정상화 후 진행) ③ 11/18 ~ 2027.01.29 추가 인력 25.00 MM(월 10 MM, 11월 5 MM) 인정",
  },
  s2: {
    kicker: "제안 · DVT · E2E 운영 방식",
    title: "DVT는 주요 Blocking Issue 해결을 전제로 잔여 항목을 Open Item으로 관리하는 조건부 승인을 제안함. E2E는 Open Item 관리와 GS TC 선진행을 조건으로 진입(Conditional Go)함",
    lede: "‘DVT 완료’가 아닌 ‘DVT Open Item 유지 + E2E 조건부 진입’으로 분리하여 표기함. 현행 유지안과 전면 재일정안은 종료 시점이 불확실함.",
    optHead: ["", "A. 현행 유지", "B. Open Item 유지 + 조건부 진입 (제안)", "C. 전면 재일정"],
    optRows: [
      ["방식", "Fail · NT 0이 되지 않은 상태로 DVT 종료", "당사 개발 범위만 조건부 승인, 외부 영역은 Open Item으로 유지 · 별도 재시험", "DVT · E2E 일정 전체 재수립"],
      ["DVT", "1 ~ 2월 (외부 환경 해소에 종속)", "Pass · 완료로 표기하지 않음. 조건 확정 후 약 1개월 추가 검증, 잔여 항목은 환경 확보 후 재시험", "재수립 일정에 따름 (미정)"],
      ["E2E 영향", "잔여 이슈 미해결 상태로 진입", "DVT와 이중 트랙으로 병행, 초반 GS TC 위주 진행, 12/30까지 Blocking 해소", "진입 시점 후퇴"],
      ["필요 결정", "DVT 기간 변경", "TMKR의 조건부 승인 + 진입 판정", "전체 일정 재합의"],
    ],
    optEv: ["ev:optA", "ev:optB", "ev:optC"],
    scopeTitle: "조건부 승인 범위(안)",
    scopeIn: ["서비스 가입", "ACOS 인터페이스", "VDP 연계 테스트"],
    scopeOut: ["TMC 영역 — HU 기능 등 외부 연동 환경에 종속된 시험"],
    scopeOpen: ["조건 항목의 최종 확정", "승인 후 개발 완료 검증의 지속 관리"],
    word: "표현 원칙: ‘DVT 완료 · 조건부 완료’ 대신 ‘DVT Open Item 유지 + E2E 조건부 진입’으로 표기함. E2E는 잔여 DVT 재시험을 대체하지 않음.",
    decide: "TMKR 결정 요청: 위 범위로 조건부 승인하고, 외부 영역은 Open Item으로 두어 별도 일정으로 재시험함. 진입 가부는 9개 Gate(G-01 ~ 09) 충족 여부로 서면 판정함.",
  },
  s3: {
    kicker: "실행과 공수 전제",
    title: "E2E는 GS TC 위주로 병행 진입하고, 공수는 아래 다섯 가지 전제가 충족되는 범위에서 투입함. 12/30을 마지노선으로 관리함",
    lede: "전제가 하나라도 달라지면 일정과 공수도 함께 조정이 필요함. 본 장표는 공수 협의의 합의 대상임.",
    premHead: ["#", "전제", "충족 조건", "미충족 시"],
    prem: [
      ["1", "DVT 정리 기준", "조건부 승인 범위(서비스 가입 · ACOS IF · VDP)를 TMKR이 확정. 잔여 항목은 Pass 전환 없이 Open Item 유지", "연장 공수는 CCB 안건으로 별도 협의"],
      ["2", "E2E 진입 조건", "GS TC 위주 선진행, e-Care는 VDP 서버 정상화 후 진행 + Gate 판정", "E2E 전체 재일정"],
      ["3", "외부 환경 해소", "HU(MM) 업데이트 완료 · VDP 서버 정상화 · CTI 완료를 12/30 이전에 확정 · 해소", "12/30 초과 시 E2E 지속 여부 · 후속 일정 재협의. 해소 전 구간은 대기가 아닌 별도 범위로 관리"],
      ["4", "범위 변경", "DMS 등 사양 변경은 TC 문서 기준으로 신규 · 재수행 범위 확정", "변경분은 근거 기준으로 별도 협의"],
      ["5", "자원 · 계약 유지", "잔여 검증 · 결함 수정 · 재시험 인력의 유지 기간과 최소 인원을 서면 확정. 추가 공수는 자동 승인이 아님", "조건부 진입 보류, CCB 협의"],
    ],
    premEv: ["ev:p1", "ev:p2", "ev:p3", "ev:p4", "ev:p5"],
    tracks: [
      { h: "E2E #1 · GS TC 위주 선진행 (11/23 ~ 12/30)", b: "VDP 서버 영향이 없는 GS TC 위주로 착수. 회귀 테스트(Regression) · ACOS IF 기반 TC 포함, 회귀용 24 DCM 기자재 활용. 12/30까지 Blocking Issue 해소가 전제", ev: "ev:e2e1" },
      { h: "E2E #2 · e-Care (VDP 서버 정상화 후)", b: "VDP 서버 영향으로 현재 진행 불가. 서버 정상화 시점에 맞춰 일정 조율 후 진행", ev: "ev:e2e2" },
    ],
    next: ["DVT 잔여 이슈(Fail 2 · NT 334)는 Open Item으로 두고 일정 조율을 통해 지속 관리", "11/23 E2E 착수 — 초반은 GS TC 위주로 진행", "VDP 서버 정상화 시 e-Care E2E 일정 조율 · 착수, 12/30까지 Blocking Issue 해소"],
    tl: "타임라인 전체 보기",
  },
  tl: {
    kicker: "Timeline · DVT / E2E 운영 일정(안)",
    title: "E2E는 GS TC 위주로 착수하고, DVT 잔여 이슈는 12/30(마지노선)까지 일정 조율을 통해 해소함",
    lede: "12/30은 Kensho E2E 회귀 테스트 종료일이자 주요 Blocking Issue 해소 기한임. 점선은 미확정 구간임.",
    start: [2026, 11, 13], days: 49,
    marks: [
      { d: [2026, 11, 13], l: "11/13", ev: "ev:t1113" },
      { d: [2026, 11, 16], l: "11/16 (월)", ev: "ev:t1116" },
      { d: [2026, 11, 17], l: "11/17", ev: "ev:t1117" },
      { d: [2026, 11, 20], l: "11/20 판정", ev: "ev:t1120" },
      { d: [2026, 11, 23], l: "11/23", ev: "ev:t1123" },
      { d: [2026, 12, 30], l: "12/30 마지노선", ev: "ev:deadline", dead: true },
    ],
    lanes: [
      { h: "DVT", sub: "3차", bars: [
        { a: [2026, 11, 13], b: [2026, 11, 16], t: "dvt", l: "3차 공식 종료 11/16" },
        { a: [2026, 11, 16], b: [2026, 12, 16], t: "cond", dash: true, l: "조건부 승인 범위 검증 (약 1개월, 미확정)", ev: "ev:optB" },
      ] },
      { h: "외부 환경", sub: "해소 시점", bars: [
        { a: [2026, 11, 13], b: [2026, 11, 14], t: "ext", l: "HU 업데이트 (9단계 확인에서 중단)", pin: true, ev: "ev:hu" },
        { a: [2026, 11, 16], b: [2026, 11, 20], t: "ext", l: "VDP Diag 2차 (연계 2/24)", ev: "ev:vdp" },
        { a: [2026, 12, 1], b: [2026, 12, 30], t: "ext", dash: true, l: "CTI 개발 완료 (12월, 일자 미정)", ev: "ev:cause" },
      ] },
      { h: "E2E #1", sub: "GS TC 위주", bars: [
        { a: [2026, 11, 23], b: [2026, 12, 30], t: "e2e", l: "GS TC 위주 선진행 (회귀 · ACOS IF 포함)", ev: "ev:e2e1" },
      ] },
      { h: "E2E #2", sub: "e-Care", bars: [
        { a: [2026, 12, 1], b: [2026, 12, 30], t: "late", dash: true, l: "VDP 서버 정상화 후 일정 조율 (미정)", ev: "ev:e2e2" },
      ] },
    ],
    notes: ["DVT 잔여 이슈는 Open Item으로 두고 일정 조율을 통해 지속 관리, E2E는 병행 수행", "VDP 서버 영향으로 e-Care E2E는 진행 불가 — 초반 E2E는 GS TC 위주로 진행", "12/30까지 주요 Blocking Issue 미해소 시 E2E 지속 여부와 후속 일정 재협의"],
  },
  ev: {
    status: { kicker: "근거 · DVT 결과", title: "통합 992 TC 중 Pass 656 · Fail 2 · NT 334", facts: ["DVT 통합 992 TC: Pass 656건(66.1%) · Fail 2건 · NT 334건(33.7%)", "GS 326 TC: Pass 288 · Fail 0 · NT 38", "OPW 292 TC: Pass 269 · Fail 0 · NT 23", "CCW 236 TC: 전량 NT — CTI 미연동(CTI 내선번호 · CAN Configuration 미확보)", "DMS 114 TC: Pass 78 · Fail 1 · NT 35", "VDP(Diag) 24 TC: Pass 21 · Fail 1 · NT 2", "이전 집계(11/17, 968 TC): NT 352건 → 최신 334건으로 감소", "NT 비중 추이: 1차 50%(144/290), 2차 38%(323/854), 통합 최신 34%(334/992)"], src: ["r1", "r2", "r3"], apx: "apx-total" },
    complete: { kicker: "근거 · 완료 기준", title: "Fail · NT가 없어야 Pass", facts: ["11/14 논의: DVT 완료는 Fail · NT가 없는 상태", "10/07 PM 합의: NT는 진입 자체가 불가한 항목, 진입 후 실패는 Fail", "일반 품질 Gate 원칙: 단순 기간 종료가 아니라 사전 정의된 기준과 증적을 충족해야 다음 단계로 이행(CTO DVT Gating 준거 — 본 프로젝트 직접 적용 기준은 아님)"], src: ["pm1007", "cto"], apx: "apx-mtg" },
    vdp: { kicker: "근거 · VDP", title: "VDP(Diag) 24 TC 중 Pass 21 · Fail 1 · NT 2", facts: ["최신 집계: VDP(Diag) 24 TC 중 Pass 21 · Fail 1 · NT 2", "VDP 서버 영향으로 e-Care E2E는 현재 진행 불가", "11/13 이준제 보고(최초 실연동): 24 TC 중 2건 성공, 3번째 TC는 성공 여부를 TMC에 문의 중. 11/16(월) 10시 재개", "11/13 MS 장애로 다산 메일 수 · 발신 불가 → 메일로 받는 VPN 비밀번호를 받지 못해 이준제 VPN 1개로만 진행 — VDP Diag와 DMS 기준 정보 시험을 동시에 할 수 없었음", "VDP 접속정보 지연 · 오류, 콜백(CoCo Callback) 미수신으로 DTC 수집 후속 처리 미검증", "일본 측 VDP 서버 정보는 10/05 제공 예정이었음(9/15 일정 협의 메일). 외부 환경 준비 전 착수 시 미시험 증가 · 결과 유효성 저하 가능성을 사전 제기", "VDP Diag 2차 11/16 ~ 20 예정"], src: ["tm1113", "pm1028", "mail0915", "pmr", "db"], apx: "apx-cause" },
    hu: { kicker: "근거 · HU", title: "HU(MM) 업데이트 — Tier1 업데이트 ①의 9단계(성공 여부 확인)에서 중단", facts: ["11/13 이준제 보고: 업데이트 절차 ④ Tier1 업데이트 ① → 9단계 ‘성공 여부 확인’에서 중단. write_result_sub_sucess.txt 파일이 생성되지 않음", "11/16(월) 13시 TMC 카키하라 상과 이어서 진행 예정", "v2.1의 ‘9단계 중 3단계’ 표기는 11/13 보고와 달라 이번 판에서 정정", "HU 소프트웨어가 SU#1 → MM Flag 미반환, Wi-Fi · OTT · Digital Key 등 HU 기반 시험 제한", "HU 환경 미구축 31건이 1차 NT의 일부(10/19 스냅샷)"], src: ["tm1113", "pm1103", "pre", "wk"], apx: "apx-cause" },
    deadline: { kicker: "근거 · 마지노선", title: "12/30 = 회귀 테스트 종료일 · Blocking Issue 해소 기한", facts: ["Kensho E2E 회귀 테스트 종료일(E2E 세부일정상 e-Care E2E 종료일 12/30)", "11/14 논의: 주요 Blocking Issue가 12/30에는 풀려야 한다는 의미의 마지노선", "미해소 시 E2E 지속 여부와 후속 일정을 관련 당사자가 재협의(조건부 진입 승인문 원칙)"], src: ["sch", "hp"], apx: "apx-gate" },
    cause: { kicker: "근거 · 원인", title: "NT의 원인은 외부 연동 환경", facts: ["CTI 미개발: CCW 236 TC(2차 NT의 73%), 완료 12월 — TMKR 측 협력사 영역", "TMC: VDP 접속정보 · 콜백, HU 소프트웨어(SU#1), GSA · Auth0, DTC 재현 방법 미확정", "DMS 사양 변경 지속: API 5 → 24개, 시나리오 재작성", "1차 NT 144건 중 Blocked 104 + HU 환경 미구축 31 = 135건(93.8%)이 선행조건 · 환경 제약과 연관(10/19 스냅샷)", "11/14 논의: 당사 개발 로직은 내부 검증 완료"], src: ["pm1028", "pm1103", "pre", "wk", "db"], apx: "apx-cause" },
    impact: { kicker: "근거 · 일정 영향", title: "현행 방식이면 1 ~ 2월", facts: ["현행 방식(Fail · NT 0까지)을 유지할 경우 DK 완료 기준으로 1 ~ 2월까지 소요 가능", "E2E 현행 진입 11/23과 중첩 — 11/03 PM 합의: E2E 진입 시점에는 알려진 제약으로 NT가 생기지 않도록 일정 재구성", "DVT 기간 변경은 CCB 안건과 연계(기존 1개월 → 1.5개월 변경안)"], src: ["pm1103", "pm1111", "ccb"], apx: "apx-plan" },
    optA: { kicker: "근거 · 대안 A", title: "현행 유지", facts: ["Fail · NT가 0이 될 때까지 DVT를 연장", "외부 환경(HU · VDP · CTI) 해소 일정에 종속되어 종료일을 약속할 수 없음", "E2E와 일정이 겹치고 DVT 기간 변경은 CCB 안건"], apx: "apx-opt" },
    optB: { kicker: "근거 · 대안 B (제안)", title: "Open Item 유지 + E2E 조건부 진입", facts: ["당사 개발 범위(서비스 가입 · ACOS IF · VDP 연계)에 한정해 조건부 승인", "TMC 영역(HU 기능 등)은 범위에서 제외, Open Item으로 유지하고 환경 확보 후 별도 재시험", "DVT를 완료 · Pass로 표기하지 않음 — E2E 진입 승인과 DVT 완료 승인을 분리", "승인 후에도 개발 완료 검증 약 1개월 추가", "TMKR 판단 사항 — 당사가 임의로 종결하지 않음"], src: ["hp"], apx: "apx-scope" },
    optC: { kicker: "근거 · 대안 C", title: "전면 재일정", facts: ["일본 측 협의가 이루어지지 않거나 Gate를 충족하지 못하는 경우의 대안(No-Go / Scope Reduction)", "DVT · E2E 일정 전체를 다시 수립하며 종료 시점은 미정"], apx: "apx-opt" },
    p1: { kicker: "전제 1", title: "DVT 정리 기준", facts: ["조건부 승인 범위: 서비스 가입 · ACOS 인터페이스 · VDP 연계 테스트", "FAIL은 FAIL, 시험 불가는 N/T · External Blocked로 유지 — 일정을 이유로 Pass 전환하지 않음", "승인 후 개발 완료 검증은 약 1개월(미확정)", "미승인 시 DVT 연장분은 CCB 안건으로 협의"], src: ["hp"], apx: "apx-man" },
    p2: { kicker: "전제 2", title: "E2E 진입 조건", facts: ["VDP 서버 영향으로 e-Care E2E는 현재 진행 불가", "초반 E2E는 GS TC 위주로 진행 예정", "Gate G-01 ~ G-09 충족 여부로 Go / Conditional Go / No-Go 서면 판정(PM 보고 제안)", "불가 시 전체 재일정"], src: ["pmr", "hp"], apx: "apx-gate" },
    p3: { kicker: "전제 3", title: "외부 환경 해소 (12/30)", facts: ["HU(MM) 업데이트 완료, VDP 서버 정상화, DMS 기준 정보 연동, CTI 개발(12월) 해소", "12/30이 마지노선 — 이후에는 E2E 지속 여부 · 후속 일정 재협의", "해소 전 구간은 시험 가능 범위가 아니므로 대기 공수와 구분"], src: ["pm1103", "pre"], apx: "apx-cause" },
    p4: { kicker: "전제 4", title: "범위 변경 처리", facts: ["DMS API 5 → 24개 변경, VDP Diag 24 TC는 3차 신규", "TMKR 의견(11/11, 합의 아님): 규격 변경에 따른 실제 개발 · 시험은 근거 기준으로 별도 검토 가능, 일정 지연에 따른 단순 대기는 인정 어려움"], src: ["pm1111"], apx: "apx-man" },
    p5: { kicker: "전제 5", title: "자원 · 계약 유지", facts: ["잔여 검증 · 결함 수정 · 재시험이 끝날 때까지 필요한 개발 · QA 인력과 계약 범위를 유지", "기존 계획 · 인력 Shift · 실제 순증 공수 · DVT Carry-over 조치 범위를 분리 기록", "조건부 진입 승인은 추가 공수 · 비용의 자동 승인이 아님", "검토 의견(10/27): 기존 리소스를 어떻게 활용했는지까지 함께 봐야 함"], src: ["ccb", "mail1027", "hp"], apx: "apx-man" },
    e2e1: { kicker: "E2E #1", title: "GS TC 위주 선진행 (11/23 ~ 12/30)", facts: ["진행 기조: DVT 잔여 이슈는 일정 조율을 통해 지속 관리하고 E2E는 병행 수행", "VDP 서버 영향으로 e-Care E2E는 진행 불가 → 초반 E2E는 GS TC 위주로 진행", "회귀용 24 DCM 기자재는 준비 완료(사전준비 #2) — Global · ACOS 대상", "회귀 테스트 종료일 12/30 = Blocking Issue 해소 마지노선", "11/03 PM 합의: 시험 가능 범위를 세분화하고 시작부터 NT가 예상되는 TC를 최소화"], src: ["pm1103", "pre", "sch"], apx: "apx-pre" },
    e2e2: { kicker: "E2E #2", title: "e-Care E2E (VDP 서버 정상화 후)", facts: ["VDP 서버 영향으로 현재 수행 불가 → 서버 정상화 시점에 맞춰 일정 조율", "E2E는 토요타 공식 검증 Event — 공식 문서(Spec · TC)를 기준으로 하며 구두 설명만으로 이슈를 종료하지 않음(11/11 PM)", "E2E는 잔여 DVT 재시험의 대체 수단이 아님"], src: ["pm1111", "hp"], apx: "apx-pre" },
    t1113: { kicker: "Timeline", title: "11/13 — HU 업데이트 · VDP Diag 1차 · DMS (MS 장애)", facts: ["MS 장애로 다산 메일 불가 → VPN 비밀번호 미수신, 이준제 VPN 1개로만 진행", "HU(MM) 업데이트: Tier1 업데이트 ①의 9단계(성공 여부 확인)에서 중단 → 11/16 13시 재개", "VDP Diag: 24 TC 중 2건 성공, 3번째 TC 성공 여부 문의 중 → 11/16 10시 재개", "DMS 기준 정보 연동: VPN 미접속으로 진행 못 함 → 11/16 진행 예정", "MM 업데이트 후 기존 NT 요금제 · Provisioning 재검증 대상"], src: ["tm1113"], apx: "apx-cause" },
    t1116: { kicker: "Timeline", title: "11/16(월) — DVT 3차 공식 종료 · 11/13 미완 시험 재개", facts: ["10시 VDP Diag 재개, 13시 HU(MM) 업데이트 재개(TMC 카키하라 상), DMS 기준 정보 연동 진행(11/13 이준제 보고)", "DVT 3차 Fail 결과 정리(저녁까지)", "DVT · E2E 자료 정리, 일본 측 협의(월 ~ 화)"], apx: "apx-mtg" },
    t1117: { kicker: "Timeline", title: "11/17 — 현행 DVT 종료일", facts: ["3차 결과 일정 칸: 11/17 ~ 11/19 TBD, E2E 세부일정은 11/17 종료"], src: ["r3", "sch"], apx: "apx-plan" },
    t1120: { kicker: "Timeline", title: "11/20 — E2E 진입 Gate 판정", facts: ["PM 보고(11/06) 제안: 11/20에 범위 · 리스크를 서면 확정하고 Go / Conditional Go / No-Go 판정", "판정 기준: 9개 Mandatory Gate(G-01 ~ G-09)", "참고: 11/20은 진척 보고회 일자이기도 함"], src: ["pmr", "hp"], apx: "apx-gate" },
    t1123: { kicker: "Timeline", title: "11/23 — 현행 E2E 진입일", facts: ["E2E 세부일정(11/03): 24SU#2 LifeCycle 11/23 ~ 11/30", "PM 보고(11/06): 진입일은 유지 가능하나 전체 범위 Go가 아닌 조건부 범위 진입 가능성이 높음"], src: ["sch", "pmr"], apx: "apx-pre" },
  },
};

const apxNew = {
  m1: { id: "apx-mtg", code: "", title: "11/14 DVT · E2E 운영방안 논의 요약", message: "실무자 논의를 쟁점 · 방향 · 미결 · 후속 조치로 재구성함.",
    head: ["구분", "내용"],
    rows: [
      ["쟁점", "DVT 3차는 11/16 공식 종료이나 Fail · NT가 남음. 완료는 Fail · NT가 없어야 인정"],
      ["현황 (11/13 보고)", "VDP(e-Care) 연계 테스트 24 TC 중 2건 성공(3번째 문의 중). HU(MM) 업데이트는 Tier1 ①의 9단계 성공 확인에서 중단. DMS 기준 정보 연동은 MS 장애 · VPN 문제로 미진행. 모두 11/16 재개"],
      ["원인", "TMC 연동 환경 부족이 주원인. 당사가 개발한 로직은 내부 검증 완료"],
      ["영향", "현행 방식 유지 시 1 ~ 2월(DK 완료)까지 지속 가능"],
      ["방향", "당사 개발 범위(서비스 가입 · ACOS IF · VDP 연계)로 한정한 조건부 승인 — TMC 범위(HU 기능) 제외. 그래도 약 1개월 추가. 잔여는 Open Item 유지"],
      ["주의", "조건부 승인은 TMKR 판단 사항임(당사 임의 종결 불가). DVT 미완료는 CCB와 연계"],
      ["E2E", "Global South · ACOS IF E2E는 현재 불가. 일본 측이 준비하면 회귀 테스트는 가능 → DVT + E2E 이중 트랙. 월 · 화 협의에 달림, 안 되면 전체 재일정"],
      ["마지노선", "Kensho E2E 회귀 테스트 종료일 12/30 — 주요 Blocking Issue가 이때까지 풀려야 함"],
      ["후속", "11/16 저녁까지 3차 Fail 결과 정리(핵심 근거), 선행 정상화 시 정리 가능 항목 16일 처리, 이후 E2E 진입과 DVT 연장 통합 논의"],
      ["미결", "조건 항목 최종 범위, 승인 후 검증 지속 기간"],
    ] },
  m2: { id: "apx-scope", code: "", title: "조건부 승인 범위(안)", message: "무엇을 승인 대상으로 하고, 무엇을 Open Item으로 분리하는지의 구분임. 최종 항목은 TMKR 협의로 확정 예정임.",
    head: ["구분", "항목", "기준", "비고"],
    rows: [
      ["승인 대상", "서비스 가입", "당사 개발 · 내부 검증 완료", "승인 후 개발 완료 검증"],
      ["승인 대상", "ACOS 인터페이스", "당사 개발 범위", "E2E #1과 연계"],
      ["승인 대상", "VDP 연계 테스트", "당사 개발 범위 (현재 2/24)", "접속 · 콜백 환경 확보 전제"],
      ["Open Item", "HU 기능 등 TMC 영역", "외부 연동 환경에 종속 (HU 업데이트 9단계 확인에서 중단)", "환경 확보 후 별도 재시험"],
      ["Open Item", "CTI 연동(CCW 236 TC)", "CTI 개발 완료(12월) 후", "별도 DVT"],
      ["미결", "조건 항목 최종 · 지속 일정", "TMKR 협의", "—"],
    ] },
  m3: { id: "apx-opt", code: "", title: "대안 비교 상세 (A · B · C)", message: "세 가지 운영안의 종료 시점, 영향, 위험, 필요한 결정을 비교함.",
    head: ["", "A. 현행 유지", "B. Open Item 유지 + 조건부 진입 (제안)", "C. 전면 재일정"],
    rows: [
      ["DVT", "1 ~ 2월 (외부 환경 종속)", "완료 · Pass 표기 없이 Open Item 유지, 약 1개월 추가 검증", "미정"],
      ["E2E", "11/23 충돌", "병행(이중 트랙), 12/30까지 Blocking 해소", "후퇴"],
      ["장점", "기준 변경 없음", "범위 확정 → 일정 약속 가능, 상태 왜곡 없음", "충돌 없이 재수립"],
      ["위험", "종료일 불확실, 장기 공수 소요", "TMKR 승인 필요, 범위 해석 차이, 12/30 초과 시 재협의", "전체 지연, 합의 비용"],
      ["필요 결정", "DVT 기간 변경(CCB 연계)", "조건부 승인 + 11/20 진입 판정", "전체 재합의"],
      ["선택 조건", "외부 환경이 곧 정상화될 때", "그렇지 않을 때(현재)", "일본 측 협의가 불발되거나 Gate 미충족"],
    ] },
  m4: { id: "apx-man", code: "", title: "공수 협의 전제", message: "공수 투입은 아래 전제를 기준으로 협의함. 전제가 바뀌면 공수도 함께 조정이 필요함.",
    head: ["#", "전제", "충족 조건", "충족되지 않으면", "공수 연계"],
    rows: [
      ["1", "DVT 정리 기준", "조건부 승인 범위 확정, 잔여 Open Item 유지", "연장분 CCB 협의", "승인 후 검증 약 1개월분"],
      ["2", "E2E 진입 조건", "일본 측 회귀 테스트 준비 + 11/20 Gate 판정", "전체 재일정", "E2E #1 투입 시점 결정"],
      ["3", "외부 환경 해소", "HU 업데이트 · VDP 24 TC · CTI를 12/30 이전 해소", "12/30 초과 시 재협의, 해소 전 구간은 별도 범위", "해소 후 시험분만 투입"],
      ["4", "범위 변경", "TC 문서 기준 신규 · 재수행 확정", "근거 기준 별도 협의", "신규 TC · 재수행분"],
      ["5", "자원 · 계약 유지", "잔여 검증 · 수정 · 재시험 인력의 유지 기간 · 최소 인원 서면 확정", "조건부 진입 보류, CCB 협의", "추가 공수는 자동 승인 아님 — 기존 계획 · Shift · 순증 분리 기록"],
    ] },
  m5: { id: "apx-gate", code: "", title: "E2E 조건부 진입 Gate (G-01 ~ G-09)", message: "Conditional Go는 아래 9개 Gate가 모두 충족되고 재판정 트리거가 0건일 때만 성립함. 판정일은 11/20(PM 보고 제안).",
    head: ["Gate", "필수 기준", "증적", "미충족 시"],
    rows: [
      ["G-01", "당사 개발 결함으로 인한 Critical Blocker 0건 (또는 진입 전 별도 승인)", "결함 목록 · RCA · 승인 기록", "No-Go 또는 범위 제외"],
      ["G-02", "모든 FAIL / N/T의 원인 · Owner 식별 100%", "Residual Risk Register", "No-Go"],
      ["G-03", "High / Critical 항목의 Due · 재시험일 100% 확보", "조치계획 · 캘린더", "No-Go"],
      ["G-04", "환경 미비 항목은 Pass 전환 없이 Open 유지", "TC 상태 · Dependency 증적", "승인문 수정"],
      ["G-05", "DVT Carry-over 별도 재검증 계획 확정", "TC 목록 · 환경 조건 · 시험 슬롯", "No-Go"],
      ["G-06", "대표 E2E 핵심 경로 최소 Smoke 증적 확보", "로그 · 스크린샷 · 결과서", "범위 축소 / No-Go"],
      ["G-07", "고객 · TMC Dependency 서면 증적", "메일 · 회의록 · 승인서", "No-Go"],
      ["G-08", "잔여 검증 · 수정 인력 / 계약 기간 명시", "인력계획 · CCB · RACI", "조건부 진입 보류"],
      ["G-09", "Stop / Review Trigger와 의사결정자 확정", "승인문 · 비상연락망", "No-Go"],
      ["재판정", "당사 귀책 Critical 신규 확인 · 핵심 E2E 경로 차단 · 환경 제공일 초과(12/30 포함) · High/Critical Owner 1영업일 이상 미지정 · 인력 철수 · 계약 공백", "—", "Conditional Go 재판정"],
    ] },
  m6: { id: "apx-copilot", code: "", title: "Copilot 제안과 출처 분석 (11/14 핸드오프 패키지)", message: "제안의 결론은 ‘DVT Open Items 유지 + E2E Conditional Go’임. 본 문서에 반영한 부분, 반영하지 않은 부분, 출처별 적용 한계를 구분함.",
    head: ["구분", "내용", "본 문서 반영"],
    rows: [
      ["권고 결론", "DVT FAIL / N/T를 완료 · Pass로 전환하지 않고 Open 유지. E2E 진입 승인과 DVT 완료 승인을 분리", "반영 — 2장 제안(B), 표현 원칙"],
      ["불변조건", "① 상태 보존 ② E2E는 DVT 재시험을 대체하지 않음 ③ 원인 · Owner · Due 명시 ④ 잔여 검증 인력 유지 ⑤ Critical 시 재판정", "반영 — 전제 1 · 5, Gate"],
      ["표현 원칙", "‘DVT Completed · 조건부 완료’ 지양 → ‘DVT Open Items 유지 + Conditional E2E Entry’", "반영"],
      ["Gate · 트리거", "G-01 ~ G-09, 재판정 트리거, 판정 3값(Go · Conditional Go · No-Go) + Scope Reduction", "반영 — A5"],
      ["원인 분류 A ~ D", "A 당사 개발 결함 / B TMC · TMKR 환경 / C 외부 의존성 / D 사양 미확정", "Appendix 원인 분석에 활용"],
      ["귀책 · 비용 문구", "책임 소재 · 면책 · 공수 귀속 원칙 등 계약 쟁점", "미반영 — 고객 전달용에서는 사실 · 요청 중심으로 두고 CCB 연계 안건으로만 표기"],
      ["Risk Register 예시 행", "R-001 ~ 004는 ‘Sample — replace with actual TC IDs’로 표기된 예시이며 Due 11/18 등은 확정값이 아님", "미반영 — 실제 TC ID 기준으로 작성 후 반영 필요"],
    ] },
  m7: { id: "apx-evid", code: "", title: "출처별 적용 한계", message: "패키지 README의 한계 고지와 원본을 대조함. 프로젝트별 서면 합의 · 시험 증적을 최우선으로 적용함.",
    head: ["ID", "출처", "무엇을 말하나", "적용 한계", "활용"],
    rows: [
      ["E04", "주간보고 10/19", "1차 290 TC: Pass 132 · Fail 14 · NT 144, Blocked 104 + HU 미구축 31", "10/19 스냅샷. 본 보드 1차 결과와 일치", "근거 사용"],
      ["E05", "E2E · DVT PM 보고 11/06", "11/23 진입 유지 가능하나 조건부 범위 진입 가능성, 11/20 Go/No-Go 서면 판정 제안, 854 TC 사전분류(NT 343)", "PM 관리안, 고객 승인 아님. 854 사전분류의 NT 343은 본 보드 2차 최종 NT 323(10/30)과 시점 · 분류 기준이 달라 합산 · 비교하지 않음", "일정 · 판정 근거"],
      ["E06", "일정 협의 메일 9/15", "외부 시스템 미준비 시 미시험 증가 · 결과 유효성 저하를 사전 경고", "사전 경고 기록", "원인 근거"],
      ["E08", "추가 인력 CCB 11/07 v43", "일정 · 자원 · 공수 근거", "원본 미열람(대용량 PPT) — 공수 수치는 본 보드에 반영하지 않음", "공수 협의 시 직접 확인 필요"],
      ["E09", "추가 공수 메일 10/27", "DVT / E2E 경계, 기존 리소스 활용까지 봐야 한다는 검토 의견", "내부 검토 의견", "전제 5 근거"],
      ["E02", "CTO DVT Gating", "기준 미달 시 다음 단계 차단, 예외 없음(클라우드 전환 PR Gating)", "본 프로젝트 직접 적용 기준 아님 — Gate 철학의 준거", "원칙 참고"],
      ["E01", "Q-Gate 시험 기준", "일반 품질 기준", "Global South 전용 승인 수치로 확인되지 않음", "원칙 참고"],
      ["E07", "오픈 점검 기준서 v2.0", "상용 오픈 단계 Risk Acceptance 전례", "DVT 전용 조건부 승인 규정 아님", "전례 참고"],
      ["E03", "CCS 구축 프로세스 v3", "Connected Car 구축 SOP", "일반 SOP", "참고"],
    ] },
};

/* ── v2.5 (11/19): 현재 블로킹 이슈(11/17 기준) · 11/18 CCB 검토 ── */
src.ccb1118 = { t: "LGU+ 토요타 텔레매틱스 추가 인력 투입 CCB (11/18)", u: "", n: "내부 자료" };

deck.blk = {
  kicker: "현재 블로킹 이슈 · 11/17 기준",
  title: "추가 DVT · 11/17 현재 잔여 이슈 (TMC 측 선행 조건 미해소)",
  lede: "잔여NT 항목에 대해 TMC 측 선행 조건이 미해소 상태로, 10~11월과 같은 상황이 12월 이후에도 이어질 것으로 예상됩니다.",
  cards: [
    { no: "①", h: "MM/HU · ACOS Provisioning", who: "TMC", fact: "SU#1 H/U, SubMCU 업데이트 5회 완료,\n테스트 필요", note: "11/18 MM Capable Flag 확인 완료. 단, Flag 조합별 Opt-in/out 추가 검증 필요" },
    { no: "②", h: "VDP Diag", who: "TMC", fact: "24 TC 중 Pass 21 · Fail 1 · NT 2", note: "VDP 서버 영향으로 e-Care E2E 진행 불가 · 서버 정상화 후 일정 조율", hot: true },
    { no: "③", h: "CTI/TCK 중계 연동", who: "TMKR·TMC", fact: "27CY SU#2 전용 연계환경 구성 필요", note: "e-Care REST API · CTN 전달, CCW 통화 E2E 미수행" },
    { no: "④", h: "DMS 연동", who: "TMKR", fact: "VDP 실데이터 미수신으로\n시뮬레이터 대체 시험", note: "Warning Clear · 상담 Workflow 처리 조건 추가 검토" },
    { no: "⑤", h: "ACOS API 사양", who: "TMC", fact: "TSC-GC/GB Request/Response 변경 영향 지속", note: "Redoc 사양 변경 · Pre-PROD 반영 일정에 따른 추가 개발 가능성" },
  ],
  doneTitle: "DVT 실질 완료 시점 검토",
  doneHead: ["구분", "2026년 12월 말 완료", "2027년 1월 말 완료"],
  doneRows: [
    ["목표", "잔여 N/T 0건, 주요 결함 수정 완료", "잔여 N/T 0건, 주요 결함 수정 완료"],
    ["외부 연계 선행 조건", "11월 중 TMC 측 주요 선행 조건 해소 필요", "12월 중 단계적 해소 가능"],
    ["개발 · QA 투입", "집중적인 병렬 투입 필요", "단계별 투입 및 반복 검증"],
    ["일정 위험 / 의견", "현실적으로 불가 예상 · 조건부 단축 협의 필요", "현실적인 일정으로 예상"],
  ],
  foot: "※ 본사 API 사양 변경 · Pre-PROD 반영이 2027년 2월 이후 확정될 경우, 별도 일정 · 공수로 관리하거나 DVT 종료 기준 재협의 필요",
};

deck.s4 = {
  kicker: "CCB 검토 · 11/18 추가 인력 투입 CCB",
  title: "uCube를 빼면 청구는 22.06 MM(DVT 기간 10.10 MM)이고, 추가 DVT는 월 10 MM 청구 기준 25.00 MM임. 10.10 MM은 항목별 발생 시점 · 사유 · 현재 결과를 확인한 후 청구 예정임",
  lede: "11/18 CCB 자료의 3 · 4번 섹션을 검토함. 페이지 번호는 검토 지시 기준이며, 자료 하단 번호보다 1이 큼(15p = 하단 14/86).",
  kpis: [
    { k: "ev:c1", small: "청구 공수 (콜버튼 · ACOS · DVT 기간)", v: "22.06", em: "MM", d: "23.01 − uCube 0.95" },
    { k: "ev:c2", small: "DVT 기간 변경 · 연동 대응 (15p)", v: "10.10", em: "MM", d: "11.05 − uCube 0.95 · 10/01 ~ 11/17", hot: true },
    { k: "ev:c3", small: "추가 DVT 예측 (21p 갱신본)", v: "25.00", em: "MM", d: "청구 11월 5 · 12월 10 · 1월 10 · uCUBE 제외" },
    { k: "ev:c4", small: "10 · 11월 개발자 실적", v: "13 · 13", em: "MM", d: "그래프의 실적은 품질 · 기획 포함 수치", hot: true },
  ],
  catHead: ["분류", "15p 항목", "MM", "근거 (72 · 73 · 86p)", "현재 결과"],
  catRows: [
    ["ACOS 추가 변경", "ACOS API 1.25 · ACOS Provisioning 1.35", "2.60", "10/15 Notify API 변경, 10월 Upsert 정책 · Capable 응답 변경 (월 단위 표기)", "API 재검증 완료. 11/18 MM Capable Flag 확인, Flag 조합 검증 남음"],
    ["VDP · PGM 등 TMC 서버 지연 대응", "VDP Diag 1.40 · VDP CoCo 1.00 · MM/HU · DCM/ADF 1.85 · Digital Key 0.25", "4.50", "8/26 VDP 사양 협의, 10/06 IP 제공 · 정정, 10월 x-api-key. Digital Key는 이력 없음", "VDP Diag 24 TC 중 Pass 21 · Fail 1 · NT 2, CoCo Callback 검증 중, HU는 업데이트 완료 · 테스트 필요"],
    ["TMKR 연계 변경 (분류 결정 필요)", "CTI/TCK 0.90 · DMS 1.05 · Global/Local App 0.55", "2.50", "11월 CTI 프로토콜 · Auth0 (월 단위). DMS는 이력 없음", "CCW 통화 E2E 미수행, Auth0 TMC 협의 중"],
    ["DVT 영향 분석", "TC 영향 분석 · N/T 재수행 0.50", "0.50", "9월 초 Pre-Prod Regression 추가 요구", "결과 기재 없음. 73p 귀책 표기가 ‘LG U+’"],
    ["합계", "uCube 0.95 제외", "10.10", "", ""],
  ],
  check: [
    "발생일을 메일 수신일로 특정: 86p 변경 · 정정 이력 16건 중 12건이 월 단위 표기",
    "근거 없는 항목: DMS 1.05 · Digital Key 0.25 · Share User 409 · Root CA 오류는 86p에 없음 → 근거 메일 확보, 못 하면 시험 대응(17.95) 쪽으로 이동",
    "8.10과 중복 여부: Upsert(2.8, 1.75) · Capable(2.4, 0.75)과 10월 재변경분의 구분 근거",
    "CTI/TCK · DMS · App 2.50은 TMKR 측 사유라 4개 분류(ACOS 추가 변경 · TMC 서버 지연 · uCube · DVT 영향분석) 중 어디에도 맞지 않음",
    "발생 시점 불일치: CTI 10/26(15p) ↔ 11월(86p), VDP CoCo 정정 10/22 ~ 26(15p) ↔ 10/06 ~ 10(86p)",
  ],
  ask: "TMKR 문의 대응: 항목별 ‘발생 시점 · 사유 · 현재 결과’를 한 줄로 답변할 수 있도록 정리 → 부록 ‘15p 항목별 확인표’",
};

Object.assign(deck.ev, {
  blk: { kicker: "현재 블로킹 이슈", title: "11/17 기준 잔여 이슈 5건 (TMC 측 선행 조건 미해소)", facts: ["① MM/HU · ACOS Provisioning (TMC): SU#1 H/U, SubMCU 업데이트 5회 완료, 테스트 필요. 11/18 MM Capable Flag 확인 완료, Flag 조합별 Opt-in/out 추가 검증 필요", "② VDP Diag (TMC): 24 TC 중 Pass 21 · Fail 1 · NT 2(최신). VDP 서버 영향으로 e-Care E2E 진행 불가", "③ CTI/TCK 중계 연동 (TMKR·TMC): 27CY SU#2 전용 연계환경 구성 필요", "④ DMS 연동 (TMKR): VDP 실데이터 미수신으로 시뮬레이터 대체 시험", "⑤ ACOS API 사양 (TMC): TSC-GC/GB Request/Response 변경 영향 지속"], src: ["ccb1118"], apx: "apx-cause" },
  e2e11: { kicker: "Kensho E2E", title: "DVT 잔여 이슈 지속 관리 + E2E 병행 수행", facts: ["진행 기조: DVT의 잔여 이슈는 일정 조율을 통해 지속 관리하고, E2E는 병행 수행", "VDP 서버 영향으로 e-Care E2E는 진행 불가 → 초반 E2E는 GS TC 위주로 진행 예정", "E2E 세부일정: 11/23 진입, 12/30 회귀 테스트 종료", "잔여 이슈가 남은 상태로 병행하므로 E2E 기간에도 DVT 잔여 대응 인력이 함께 필요"], src: ["sch", "ccb1118"], apx: "apx-gate" },
  c1: { kicker: "CCB 검토 · 청구 공수", title: "23.01 → 22.06 MM (uCube 0.95 제외)", facts: ["① e-Care 콜버튼 3.86 · ② ACOS 추가개발 8.10 · ③ DVT 기간 10.10 = 22.06 MM", "uCube(0.95)는 LG U+ 연계 시스템 사유라 청구 항목과 청구 MM에서 제외", "3p 요약표 · 15p 산정 기준 문구(‘uCUBE 0.95 MM 포함’) · 3p 노트(49.01 MM)를 함께 고쳐야 함", "4번 섹션 추가 DVT(24.95)는 3p 요약표에 없음 — 요약에 넣을지, 별도 안건으로 둘지 정리 필요"], src: ["ccb1118"], apx: "apx-ccb-order" },
  c2: { kicker: "CCB 검토 · 15p", title: "DVT 기간 변경 · 연동 대응 10.10 MM", facts: ["ACOS 추가 변경 2.60 · TMC 서버 지연 대응 4.50 · TMKR 연계 변경 2.50 · DVT 영향 분석 0.50", "개발사 주장: ① 7/27 규격 배포 이후에도 ACOS 변경이 추가로 발생 ② VDP · PGM 등 TMC 서버 연동 지연으로 개발자가 투입되어 분석 · 대응", "근거로 든 72 · 73p(A4-1 산정 내역)와 86p(A7 변경 · 정정 이력)를 항목별로 대조함", "근거가 확인되는 항목: VDP Diag · VDP CoCo · ACOS API · ACOS Provisioning · MM/HU · CTI · App (단, 상당수가 월 단위 표기)", "근거가 없는 항목: DMS 1.05 · Digital Key 0.25"], src: ["ccb1118"], apx: "apx-ccb-item" },
  c3: { kicker: "추가 인력 근거", title: "추가 DVT 예측 25.00 MM (11.18 ~ 2027.01.29)", facts: ["대기 · 운영 인력은 월 15명 내외로 두고 유휴분은 수행사가 부담, 청구는 실제 대응분 월 10 MM(11월 5 MM)으로 한정", "11월 5.0 · 12월 10.0 · 1월 10.0 = 25.00 MM, uCUBE(LGU+ 연계)는 별도 협의로 제외", "4월 계약 계획의 9월 개발 인력 10 MM(GS 3 · e-Care 7) 수준", "DVT 잔여 대응과 E2E 병행 기간 동안 모듈 담당자 대기 · 운영 필요"], src: ["ccb1118"], apx: "apx-man" },
  c4: { kicker: "CCB 검토 · 실적", title: "10 · 11월 개발자는 13 · 13 MM", facts: ["81p 월별 실제 투입: 10월 18 = 개발 13(GS 4 · e-Care 9) + 품질 4 + 기획 1, 11월 17 = 개발 13 + 품질 4", "21p 그래프의 실적(17 · 18)은 품질 · 기획 포함 수치 — 개발자만 남기면 13 · 13", "검토 지시의 ‘10월 17 · 11월 18’과 81p의 ‘10월 18 · 11월 17’은 순서가 반대 — 그래프 수정 시 함께 확인", "첨부본(11/18) 21p 그래프에는 실적 막대 없이 범례만 남아 있음"], src: ["ccb1118"], apx: "apx-ccb-21" },
});

apxNew.m8 = { id: "apx-ccb-item", code: "", title: "CCB 15p · DVT 기간 추가 · 변경 업무 항목별 확인표", message: "15p의 각 항목을 근거로 든 72 · 73p(A4-1)와 86p(A7)에 대조함. uCube는 청구에서 제외함. 페이지 번호는 검토 지시 기준(자료 하단 번호 +1).",
  head: ["항목", "MM", "분류", "언제", "무엇 때문에", "근거 72 · 73 · 86p", "현재 결과", "확인 필요"],
  rows: [
    ["VDP Diag", "1.40", "TMC 서버 지연", "8/26 사양 협의 시작 → 10/27 ~ 11/16 연동 시험", "Diag 서버 미연동, x-api-key · 필드 조건 불일치, resultCd 기대값 차이(KR 90 · JP 0)", "73p 3건 · 86p 8/26, 8 ~ 9월(대만 계정), 10월 x-api-key", "24 TC 중 Pass 21 · Fail 1 · NT 2 (11/13 첫 실연동 이후)", "수신 IF 개발이 원래 범위인지, 변경 대응분만 얼마인지"],
    ["VDP CoCo", "1.00", "TMC 서버 지연", "10/06 IP 접속 시험 → 10/22 401 → 10/26 단일 /v1 정정", "제공 IP가 CoCo 대상 아님, Endpoint 3종 401, Collection Status 알림 신규", "72p 3건 · 86p 10/06, 10/06 ~ 10, 10월, 10 ~ 11월", "Center Request 정상 응답, Callback 검증 중", "86p에 10/22 · 10/26 정정 없음(77p에는 있음). Collection Status 요구 일자"],
    ["ACOS API", "1.25", "ACOS 추가 변경", "10/15 Notify API 변경 · 10월 Upsert 정책 변경 · 10 ~ 11월 Share User 409", "본사 API Request/Response 차이, Upsert Administrator 정책(SkipVehicleAuthentication) 변경", "72p 3건 · 86p 10/15, 10월", "변경 반영 · 재검증 완료", "8.10의 2.8 Upsert(1.75)와 구분 근거. 409는 변경이 아니라 오류 — 원인이 TMC인지"],
    ["ACOS Provisioning", "1.35", "ACOS 추가 변경", "10월 Capable 응답 변경 · 11월 초 MM Flag 미반환", "TSC-GC Migration 후 Capable Partial(000002), DCM 29 · MM 4 · VDP 2 Flag 조건 변경", "72p 3건 · 86p 10월, 10 ~ 11월", "11/18 MM Capable Flag 확인 완료, Flag 조합별 Opt-in/out 추가 검증", "8.10의 2.4 Capable(0.75)과 구분. MM Flag는 MM/HU 항목과 겹침"],
    ["MM/HU · DCM/ADF", "1.85", "TMC 서버 지연", "10월 말 MM Provisioning 요구 → 11/15 SubMCU 실패", "보유 H/U가 SU#1, Root CA 불일치로 ADF 등록 실패, SubMCU 업데이트 오류", "72p(DCM/ADF 0.85 + MM/HU 1.00) · 86p 10 ~ 11월", "SubMCU 업데이트 5회 완료, 테스트 필요", "H/U 업데이트 · Key Writing은 환경 작업 — 시험 대응(17.95)과 경계. Root CA는 86p에 없음"],
    ["CTI/TCK", "0.90", "TMKR 연계(분류 결정)", "10/26 전후(15p) · 11월(86p)", "24DCM 중계서버 영향으로 27CY SU#2 환경 분리, MQTT → REST · CTN 연계 추가", "73p 2건 · 86p 11월", "27CY SU#2 전용 연계환경 구성 필요, CCW 통화 E2E 미수행", "발생 시점 불일치. CTI 연동이 원래 범위였는지"],
    ["Global/Local App", "0.55", "TMKR 연계(분류 결정)", "11월 초 ~ 중순", "일본 Auth0와 KR 테넌트 불일치, DeepLink login_required", "73p 2건 · 86p 11월", "TMC 설정 변경 협의 중", "15p는 TMKR, 17p 사례는 TMC로 표기 — 귀책 통일"],
    ["DMS", "1.05", "TMKR 연계(분류 결정)", "10/28 DMS 사양 변경판", "DMS-WAM 데이터 불일치, Warning Clear · Workflow 조건 추가, Platform Code 분기", "73p 3건 · 86p 없음", "VDP 실데이터 미수신으로 시뮬레이터 대체 시험", "10/28 변경판 메일 확보"],
    ["Digital Key", "0.25", "TMC 서버 지연", "일자 확인 중(15p 각주)", "TSC-DK Wrapper 신규 연계, White List", "73p 1건 · 86p 없음", "기재 없음", "발생 일자 · 근거 확보 전에는 청구 보류 검토"],
    ["DVT 영향 분석", "0.50", "DVT 영향 분석", "9월 초 Regression 추가 → 10/06 ~ 11/17 TC 수정", "API · IF 변경으로 TC 기대값 변경, Blocked · N/T 재수행", "73p 2건(귀책 ‘LG U+’) · 86p 9월 초", "기재 없음", "귀책 표기 정정. TC 수정 · 재수행은 QA 업무와 경계"],
    ["합계", "10.10", "", "", "", "", "", ""],
    ["uCUBE (제외)", "0.95", "청구 제외", "11/16 오류 공유 · 11/17 TMKR 문의", "선개통 Callback 24DCM 환경 전달, svcEntr/chgsp 오류", "73p 3건(귀책 LG U+) · 86p 제외", "-", "15p 표 · 산정 기준 문구 · 3p 노트에서 삭제"],
  ] };

apxNew.m9 = { id: "apx-ccb-21", code: "", title: "CCB 21p · 추가 DVT 예측 공수 교차 검토 (25.00 MM 기준)", message: "갱신된 21p(25.00 MM, 월 10 MM 청구)를 이전 판(26.95 MM) 검토 결과, 15p · 8.10 · 81p 월별 투입표와 대조함.",
  head: ["점검", "이전 판 (26.95)", "갱신본 (25.00)", "남은 확인"],
  rows: [
    ["uCUBE", "2.00 MM 포함", "제외(별도 협의) — 반영됨", "-"],
    ["개발자 상한", "월 환산 약 10.2 · 10.7 · 10.6명(품질 포함)", "청구 월 10 MM(11월 5) — 4월 계약 계획 9월 개발 10 MM(81p) 수준", "대기 · 운영 15명 내외 · 유휴분 수행사 부담을 서면으로 확정"],
    ["10 · 11월 실적", "그래프 실적 17 · 18(품질 · 기획 포함)", "그래프 없음", "14p · 17p 등 다른 장의 실적은 개발자 13 · 13 기준으로 통일"],
    ["예측 단위", "‘명’ 표기에 MM 값", "‘청구 MM’ · ‘대기 · 운영 명’ 분리 — 반영됨", "-"],
    ["15p와 중복", "MM/HU ‘B Case · ADF 재등록’, ACOS Provisioning ‘MM Flag · Opt-in/out’", "같은 문구 유지", "15p 이후 ‘남은 일’만인지 영역별로 설명"],
    ["8.10과 중복", "ACOS API ‘Upsert · Consent’", "같은 문구 유지(2.20)", "Upsert는 8.10(2.8) · 15p에 이어 세 번째 — 새로 하는 일과 구분"],
    ["행 간 중복", "Warning Clear · Workflow가 e-Care · DMS · VDP Diag 세 행에 걸침", "e-Care ‘Warning Grouping · Workflow’, DMS ‘Warning 연계’ 유지", "영역 경계 정리"],
    ["DVT 영향 분석", "DVT / QA 2.55(QA 업무)", "DVT 영향 분석 2.60(잔여 N/T 재수행 · 회귀시험)", "QA 업무를 개발 청구에 넣는 근거, 15p 귀책 ‘LG U+’ 표기와의 관계"],
    ["계약 인력 차감", "‘11/18 이후 계약된 개발 없음’", "언급 없음", "계약상 E2E 대응 인력이 있으면 뺀 순증분인지 확인"],
    ["완료 시점", "실질 완료 2027년 1월 말", "11.18 ~ 2027.01.29 유지", "이 보드의 12/30 마지노선과 함께 협의"],
  ] };

apxNew.m10 = { id: "apx-ccb-order", code: "", title: "CCB 3번 섹션 순서 조정(안)과 함께 고칠 곳", message: "3번 섹션의 핵심은 15p임. 15p를 섹션 맨 앞으로 이동하고, 당사 논리와 맞지 않는 12p는 삭제함.",
  head: ["현재", "제안", "이유 · 고칠 내용"],
  rows: [
    ["11p 섹션 표지", "유지", "‘정산 요청 11.05 MM’ → 10.10 MM"],
    ["12p DVT 주요 일정 변경", "삭제", "7p(ACOS 일정)와 같은 그림. ‘DVT가 옮겨졌을 뿐’으로 읽혀 변경 · 지연 대응 논리와 충돌(TMKR 11/11 의견: 단순 대기 · 유지 인력은 인정 어려움)"],
    ["15p 변경 · 정정별 업무와 공수", "섹션 첫 장", "4개 분류로 재구성(ACOS 추가 변경 · TMC 서버 지연 · uCube · DVT 영향분석), uCube 행 삭제, 합계 10.10, 진행 일정 열 추가"],
    ["16p 7/27 이후 계속된 변경 · 정정", "15p 바로 뒤", "8월 Service Flag 34 → 53 · 9월 일정 변경은 8.10 기간이라 10 · 11월 근거와 구분. CCW 236건 원인 분류는 시험 대응"],
    ["14p 개발인력 주요 업무", "16p 뒤", "월 13.0 MM은 개발자 기준 — 21p 실적과 숫자 맞춤"],
    ["17p 29.00 MM 구성", "유지", "11.05 / 17.95 → 10.10 / 18.90 (uCube 0.95는 미청구)"],
    ["18p 정리 및 요청", "마지막", "정산 10.10 MM"],
    ["13p DVT 시험 결과", "4번 섹션 앞으로", "잔여 NT → 추가 DVT 필요를 말하는 장표"],
    ["3p Summary", "수정", "23.01 → 22.06, ③ 11.05 → 10.10. 노트의 49.01은 추가 DVT 포함 수치 → 47.06, 요약표에 ④를 넣을지 결정"],
    ["76 · 77p", "수정", "76p ‘34 MM 필요’는 81p(35 · 개발 26)와 다름. 77p ‘본 보고 45.51 MM 미포함’은 이전 판 수치"],
  ] };

/* ── v2.8 (11/21): DVT 통합 결과 최신 집계 ── */
apxNew.m11 = { id: "apx-total", code: "", title: "DVT 통합 결과 (최신 집계, 992 TC)", message: "DVT 결과를 영역별로 통합한 최신 집계임. 잔여 Fail 2건 · NT 334건은 Open Item으로 두고 일정 조율을 통해 지속 관리함.",
  head: ["영역", "Total", "Pass", "Fail", "NT", "Pass율"],
  rows: [
    ["GS", "326", "288", "0", "38", "88.3%"],
    ["OPW", "292", "269", "0", "23", "92.1%"],
    ["CCW", "236", "0", "0", "236", "0.0%"],
    ["DMS", "114", "78", "1", "35", "68.4%"],
    ["VDP(Diag)", "24", "21", "1", "2", "87.5%"],
    ["합계", "992", "656", "2", "334", "66.1%"],
  ] };

/* ── v2.6 (11/19): 추가 DVT 예측 공수 25.00 MM ── */
deck.man = {
  kicker: "추가 인력 · 11월 ~ 내년 1월",
  title: "추가 DVT · 예측 공수 25.00 MM (11.18 ~ 2027.01.29)",
  lede: "개발 조직은 15명 내외로 대기 · 운영하되 유휴분은 다산이 부담하고, 실제 대응분 11월 5 · 12월 10 · 1월 10 MM에 해당하는 부분만 인정 요청 드립니다.",
  baseTitle: "운영 인력과 청구 기준",
  cards: [
    { small: "대기 · 운영 인력", v: "월 15MM 내외", d: "모듈 담당자 상시 유지" },
    { small: "청구 인력", v: "월 10 MM", d: "실제 대응분 · 유휴는 다산 부담", hot: true },
  ],
  bullets: [
    "24DCM DVT · E2E 대응 기간에는 개발팀 평균 22명을 유지했습니다.",
    "DVT · E2E 기간에는 각 모듈 담당자가 협의된 범위의 추가 · 변경 · 이슈 대응을 위해 반드시 대기해야 합니다.",
    "원활한 진행을 위해 대기.운영 인력은 월 15명 내외로 구성하고, 유휴 인력 비용은 수행사가 부담합니다.",
    "청구는 실제 대응분인 월 10 MM(11월은 5 MM)으로 한정하며, 이에 대한 인정을 요청드립니다.",
  ],
  perHead: ["기간", "대기 · 운영", "청구 MM"],
  perRows: [
    ["11/18 ~ 11/30", "15명", "5.0"],
    ["12/01 ~ 12/31", "15명", "10.0"],
    ["'27.01/01 ~ 01/29", "15명", "10.0"],
    ["합계", "", "25.0"],
  ],
  areaHead: ["분류", "영역", "주요 업무", "11월", "12월", "1월", "합계"],
  areaRows: [
    ["VDP 변경·수정", "VDP Diag", "WNG/DTC/LAST 잔여 TC 검증 · 수정", "1.0", "1.9", "1.9", "4.80"],
    ["", "VDP CoCo", "Callback · Collection Status 연동", "0.4", "0.8", "0.8", "2.00"],
    ["ACOS 변경·수정", "ACOS API", "Upsert · Consent 오류 수정 · 검증", "0.4", "0.9", "0.9", "2.20"],
    ["", "ACOS Provisioning", "MM Flag · Opt-in/out 처리 보완", "0.7", "1.4", "1.4", "3.50"],
    ["외부시스템 변경 · 수정", "MM/HU · DCM/ADF", "B Case 정상화 · ADF 재등록", "0.4", "0.6", "0.5", "1.50"],
    ["", "CTI/TCK", "중계서버 연계 · CCW 통화 E2E", "0.4", "0.9", "0.9", "2.20"],
    ["", "Global/Local App", "Auth0 · DeepLink E2E 검증", "0.3", "0.7", "0.7", "1.70"],
    ["", "DMS · Digital Key", "Warning 연계 · TSC-DK 검증", "0.4", "0.8", "0.8", "2.00"],
    ["", "e-Care", "Warning Grouping · Workflow 검증", "0.5", "1.0", "1.0", "2.50"],
    ["DVT 수행 영향", "DVT 영향 분석", "잔여 N/T 재수행 · 회귀시험", "0.5", "1.0", "1.1", "2.60"],
    ["합계", "", "월 청구 MM", "5.0", "10.0", "10.0", "25.00"],
  ],
  foot: "※ 월 MM = 해당 월 실제 대응 예상 인원 기준(11월은 11/18 이후 잔여 기간). uCUBE(LGU+ 연계)는 별도 협의로 본 산정에서 제외",
};

/* ── v2.9 (11/21): TMKR 보고용 — 내부 검토 장표 · 부록은 출력에서 제외(원문은 이 파일에 보존) ── */
const INTERNAL = /CCB 검토|강행|Copilot|15p|21p|uCube|청구 22\.06|순서 조정|출처별 적용 한계/;
delete deck.s4;
["c1", "c2", "c4"].forEach(function (k) { delete deck.ev[k]; });
["m6", "m7", "m8", "m9", "m10"].forEach(function (k) { delete apxNew[k]; });

module.exports = {
  meta: {
    title: "DVT 및 E2E 운영방안 논의",
    project: "Global South · e-Care",
    date: "2026.11.21",
    asof: "DVT 통합 결과 최신 집계(11/21 반영) · 11/14 논의 · Teams 11/13 · Confluence 11/12 · GSP DB 11/11 기준",
    changelog: [
      { v: "v2.9", at: "2026.11.21", items: [
        "TMKR 보고용으로 내부 검토용 장표 1장과 내부용 부록 5장을 화면에서 제외"
      ] },
      { v: "v2.8", at: "2026.11.21", items: [
        "DVT 통합 결과 최신 집계 반영 — 992 TC 중 Pass 656 · Fail 2 · NT 334 (GS 326/288/0/38 · OPW 292/269/0/23 · CCW 236/0/0/236 · DMS 114/78/1/35 · VDP(Diag) 24/21/1/2), 부록 ‘DVT 통합 결과’ 추가",
        "진행 기조 반영 — DVT 잔여 이슈는 일정 조율을 통해 지속 관리하고 E2E는 병행 수행. VDP 서버 영향으로 e-Care E2E는 진행 불가하여 초반 E2E는 GS TC 위주로 진행(메인 · 실행 · Timeline)",
        "TMKR 보고용으로 전체 문장을 보고체(~함 · ~임)로 정리, 화면 편집 내용(제안 장)은 본문에 반영"
      ] },
      { v: "v2.7", at: "2026.11.19", items: [
        "메인 메시지 교체 — DVT 종료 어려움(NT 352 / 968 · 3차 39, Critical Blocker 5건) → TMKR 11/23 E2E 강행 → 1월까지 추가 인력 25 MM",
        "장 순서: 메인 → 블로킹 이슈 → 추가 인력 → 제안 · 실행 → CCB 검토 → Timeline"
      ] },
      { v: "v2.6", at: "2026.11.19", items: [
        "추가 인력 장 추가 — 추가 DVT 예측 공수 25.00 MM(11.18 ~ 2027.01.29), 대기 · 운영 월 15명 내외 · 청구 월 10 MM(11월 5 MM), 영역별 월 MM 표(uCUBE 제외)",
        "CCB 검토 장 · 21p 교차 검토 부록을 25.00 MM 기준으로 갱신",
        "3차 DVT NT를 최종 39건으로 수정(1장 지표 · 근거 패널 · 3차 표 주석)"
      ] },
      { v: "v2.5", at: "2026.11.19", items: [
        "현재 블로킹 이슈 장 추가 — 11/17 기준 잔여 이슈 5건 · DVT 실질 완료 시점 검토(11/18 CCB 자료 원문)",
        "CCB 검토 장 추가 — uCube 제외(청구 22.06 · DVT 기간 10.10 · 추가 DVT 24.95 MM, v2.6에서 25.00 MM으로 갱신), 15p 4개 분류, 21p 교차 검토, 3번 섹션 순서 조정(안)",
        "부록 3장 추가: 15p 항목별 확인표 · 21p 교차 검토 · 순서 조정(안)"
      ] },
      { v: "v2.4", at: "2026.11.16", items: [
        "화면 편집: 블록 폭 조절(넓게 · 좁게 · 폭 최대)과 한 줄로(넘치면 글자 자동 축소) 추가 — 블록 선택 · 글자 편집 중 모두 표시"
      ] },
      { v: "v2.3", at: "2026.11.16", items: [
        "화면 편집: 블록 이동(▲ 위로 · ▼ 아래로 · Alt+↑/↓) 추가 — edits.json moves 로 저장",
        "화면 편집: 한글 입력 중 Enter 줄바꿈 · 가로 배치 블록 줄바꿈 표시 보완"
      ] },
      { v: "v2.2", at: "2026.11.14", items: [
        "11/13 이준제 보고(Teams) 반영: MS 장애로 다산 메일 · VPN 비밀번호 수신 불가 → VPN 1개로 진행, VDP Diag와 DMS 동시 진행 불가",
        "HU(MM) 업데이트 현황 정정: ‘9단계 중 3단계’ → Tier1 업데이트 ①의 9단계(성공 여부 확인)에서 중단, 결과 파일 미생성",
        "VDP Diag 24 TC 중 2건 성공 · 3번째 문의 중, DMS 기준 정보 연동 미진행. 세 건 모두 11/16(월) 재개(VDP 10시 · HU 13시)",
      ] },
      { v: "v2.1", at: "2026.11.14", items: [
        "현황 반영: VDP(e-Care) 연계 테스트 24 TC 중 2건 성공, HU 펌웨어 업데이트 9단계 중 3단계에서 중단",
        "12/30을 Kensho E2E 회귀 테스트 종료일이자 주요 Blocking Issue 해소 마지노선으로 명시(1장 · 3장 · Timeline)",
        "Copilot 제안(E2E Conditional Entry 핸드오프 패키지) 반영: ‘DVT Open Item 유지 + E2E 조건부 진입’ 표현, Gate G-01 ~ G-09, 11/20 진입 판정, 자원 · 계약 유지 전제",
        "Appendix 추가: Gate, Copilot 제안 분석, 출처별 적용 한계. 패키지의 Risk Register 예시 행과 공수 수치(CCB v43)는 미반영",
      ] },
      { v: "v2.0", at: "2026.11.14", items: [
        "문서를 ‘DVT 및 E2E 운영방안 논의’로 확장 — 메인 3장(현황과 쟁점 · 제안 · 실행과 공수 전제) + Timeline + Appendix 구조로 재구성",
        "근거는 메인 장표에서 오른쪽 서랍으로 열리고, 서랍의 [부록에서 자세히] 버튼으로 해당 Appendix 페이지로 이동",
        "기종결 · 11/15 종결 예정인 LG U+ 조치 항목(단말 개통 · uCube · 케이블 · 보안정책 등) 삭제",
        "11/14 DVT · E2E 논의(회의록 · 화이트보드)를 반영: 조건부 승인안, 대안 비교, 공수 협의 전제, E2E 병행 트랙",
        "이전 화면 편집 내용(edits.json)은 페이지 구조가 바뀌어 적용되지 않음",
      ] },
      { v: "v1.3", at: "2026.11.14", items: [
        "화면 편집: 글자 서식 추가 — 굵게 · 기울임 · 밑줄 · 취소선(편집 중 선택한 글자, 또는 블록 · 글상자 전체), 글자 크기 조절(A− / A+)",
      ] },
      { v: "v1.2", at: "2026.11.14", items: [
        "화면 편집: 글자 줄바꿈(Enter) 지원, 글상자 · 도형 크기를 8방향 핸들로 조절, 되돌리기를 일반적인 Undo 아이콘으로 변경",
      ] },
      { v: "v1.1", at: "2026.11.14", items: [
        "화면 편집 기능 추가 — 상단 바 ✎ 편집에서 글자 수정, 도형(사각형 · 원 · 선 · 화살표 · 글상자), 블록 배경 · 글자색 변경",
        "수정 내용은 edits.json 에 저장되어 git 에 커밋되고, 자동 배포로 사이트에 반영 (저장은 GitHub 토큰이 있는 편집자만 가능)",
        "파비콘 추가. 보드의 숫자 · 근거 데이터는 v1 과 동일",
      ] },
      { v: "v1", at: "2026.11.14", items: [
        "1 · 2 · 3차 DVT 결과(Confluence)와 PM 정례 10/07 ~ 11/11, E2E 사전준비, GSP DB 이슈트래킹을 한 보드로 정리",
        "NT 원인을 원인 제공 조직(TMC · TMKR 측 협력사 · Dasan)별로 분류",
        "3차 결과는 11/12 누적까지 반영. 11/13 HU 업데이트 · VDP Diag 1차 결과는 미게시라 미반영",
      ] },
    ],
  },
  src, rounds, daily, ntWhy, remain, deck, apxNew,

  appendix: {
    a1: { id: "apx-r1", code: "A1", title: "1차 DVT 일별 결과 (GS 290 TC)", message: "1차는 GS만 시험. 10/07 Fail 207건은 Block 분류 폐지(10/07 PM) 이후 재판정되어 10/13 Fail 14 · NT 157로 변경됨.", source: "r1" },
    a2: { id: "apx-r2", code: "A2", title: "2차 DVT 일별 · 영역별 결과 (854 TC)", message: "누적 NT는 362 → 288(선행조건 변경) 이후 300 안팎에서 정체됨. 남은 NT 323건 중 236건이 콜센터 웹임.", source: "r2" },
    a3: { id: "apx-r3", code: "A3", title: "3차 DVT 진행 (80 TC, 11/12 누적)", message: "2차 Fail과 Fail에 따른 NT만 재시험함. VDP Diag 24건은 11/12 시점에는 미수행 상태였음(최신 집계: Pass 21 · Fail 1 · NT 2).", source: "r3" },
    a4: { id: "apx-cause", code: "A4", title: "차단 요인 상세 (원인 제공 · 영향 · 해소 예정)", message: "원인 제공 조직은 회의록 · 사전준비표 · GSP DB 기록에서 읽은 것이며, 귀책 판정이 아니라 후속 조치를 정하기 위한 분류임.", source: "db" },
    a5: { id: "apx-pre", code: "A5", title: "E2E 사전준비 체크리스트 (11/11)", message: "20개 체크 항목 중 ‘준비완료’는 6건. 나머지 14건은 진행중 · 외부일정대기 · 확인필요 상태임.", source: "pre",
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
    a6: { id: "apx-plan", code: "A6", title: "DVT 계획 변경 이력", message: "계약상 GS · e-Care DVT는 각 1개월(8월 · 9월)이었고, 실제는 10/06에 시작하여 3차까지 진행됨.", source: "db",
      head: ["시점", "내용", "출처"],
      rows: [
        ["계약", "GS DVT 2026.08(1M), e-Care DVT 2026.09(1M) → CCB 변경안: 각 2026.10 ~ 11(1.5M)", "CCB_TMKR_1109 요약(GSP DB)"],
        ["8/25", "DVT 9/1 ~ 9/30 계획(PRE-PROD)", "Teams U+D"],
        ["9/02", "3단계: 1차 GS → 2차 GS 버그 + e-Care → 3차 전체 미진 항목. Kensho 11/1 목표", "(09/02) PM 정례"],
        ["9/22", "1차 10/6 ~ 10/13 GS만, 2차 10/26 ~ 11/6 GS + e-Care", "Teams U+D"],
        ["10/01", "DVT 종료 11/30 → 11/17로 2주 단축안", "Teams U+D"],
        ["10/07", "2차 시작 10/21 확정. Block 폐지, NT = 진입 불가로 한정, Fail에 원인 주체(TMC/한국/일본) 컬럼 추가", "(10/07) PM 정례"],
        ["10/21", "2차: GS는 선행조건 정상화 후, e-Care는 VDP · CTI · DMS 제약으로 가능 범위만. CCW는 CTI 미연동 사유로 NT", "(10/21) PM 정례"],
        ["11/03", "3차 11/11부터, 11/20 전후 DVT 종료 · Kensho 전환 준비", "(11/03) PM 정례"],
        ["11/11", "3차 착수 80 TC. MM Update 후 기존 NT · VDP · GSA/DeepLink 중점", "3차 결과 · (11/11) PM"],
      ] },
    a7: { id: "apx-src", code: "A7", title: "근거 자료와 첨부 목록", message: "1 · 2차 결과 페이지의 첨부(일별 TC 엑셀 13건, 캡처 3건)와 TC 문서 버전 이력임. 엑셀 본문은 이 작업 환경에서 내려받을 수 없어(외부 접속 차단), TC 행 단위 NT 사유는 이번 판에 반영하지 못함.", source: "st",
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
        ["3차", "첨부 없음", "11/11", "-"],
      ],
      tcHist: [
        ["v1.0", "08/24", "초안"],
        ["v1.1", "08/31", "개발팀 검토 반영, 시험결과 관리 기준 조건 반영"],
        ["v1.2", "09/08 · 09/22", "e-Care 상담 이력 목록 개선, 사전 필요데이터 분류, DVT 진행 가능 여부 · 외부 연동 시험 여부 조건 반영"],
        ["v1.3", "09/22", "e-Care 상담 이력 응대 중 오류 대응 변경"],
        ["v1.4 (GS)", "10/22 ~ 10/30", "2차 DVT 시험 기록본"],
      ] },
  },
};
module.exports.meta.changelog = module.exports.meta.changelog.map(function (c) { return { v: c.v, at: c.at, items: c.items.filter(function (t) { return !INTERNAL.test(t); }) }; }).filter(function (c) { return c.items.length; });
