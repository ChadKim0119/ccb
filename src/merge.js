// ── 2026.11.21 통합: Item1(ACOS · VDP 지연 추가 개발) + Item2(DVT 개발 인력 유지) ──
// content.js 의 module.exports 를 받아 통합 장표용 데이터(M)와 Item2 데이터(X)를 붙이고,
// Item1 부록의 현재 상태를 DVT 최신 평가(992 TC)로 갱신한다.
const X = require("./dvt.js");

module.exports = function (base) {
  const A = base.appendix;

  /* ── 1. Item1 부록 현재 상태 최신화 (DVT 장표 v2.9 · 11/21 집계 기준) ── */
  const now = {
    "ACOS API": "변경 반영 · 재검증 완료. TSC-GC/GB Request/Response 변경 영향 지속 (Redoc 사양 · Pre-PROD 반영 일정에 따라 추가 개발 가능)",
    "ACOS Provisioning": "11.18 오전 MM Capable Flag 정상화(27CY MM Flag 4개 수신). 원인 미확인 → TMC 분석 요청. Provisioning · 요금제 TC · Opt-in/out 재수행 결과는 미확인",
    "VDP Diag": "10.27 네트워크 접속 → 11.13 첫 API 호출 → 11.18 잔여 Fail 4건(PM 회의록) → 11.20 개발 PM 확인 집계 24 TC 중 Pass 21 · Fail 1 · NT 2. 미해소: e-Care E2E는 VDP 서버 정상화 후",
    "VDP CoCo": "Center Request 정상 응답, Callback 검증 중",
    "MM/HU · DCM/ADF": "11.13 · 11.15 HU 업데이트가 성공 확인 단계에서 멈춤(5회) → 11.18 HU 마지막 단계 재수행 · DCM 2644 FW 재적용 · ADF 재수행으로 HU ID 정상 전달 (해소, 원인 미확인)",
    "Digital Key": "TSC-DK 연동 환경 확인 진행 중",
    "CTI/TCK": "미해소: TCK 개발 최대 3주, 고객센터 연계 시나리오는 12월 시험 진입(11.11 기준, 이후 갱신 없음). CCW 236 TC는 CTI 미연동으로 NT",
    "Global/Local App": "TMC Auth0 설정 변경 협의 중",
    "DMS": "VDP 실데이터 미수신으로 시뮬레이터 대체 시험. DMS 114 TC 중 Pass 78 · Fail 1 · NT 35",
    "DVT 영향 분석": "통합 992 TC 중 잔여 NT 334건 원인 분류 · 재수행 대기",
  };
  A.dvtChg.head = A.dvtChg.head.map((h) => h === "수행 업무 → 현재 결과" ? "수행 업무 (현재 상태는 A16)" : h);
  A.dvtChg.rows.forEach((r) => {
    r[4] = r[4].split("→")[0].trim(); /* 현재 상태는 A16 한 곳에서만 관리 (MECE) */
  });
  // A16: 현재 상태 최신화 + 향후 공수를 Item2 25.00 MM 산정(월 10 MM 청구) 기준으로 교체
  const fut = { "ACOS API": 2.2, "ACOS Provisioning": 3.5, "VDP Diag": 4.8, "VDP CoCo": 2.0, "MM/HU · DCM/ADF": 1.5, "Digital Key": 0, "CTI/TCK": 2.2, "Global/Local App": 1.7, "DMS": 2.0, "DVT 영향 분석": 2.6, "e-Care 기능 검증": 2.5 };
  A.chgPlan.rows.forEach((r) => {
    const k = r[0].replace(/^[①②③④]\s*/, "");
    if (now[k]) r[3] = now[k];
    if (k in fut) r[5] = fut[k];
    if (k === "DMS") r[0] = "③ DMS (Digital Key 향후분 포함)";
    if (k === "Digital Key") r[3] += " (향후분은 DMS · Digital Key 2.00에 포함)";
  });
  A.chgPlan.title = "변경 · 연동 항목별 예정 vs 실제와 공수 (발생 10.10 · 향후 25.00 MM)";
  A.chgPlan.notes = [
    "발생 MM은 A13 다산 산정(10.01 ~ 11.17) 중 고객사 청구분 10.10 MM, 향후 MM은 Item2 추가 인력 산정(11.18 ~ 2027.01.29, 월 10 MM · 11월 5 MM) 25.00 MM. uCUBE는 LGU+ 부담으로 두 공수 모두에서 제외",
    "향후 MM 매핑: DMS와 Digital Key는 Item2 산정의 'DMS · Digital Key 2.00'으로 합쳐 표기, DVT 영향 분석은 '잔여 N/T 재수행 · 회귀시험 2.60', e-Care 기능 검증은 'Warning Grouping · Workflow 검증 2.50'",
    "현재 상태는 DVT 통합 결과 11.20 개발 PM 확인 집계(992 TC · Pass 656 · Fail 2 · NT 334) 기준",
    "기준 일자 출처: 07.27 TMC 최종 규격, 08.26 · 09.02 · 10.07 ~ 21 PM 정례회의록, 09.15 서면, 10.04 TMC 일정 (A1 · A13 · A14)",
  ];
  // A15: Item2 와 같은 25.00 MM 산정으로 통일 (이전 판 24.95 는 Item2 산정으로 대체)
  A.extraDvt.title = "추가 DVT 기간 예측 공수 (2026.11.18 ~ 2027.01.29, 25.00 MM)";
  A.extraDvt.message = "Item2 추가 인력 산정과 같은 기준임. 대기 · 운영 인력은 월 15명 내외로 두고, 청구는 실제 대응분 월 10 MM(11월 5 MM)으로 한정함. uCUBE는 제외";
  A.extraDvt.areas = X.deck.man.areaRows.filter((r) => r[0] !== "합계").map((r) => [r[1], r[2], +r[6]]);
  A.extraDvt.periods = [["11/18 ~ 11/30", "연동 장애 해소, 환경 정상화, E2E 진입 대응", 5.0], ["12/01 ~ 12/31", "잔여 기능 수정, 외부 연동시험, E2E 병행 대응", 10.0], ["2027.01.01 ~ 01.29", "잔여 N/T 해소, 결함 수정, 최종 회귀시험", 10.0]];
  A.extraDvt.result = { head: ["영역", "전체 TC", "Pass", "Fail", "NT", "Pass 비율"], rows: X.apxNew.m11.rows.map((r) => r.slice()) };
  A.extraDvt.resultNotes = ["DVT 통합 결과 11.20 개발 PM 확인 집계. 이전 집계(11.17, 968 TC)의 NT 352건 → 334건으로 감소", "CCW 236건은 CTI 미연동으로 전량 NT"];
  A.extraDvt.notes = ["월 MM = 해당 월 실제 대응 예상 인원 기준(11월은 11/18 이후 잔여 기간)", "DVT 종료 시점은 TMC 측 선행 조건 해소에 따라 2026년 12월 말 또는 2027년 1월 말로 확정 — 12월 말 종료 시 15.00 MM(11월 5 + 12월 10)", "uCUBE(LGU+ 연계)는 별도 협의로 본 산정에서 제외"];
  A.extraDvt.source = "출처: DVT · E2E 운영방안 보고(2026.11.21), CCB 자료 2026.11.18 p.21 갱신본";
  if (A.extraDvt.issues) A.extraDvt.issues = X.deck.blk.cards.map((c) => [c.no + " " + c.h, c.who, c.fact.replace(/\n/g, " ") + ". " + c.note]);
  if (A.extraDvt.schedule) A.extraDvt.schedule = { head: X.deck.blk.doneHead, rows: X.deck.blk.doneRows };

  /* ── 2. Item2 데이터: 옵션(A · B · C) · 조건부 승인 문구 제거, 진행 기조로 통일 ── */
  const DK = X.deck, EV = DK.ev;
  X.src.pm1118 = { t: "(11/18) PM 정례회의", u: "https://toyotasystem.atlassian.net/wiki/spaces/GSP/pages/1147404487" };
  const keepEv = ["status", "vdp", "hu", "cause", "e2e1", "e2e2", "blk", "e2e11", "c3", "t1113", "t1116", "t1117", "t1123", "deadline"];
  Object.keys(EV).forEach((k) => { if (keepEv.indexOf(k) < 0) delete EV[k]; });
  EV.e2e11.apx = "apx-pre";
  EV.deadline = { kicker: "근거 · 12월 점검", title: "12/30 = Kensho E2E 회귀 테스트 종료일 · DVT 종료 시점 점검", facts: ["Kensho E2E 회귀 테스트 종료일(E2E 세부일정상 e-Care E2E 종료일 12/30)", "12월 중 TMC 측 선행 조건(HU/MM · VDP 서버 · ACOS API) 해소 현황을 점검해 DVT 종료를 12월 말로 할지 1월 말로 할지 확정", "해소되지 않은 항목은 Fail · NT 상태 그대로 기록하고 일정 조율을 통해 지속 관리"], src: ["sch"], apx: "apx-plan" };
  EV.t1116.apx = "apx-plan";
  EV.e2e1.facts = EV.e2e1.facts.filter((t) => !/마지노선/.test(t)).concat(["12/30 회귀 테스트 종료 시점에 DVT 잔여 이슈 해소 현황을 함께 점검"]);
  EV.e2e2.facts = EV.e2e2.facts.filter((t) => !/대체 수단/.test(t));
  EV.end = { kicker: "근거 · DVT 종료 시점", title: "12월 말 vs 1월 말 — TMC 선행 조건 해소 시점에 달림", facts: ["12월 말 종료: 11월 중 TMC 측 주요 선행 조건 해소가 필요하고 개발 · QA 집중 병렬 투입 필요 — 현실적으로 어려움, 조건부 단축 협의 필요", "1월 말 종료: 12월 중 단계적 해소를 전제로 단계별 투입 · 반복 검증 — 현실적인 일정", "필요 인력(청구): 12월 말 종료 시 15.00 MM(11월 5 + 12월 10), 1월 말 종료 시 25.00 MM(+ 1월 10)", "본사 API 사양 변경 · Pre-PROD 반영이 2027년 2월 이후 확정되면 별도 일정 · 공수로 관리하거나 종료 기준 재협의"], src: ["ccb1118"], apx: "apx-man" };
  EV.reg = { kicker: "근거 · 회귀 테스트", title: "회귀 테스트는 TMC 환경 구성이 선결되어야 가능", facts: ["11/18 PM 회의: 회귀 테스트 Procedure는 TMC 제공 필요, 11월 말 제공 예상", "실제 수행은 1월로 넘어갈 가능성 검토", "Next Action: LG전자 담당자와 DCM Update 지원 가능 여부 · Update 파일 및 일정 확인, Regression Procedure 수신 후 Test 일정 확정", "그 전까지는 GS TC 위주 E2E와 DVT 잔여 대응을 병행"], src: ["pm1118"], apx: "apx-pre" };
  EV.p1 = { kicker: "진행 기준 1", title: "DVT 잔여 이슈 관리", facts: ["잔여 Fail 2 · NT 334건은 일정을 이유로 Pass 처리하지 않고 상태 그대로 기록", "TMC · TMKR 측 선행 조건이 해소되는 대로 해당 TC를 재수행 — 일정은 주간 단위로 조율", "결함은 개발사가 수정 · 재시험"], src: ["r3", "pm1111"], apx: "apx-total" };
  EV.p2 = { kicker: "진행 기준 2", title: "E2E 병행 수행", facts: ["E2E는 DVT 잔여 대응과 병행", "VDP 서버 영향이 없는 GS TC 위주로 Kensho E2E를 DVT와 병행 수행", "회귀 테스트는 TMC 환경 구성(Procedure · DCM Update)이 선결되어야 가능 — Procedure 11월 말 제공 예상, 수행은 1월 가능성 (11/18 PM 회의)", "11/03 PM 합의: 시험 가능 범위를 세분화해 시작부터 NT가 예상되는 TC를 최소화"], src: ["pm1103", "sch", "pre"], apx: "apx-pre" };
  EV.p3 = { kicker: "진행 기준 3", title: "외부 선행 조건 해소가 DVT 종료를 결정", facts: ["TMC: HU(MM) 업데이트 후 테스트, VDP 서버 정상화, ACOS API(TSC-GC/GB) 사양 확정", "TMKR: CTI 27CY SU#2 전용 연계환경, DMS 실데이터", "11월 중 해소 → 12월 말 종료 가능 / 12월 중 단계적 해소 → 1월 말 종료"], src: ["pm1103", "pre", "ccb1118"], apx: "apx-cause" };
  EV.p4 = { kicker: "진행 기준 4", title: "범위 변경", facts: ["DMS · ACOS API 등 사양 변경은 TC 문서 기준으로 신규 · 재수행 범위를 확정", "변경분은 근거(메일 · 회의록 · 사양서) 기준으로 별도 협의"], src: ["pm1111"], apx: "apx-man" };
  EV.p5 = { kicker: "진행 기준 5", title: "인력 운영과 청구", facts: ["대기 · 운영 인력은 모듈 담당자 중심 월 15명 내외로 유지, 유휴분은 수행사 부담", "청구는 실제 대응분 월 10 MM(11월 5 MM)으로 한정", "DVT 종료 시점 확정에 따라 1월분(10 MM)을 조정"], src: ["ccb1118"], apx: "apx-man" };

  DK.s1.kicker = "Item2 · 현황과 진행 기조";
  DK.s1.title = "DVT 잔여 이슈는 일정 조율을 통해 지속 관리하고, E2E는 병행 수행함. 초반 E2E는 GS TC 위주로 진행하며, 이를 위한 개발 인력 유지(월 10 MM)가 필요함";
  DK.s1.kpis[3] = { k: "dv:end", small: "추가 인력 (11/18 ~ 종료 시점)", v: "15 ~ 25", em: "MM", d: "12월 말 종료 15.00 · 1월 말 종료 25.00 (TMC 해소에 따름)", hot: true };
  DK.s1.cols[2] = { tag: "Plan · 진행 기조", head: "잔여 이슈는 일정 조율로 지속 관리, E2E는 GS TC 위주로 병행 수행함", body: "VDP 서버 영향으로 e-Care E2E는 진행이 불가하여 초반 E2E는 GS TC 위주로 진행함. DVT를 언제 끝낼 수 있는지(12월 말 또는 1월 말)는 TMC 측 선행 조건 해소에 달려 있으며, 그때까지 대기 · 운영 15명 내외, 청구 월 10 MM이 필요함.", ev: "ev:end", more: "종료 시점 근거" };
  DK.s1.ask = "요청 사항: ① DVT 잔여 이슈는 일정 조율을 통해 지속 관리 ② E2E는 GS TC 위주로 병행 수행(e-Care는 VDP 서버 정상화 후) ③ 11/18 이후 개발 인력 월 10 MM(11월 5 MM) 인정 — 12월 말 종료 시 15.00 MM, 1월 말 종료 시 25.00 MM";
  DK.blk.kicker = "Item2 · 잔여 이슈와 DVT 종료 시점";
  DK.blk.title = "잔여 이슈 5건은 TMC · TMKR 측 선행 조건이 풀려야 해소되며, 해소 시점이 DVT 종료(12월 말 또는 1월 말)를 결정함";
  DK.blk.doneTitle = "DVT 종료 시점: 12월 말 vs 1월 말 (TMC 측 선행 조건 해소에 따름)";
  // Critical Blocker 현재 상태 (11/18 PM 정례회의록 기준 더블체크)
  DK.blk.lede = "① MM Capable Flag는 11/18 정상화되어 재수행 중이고, ② ~ ⑤는 TMC · TMKR 측 선행 조건이 아직 풀리지 않았습니다 (11/18 PM 정례회의록 · 11/20 개발 PM 확인 집계 기준).";
  const st = { "①": ["ok", "11/18 해소 · 재수행 결과 확인 중"], "②": ["no", "미해소 · Fail 1 · NT 2 (11/20)"], "③": ["no", "미해소 · 12월 시험 진입"], "④": ["no", "미해소 · TC Merge 중"], "⑤": ["no", "미해소 · 일정 대기"] };
  DK.blk.cards.forEach((c) => { if (st[c.no]) c.st = st[c.no]; });
  DK.blk.cards[0].fact = "11/18 MM Capable Flag 정상화\n(27CY MM Flag 4개 수신)";
  DK.blk.cards[0].note = "HU 마지막 단계 재수행 · DCM 2644 FW 재적용 후 정상. 원인은 미확인(TMC 분석 요청). Provisioning · N/T 39건 재수행 결과 미확인";
  DK.blk.cards[1].fact = "24 TC 중 Pass 21 · Fail 1 · NT 2\n(11/20 개발 PM 확인, 11/18 Fail 4 → 1)";
  DK.ev.blk.facts[0] = "① MM/HU · ACOS Provisioning (TMC): 11/18 오전 27CY MM Flag 4개 정상 수신으로 Capable Flag 정상화. HU 마지막 단계 재수행 · DCM 2644 FW 재적용 · ADF 재수행 후 결과가 바뀌었고 개발 수정은 없어 원인은 미확인 → 실패 · 성공 HU Log로 TMC 분석 요청. Provisioning → 요금제 TC → N/T 39건 금주 재수행 예정";
  DK.ev.hu.title = "HU(MM) · Capable Flag — 11/18 정상화 (원인 미확인)";
  DK.ev.hu.facts = ["11/13 · 11/15: HU 업데이트 Tier1 ①의 9단계(성공 여부 확인)에서 중단, 성공 확인 파일 미생성 (5회 시도)", "11/18 오전: HU 마지막 처리 단계 재수행 · DCM 2644 FW 재적용 · ADF 재수행 → HU ID 정상 전달, Capable Flag 조회 시 27CY MM Flag 4개 정상 수신", "LGU+ · 다산 개발 영역의 별도 수정 없이 같은 환경에서 결과가 바뀜 → 원인 미확인, 실패 · 성공 HU Log와 재처리 절차를 TMC Backlog로 분석 요청", "후속: Capable Flag 재확인 → MM Provisioning → 요금제 TC → 기존 N/T 39건 재수행 (금주 목표, 11/19 이후 결과는 Confluence · Jira에 아직 없음)", "E2E 환경: HU + DCM 1세트 FW Update · 장비 연결 완료(11/18), 추가 Test Set 확보는 확인 필요"];
  if (DK.ev.status) DK.ev.status.facts.unshift("출처: 11/20 개발 PM 확인 집계표 (부록 E4 원문 링크)");
  if (DK.ev.vdp) DK.ev.vdp.facts[0] = "11/20 개발 PM 확인 집계: VDP(Diag) 24 TC 중 Pass 21 · Fail 1 · NT 2 (11/18 PM 회의록 시점 잔여 Fail 4건에서 감소)";
  if (X.apxNew.m11) { X.apxNew.m11.title = "DVT 통합 결과 (11/20 개발 PM 확인 집계, 992 TC)"; }
  const blkDates = {
    id: "blk-dates", code: "E4", title: "Critical Blocker · 주요 이슈별 해결 일자와 현재 상태 (11/21 확인)",
    message: "이슈마다 언제 생겼고, 언제 풀렸는지(또는 어디까지 진행됐는지), 지금 상태가 어떤지를 근거 문서와 함께 정리함. ★는 Item2 ② 잔여 이슈 5건(Critical Blocker).",
    head: ["이슈", "담당", "발생", "해결 · 진행 일자", "현재 상태", "근거"],
    rows: [
      ["★ MM Capable Flag 미반환 (ACOS Provisioning)", "TMC", "10월 TSC-GC Migration 후 Capable Partial 응답, 11월 초 MM Flag 미반환", "ok|11/18 오전 해소 — 27CY MM Flag 4개 정상 수신", "원인 미확인(동일 FW에서 결과 변화) → TMC 분석 요청. Provisioning → 요금제 TC → N/T 39건 금주 재수행 예정, 결과 미확인", "11/18 PM 회의록 · Backlog PRJ_0333-55 · 46"],
      ["★ HU SW SU#1 · SubMCU 업데이트", "TMC", "11/03 FW 미수령, 11/11 SU#1 확인, 11/13 · 15 업데이트 성공 확인 단계에서 중단", "ok|11/18 — HU 마지막 단계 재수행 · DCM 2644 FW 재적용 · ADF 재수행, HU ID 정상 전달", "E2E 환경 1세트 FW Update · 연결 완료. 추가 Test Set 확보 여부 확인 필요", "11/18 PM 회의록 · 11/13 보고 · Backlog PRJ_0333-40"],
      ["MM Opt-in/out 오류", "TMC", "Capable 미활성 시 Opt-in 불가 (11/11)", "part|11/18 Capable 정상화로 선행 조건 확보", "Flag 조합별 Opt-in/out 검증 결과 미확인", "E2E 사전준비 · PRJ_0333-55"],
      ["★ VDP Diag 연동", "TMC", "10/06 접속 9건 전건 Timeout", "part|10/26 /v1 정정 → 10/27 네트워크 접속 → 11/13 첫 API 호출", "미해소 — 11/20 개발 PM 확인 집계 24 TC 중 Pass 21 · Fail 1 · NT 2 (11/18 회의록 시점 잔여 Fail 4건에서 감소). e-Care E2E 12/14 ~ 12/30 계획, VDP 오류 시 시뮬레이터로 KR 영역만 시험", "11/20 개발 PM 확인 집계 · 11/18 PM 회의록 · E2E 세부일정(11/17)"],
      ["VDP CoCo", "TMC", "10/06 Timeout", "part|11/11 이전 연결 테스트 완료", "Callback 검증 중", "E2E 사전준비 이슈 3"],
      ["★ CTI/TCK 중계 (CCW 236 TC)", "TMKR · TCK", "10/28 대체안 철회, 정식 개발 착수", "no|미해소 · 확정일 없음", "11/11 기준 개발 최대 3주, 고객센터 연계 시나리오(eCall · e-Care)는 12월 시험 진입. 11/18 회의록에 갱신 없음", "E2E 사전준비 #10 · 10/28 · 11/03 PM 회의록"],
      ["★ DMS 사양 변경", "TMKR", "10/21 요구 지속 유입, 10/23 범위 Freeze 합의", "part|API 5 → 24개 반영 중", "DMS 114 TC 중 Pass 78 · Fail 1 · NT 35. 11/18: DMS 최종 변경분 E2E TC Merge 필요", "E2E 사전준비 #9 · 11/18 PM 회의록"],
      ["★ ACOS API 사양 (TSC-GC/GB)", "TMC", "10/15 Notify API 변경, 10월 Upsert 정책 재변경", "part|변경 반영 · 재검증 완료", "미동작 버전 6개 정리 필요, Redoc · Pre-PROD 반영 일정에 따라 추가 개발 가능", "E2E 사전준비 #6"],
      ["GSA · Auth0 DeepLink 흰 화면", "TMC", "11/06 TMC 원인 인정", "no|미해소 · TMC 일정 대기", "GS 시나리오 안 DeepLink 중심 시험, One ID · Auth0 일정 영향 확인 필요(11/18)", "11/18 PM 회의록 · E2E 사전준비 #14 · 17"],
      ["DTC 재현 방법 (CANoe)", "TMC", "10/21 CANoe 파일 요청", "no|미해소 · 미정", "TMC가 유형별 코드 발생 필요", "E2E 사전준비 #5 · Backlog PRJ_0333-54"],
      ["uCube 해지", "LGU+", "—", "part|가입 Flow는 정상", "해지 관련 잔여 이슈 재시험 예정 (청구 제외 항목)", "11/18 PM 회의록"],
    ],
    foot: "확인 범위: Confluence GSP 스페이스(최신 11/18 PM 정례회의록, 11/19 수정)와 Jira를 11/21에 다시 확인함. DVT 통합 수치(992 TC · 영역별)는 11/20 개발 PM 확인 집계표 기준. Provisioning · N/T 39건 재수행 결과는 Confluence · Jira에 아직 올라와 있지 않아 미확인. TMC Backlog(PRJ_0333-*)는 접근할 수 없어 번호만 표기.",
    src: [["https://toyotasystem.atlassian.net/wiki/spaces/GSP/pages/1147404487", "11/18 PM 정례회의록", 1], ["https://toyotasystem.atlassian.net/wiki/spaces/GSP/pages/1133608962", "E2E 사전준비 (이슈 목록)", 1], ["https://toyotasystem.atlassian.net/wiki/spaces/GSP/pages/1121320967", "E2E 세부일정", 1], ["ev/dvt-result-1120.png", "DVT 통합 결과 집계표 (11/20 개발 PM 확인)", 1]],
  };
  DK.blk.doneRows = DK.blk.doneRows.concat([["필요 인력 (청구)", "15.00 MM (11월 5 + 12월 10)", "25.00 MM (11월 5 + 12월 10 + 1월 10)"]]);
  DK.man.kicker = "Item2 · 추가 인력 산정";
  DK.man.cards[1].d = "실제 대응분 · ACOS 인력안 T2사 검토 중";
  DK.man.lede = "개발 조직은 15명 내외로 확보 · 대응하되 유휴 확보분은 LGU+가 부담하고, 실제 대응 예상분 11월 5 · 12월 10 · 1월 10 MM에 해당하는 부분에 대해 인정 요청 드립니다."; /* 화면 편집(i2-man 리드) 문구를 원본에 반영 */
  DK.man.bullets.push("월 10 MM 산정분 중 ACOS 인력 활용안은 현재 T2사에서 검토 중이며, 검토 결과가 확정되는 대로 반영합니다.");
  DK.man.title = "DVT 개발 인력 유지 · 예측 공수 25.00 MM (11.18 ~ 2027.01.29, 1월 말 종료 기준)";
  DK.man.foot += ". 12월 말 종료로 확정되면 1월분 10.0 MM을 제외한 15.00 MM";
  DK.plan = {
    kicker: "Item2 · 현황 · 진행 계획",
    title: "E2E는 11/23 GS TC 위주로 병행 착수하고, DVT 잔여 이슈는 TMC 측 선행 조건 해소에 맞춰 12월 말 또는 1월 말까지 지속 관리함",
    lede: "DVT 잔여 이슈(Fail 2 · NT 334)는 TMC · TMKR 측 선행 조건이 풀리는 순서대로 재수행하고, Kensho E2E는 GS TC 위주로 병행함. 12월 중 해소 현황을 점검해 종료 시점(12월 말 · 1월 말)을 확정함. 점선은 미확정 구간임.",
    premHead: ["#", "기준", "내용", "달라지면"],
    prem: [
      ["1", "DVT 잔여 이슈 관리", "잔여 Fail 2 · NT 334건은 상태 그대로 기록, 선행 조건이 해소되는 대로 재수행 (주간 일정 조율)", "종료 시점 재협의"],
      ["2", "Kensho E2E 병행", "11/23 착수, GS TC 위주로 DVT와 병행. 회귀 테스트는 TMC 환경 구성(Procedure · DCM Update) 선결 후 수행", "E2E 일정 재조정"],
      ["3", "외부 선행 조건", "TMC: VDP 서버 · ACOS API · 회귀 테스트 환경 / TMKR: CTI 연계환경 · DMS 실데이터 (HU(MM)은 11/18 해소)", "해소 시점에 따라 12월 말 ↔ 1월 말"],
      ["4", "범위 변경", "사양 변경은 TC 문서 기준으로 신규 · 재수행 범위 확정", "근거 기준 별도 협의"],
      ["5", "인력 · 청구", "대기 · 운영 15명 내외, 청구 월 10 MM(11월 5 MM), 유휴분 수행사 부담", "종료 시점에 맞춰 1월분 조정"],
    ],
    premEv: ["dv:p1", "dv:p2", "dv:p3", "dv:p4", "dv:p5"],
    tracks: [
      { h: "DVT 대응 · 잔여 이슈 지속 관리", b: "잔여 Fail · NT는 상태 그대로 기록하고, 위 선행 조건이 풀리는 대로 해당 TC를 재수행 (주간 일정 조율). 해소가 늦어지면 1월 말까지", ev: "dv:p1" },
      { h: "Kensho E2E · GS TC 위주, DVT와 병행 (11/23 ~ 12/30)", b: "VDP 서버 영향이 없는 GS TC 위주로 DVT 잔여 대응과 병행 수행. ACOS IF 기반 TC 포함", ev: "dv:e2e1" },
      { h: "회귀 테스트 · TMC 환경 구성 선결 시 가능", b: "TMC Procedure 제공(11월 말 예상)과 DCM Update 지원이 먼저 확보되어야 수행 가능. 실제 수행은 1월로 넘어갈 가능성 검토 중(11/18 PM 회의)", ev: "dv:reg" },
    ],
  };
  EV.prem = { kicker: "진행 기준", title: "진행 기준 5가지와 달라질 때의 영향", facts: DK.plan.prem.map((r) => r[0] + ". " + r[1] + " — " + r[2] + " (달라지면: " + r[3] + ")"), src: ["pm1111", "pm1118"], apx: "apx-man" };
  DK.tl = {
    start: [2026, 11, 16], days: 77,
    marks: [
      { d: [2026, 11, 17], l: "11/17 DVT 3차 종료", ev: "dv:t1117" },
      { d: [2026, 11, 23], l: "11/23 E2E 착수", ev: "dv:t1123", lo: 1 },
      { d: [2026, 12, 30], l: "12/30 종료 시점 점검", ev: "dv:deadline", dead: true },
      { d: [2027, 1, 29], l: "1/29", ev: "dv:end", lo: 1 },
    ],
    lanes: [
      { h: "DVT 대응", sub: "잔여 이슈 지속 관리", bars: [
        { a: [2026, 11, 18], b: [2026, 12, 31], t: "dvt", l: "잔여 이슈 지속 관리 · 선행 조건 해소분 재수행", ev: "dv:p1" },
        { a: [2027, 1, 1], b: [2027, 1, 29], t: "cond", dash: true, l: "TMC 해소 지연 시 1월 말까지", ev: "dv:end" },
      ] },
      { h: "Kensho E2E", sub: "GS TC 위주 · DVT 병행", bars: [
        { a: [2026, 11, 23], b: [2026, 12, 30], t: "e2e", l: "GS TC 위주 · DVT와 병행 (ACOS IF 포함)", ev: "dv:e2e1" },
        { a: [2026, 12, 1], b: [2027, 1, 29], t: "late", dash: true, l: "회귀 테스트 · TMC 환경 구성 선결 시 (1월 가능성)", ev: "dv:reg" },
      ] },
    ],
    pre: [
      { o: "TMC", h: "VDP 서버 (Diag · CoCo)", st: "no", s: "미해소 · 24 TC 중 Fail 1 · NT 2 (11/20)", u: "DVT VDP 재수행", ev: "dv:vdp" },
      { o: "TMC", h: "ACOS API 사양 (TSC-GC/GB)", st: "part", s: "변경 반영 · 미동작 버전 6개 정리 필요", u: "E2E ACOS IF TC", ev: "dv:blk" },
      { o: "TMC", h: "회귀 테스트 환경 구성", st: "no", s: "Procedure 11월 말 제공 예상 · DCM Update 지원 확인 중", u: "회귀 테스트", ev: "dv:reg" },
      { o: "TMKR", h: "CTI/TCK 연계환경", st: "no", s: "미해소 · 개발 최대 3주, 12월 시험 진입", u: "CCW 236 TC", ev: "dv:blk" },
      { o: "TMKR", h: "DMS 사양 · 실데이터", st: "part", s: "API 5 → 24개 반영 중 · NT 35", u: "DMS 재수행", ev: "dv:blk" },
      { o: "TMC", h: "HU(MM) · MM Capable Flag", st: "ok", s: "11/18 해소 · 재수행 결과 확인 중", u: "Provisioning · N/T 39건", ev: "dv:hu" },
    ],
    notes: ["DVT 잔여 이슈는 일정 조율을 통해 지속 관리하고 E2E는 병행 수행 (A · B 대안 비교 없이 단일 진행 기조)", "12월 중 TMC 측 선행 조건 해소 현황을 점검해 DVT 종료를 12월 말 또는 1월 말로 확정"],
  };
  // 부록: 조건부 승인 · Gate · 대안 비교 · 내부 논의 요약 제외, 공수 전제를 진행 기준으로 교체
  X.apxNew.m4 = { id: "apx-man", code: "", title: "Item2 추가 인력 산정과 진행 기준", message: "11.18 이후 DVT 잔여 대응과 E2E 병행에 필요한 개발 인력 산정임. 종료 시점(12월 말 / 1월 말)에 따라 1월분을 조정함.",
    head: ["#", "기준", "내용", "달라지면", "공수 연계"],
    rows: [
      ["1", "DVT 잔여 이슈 관리", "잔여 Fail · NT는 상태 그대로 기록, 선행 조건 해소 시 재수행", "종료 시점 재협의", "잔여 N/T 재수행 · 회귀시험 2.60"],
      ["2", "Kensho E2E 병행", "11/23 착수, GS TC 위주로 DVT와 병행. 회귀 테스트는 TMC 환경 구성 선결 후", "E2E 일정 재조정", "E2E 대응은 영역별 담당자 내 수행"],
      ["3", "외부 선행 조건", "TMC: HU(MM) · VDP 서버 · ACOS API / TMKR: CTI · DMS", "12월 말 ↔ 1월 말", "VDP 6.80 · ACOS 5.70 · 외부시스템 9.90"],
      ["4", "범위 변경", "TC 문서 기준 신규 · 재수행 범위 확정", "근거 기준 별도 협의", "산정 제외"],
      ["5", "인력 · 청구", "대기 · 운영 15명 내외, 청구 월 10 MM(11월 5 MM)", "1월분 10.0 조정", "12월 말 종료 15.00 · 1월 말 종료 25.00"],
    ] };
  ["m1", "m2", "m3", "m5"].forEach((k) => { delete X.apxNew[k]; });

  /* ── MECE 정리 (11/21): A2(B1과 같은 표) · A15(Item2 ② · D2 · E4 · D1과 중복)는 부록 페이지에서 제외하고 참조를 옮김 ── */
  (function deepFix(o) {
    const fix = (t) => t.replace("추가 DVT 예측(A15)에서 관리", "Item2 추가 인력(D2)에서 관리").replace("상세는 A15 참조", "최신 통합 결과(11/20 개발 PM 확인)는 D1 참조").replace("LGU+ 부담 0.95 · 2.00", "LGU+ 부담 0.95").replace("uCUBE 0.95 · 2.00 MM은", "uCUBE 0.95 MM은");
    Object.keys(o).forEach((k) => { const v = o[k]; if (typeof v === "string") o[k] = fix(v); else if (v && typeof v === "object") deepFix(v); });
  })(A);
  A.dvtRun.result.rows = A.dvtRun.result.rows.filter((r) => !/\(11\/17\)/.test(r[0]));
  A.dvtRun.result.notes = A.dvtRun.result.notes.map((t) => /^11\.17 기준 3개 구분 합계/.test(t) ? "11/17 이후 결과는 D1 DVT 통합 결과(11/20 개발 PM 확인, 992 TC)로 일원화" : t);
  base.summary.principle.items.forEach((it) => { it.v = it.v.replace(/예측 공수 24\.95 MM/, "예측 공수 25.00 MM(Item2)").replace(/, 추가 DVT 26\.95 MM\)/, ")").replace("uCUBE 대응분(0.95 · 2.00 MM)", "uCUBE 대응분(0.95 MM)"); });

  /* ── 3. 통합 장표 본문 (M) ── */
  const M = {
    overview: {
      title: "Item1 ACOS · VDP 지연에 따른 추가 개발 22.06 MM과 Item2 DVT 개발 인력 유지의 공수 인정을 요청드립니다",
      lede: "Item1은 지난 협의에서 산정 프레임에 합의한 건으로, 이번에 프레임을 다시 정리하고 항목별 지연 사유와 증적을 붙였습니다. Item2는 최신 DVT 평가 결과 잔여 이슈 해소와 E2E 병행에 인력이 더 필요한 건입니다.",
      i1: {
        tag: "Item1", h: "ACOS · VDP 지연에 따른 추가 개발", chip: "프레임 합의 · 증적 보완", total: "22.06",
        parts: [
          { v: "3.86", l: "① e-Care 콜버튼", d: "TMKR 신규 요청 · 수행 예정" },
          { v: "8.10", l: "② ACOS 규격 변경 추가 개발", d: "07.28 ~ 09.30 · 수행 완료" },
          { v: "10.10", l: "③ DVT 기간 변경 · 연동 대응", d: "10.01 ~ 11.17 · 수행 완료" },
        ],
        pts: [
          ["왜", "ACOS 최종 규격이 07.27에야 확정되어(06.28 24개 · 07.27 9개 API 변경) 8 ~ 9월 DVT 인력이 변경 개발에 투입됐고, TMC의 VDP · PGM 서버 · 환경 지연으로 10 ~ 11월 변경 · 연동 대응이 추가로 발생했습니다."],
          ["청구 기준", "10 ~ 11월 신규 투입 29.00 MM 중 DVT 시험 · 결함 대응 17.95는 인지만 요청하고, uCUBE 0.95(LGU+ 부담)를 뺀 변경 · 연동 대응 10.10만 청구합니다."],
          ["증적", "고객사 요청 5개 항목별로 제출 자료와 위치를 정리했습니다. 개발자별 상세 · GitHub 이력은 개발사 확인 후 보완합니다."],
        ],
        go: [["i1-why", "지연 사유 · 증적"], ["i1-mm", "공수 산출 (10.10 산식)"], ["late-notice", "제출이 늦어진 경위"]],
      },
      i2: {
        tag: "Item2", h: "DVT 개발 인력 유지", chip: "최신 평가 반영 · 992 TC", total: "25.00",
        kpi: [["656", "/ 992 TC Pass", "66.1%"], ["334", "잔여 NT", "Fail 2 · CCW 236 포함"], ["GS TC", "Kensho E2E 위주", "DVT와 병행 · 11/23 착수"]],
        stance: "DVT 잔여 이슈는 일정 조율을 통해 지속 관리하고, E2E는 병행 수행합니다. 초반 E2E는 GS TC 위주로 진행합니다.",
        end: [
          { k: "12월 말 종료", c: "11월 중 TMC 측 주요 선행 조건 해소 시", mm: "15.00", d: "11월 5 + 12월 10" },
          { k: "1월 말 종료", c: "12월 중 단계적 해소 시 (현실적 일정)", mm: "25.00", d: "11월 5 + 12월 10 + 1월 10", hot: true },
        ],
        endNote: "DVT를 언제까지 해야 하는지는 TMC 측 선행 조건(HU/MM · VDP 서버 · ACOS API) 해소에 달려 있어, 12월 중 점검해 확정합니다.",
        go: [["i2-plan", "현황 · 진행 계획"], ["i2-man", "추가 인력"], ["blk-dates", "이슈별 해결 일자 (E4)"]],
      },
      ask: "요청: ① Item1 22.06 MM(콜버튼 3.86 + ACOS 8.10 + DVT 변경 · 연동 10.10) 인정 ② Item2 11/18 이후 개발 인력 월 10 MM(11월 5 MM) 인정 — DVT 종료 시점에 따라 15.00 ~ 25.00 MM",
    },
    // 고객사 증적 요청(메일) 5개 항목 대응
    evreq: {
      id: "evreq", code: "E1", title: "고객사 증적 요청 5개 항목 대응표",
      message: "고객사가 요청한 증적 5개 항목마다 이 장표에서 바로 볼 수 있는 자료와 아직 보완 중인 자료를 구분함. 자료 이름을 누르면 해당 부록으로 이동함.",
      rows: [
        { no: "1", ask: "전체 프로젝트별(GS / ACOS / 마이그레이션) 개발 인력 투입 실적", st: "part",
          have: [["sheet", "B1 월별 투입 공수 표 (GS · e-Care, 계획 vs 실제)"], ["dvt-effort", "A6 10 ~ 11월 업무 영역별 공수 (ACOS Core/Interface · Provisioning/PGM · DB/Migration · e-Care · Global South · Digital Key · Global App · 통합 Defect)"]],
          todo: "8 ~ 9월분의 ACOS · 마이그레이션 구분 집계는 개발사 자료 수령 후 보완" },
        { no: "2", ask: "월별 / 프로젝트별 / 개발자별 투입 공수(MM)", st: "part",
          have: [["sheet", "B1 월별 · 과제별 투입 공수 (8 ~ 11월)"], ["dvt-staff", "A11 DVT 투입 인력 23명 구성 (개발 16 · QA 5 · PM · 기획 2)과 월별 공수"]],
          todo: "개발자별 월 MM은 개발사 집계 중 — 전달 가능 일정은 월요일 회신" },
        { no: "3", ask: "최초 계획 대비 실제 투입 공수 및 추가 투입 내역", st: "done",
          have: [["i1-mm", "Item1 ② 공수 산출 (계약 48.2 → 실제 85.3 MM, 순증 37.10 중 청구 18.20)"], ["sheet", "B1 월별 투입 공수 표 (숫자별 계획 업무 · 실제 수행 업무)"], ["chg-plan", "A16 항목별 예정 vs 실제와 공수"]],
          todo: "" },
        { no: "4", ask: "추가 투입 8.10 MM / 11.05 MM(청구 10.10)의 개발자별 투입 현황", st: "part",
          have: [["chgdev", "A4 8.10 MM: 변경 개발 12개 항목별 공수 (162 MD)"], ["dvt-chg", "A13 11.05 MM: 영역 10개별 공수 · 세부 항목 (uCUBE 0.95 제외 시 10.10)"], ["dvt-staff", "A11 영역별 담당 개발 인력 (ENG1 ~ 15)"]],
          todo: "항목 × 개발자 매핑(개발자별 MD)은 개발사 확인 후 월요일 일정 회신" },
        { no: "5", ask: "실제 투입 내역 증빙 (GitHub Commit, PR 등)", st: "todo",
          have: [["delay-ev", "E2 항목별 지연 사유 · 증적 (Jira CHGE-21, PM 정례회의록, 규격 배포 · 변경 이력, 시험 기록)"], ["dvt-run", "A10 DVT 수행 실적 (일별 시험 · 결함 대응 Worklog)"]],
          todo: "GitHub Commit · PR 이력은 저장소 접근 범위를 개발사와 확인한 후 별도 회신" },
      ],
      foot: "11.05 MM은 다산 투입 기준이며, 그중 uCUBE 0.95 MM은 LGU+ 부담으로 고객사 청구는 10.10 MM임",
    },
    // 고객사 문의: ACOS · VDP 건은 왜 늦게 알렸나
    late: {
      id: "late-notice", code: "E3", title: "고객사 문의 답변: ACOS · VDP 건 공수 제출이 늦어진 경위",
      message: "추가 공수가 생긴다는 사실은 07.21 PM 정례회의부터 고객사 담당자께 공유했으나, 공수를 확정해 제출하기까지 시간이 걸렸음. 그 사정과 근거를 정리함.",
      q: "ACOS · VDP 지연에 따른 추가 공수를 왜 이렇게 늦게 알렸습니까?",
      lead: "추가 공수가 발생한다는 사실은 07.21 PM 정례회의에서 CCB 등재와 함께 고객사 담당자께 처음 공유드렸고, 이후 정례회의마다 진행 상황을 말씀드렸습니다. 다만 공수를 확정해 제출하기까지는 아래와 같은 사정으로 시간이 걸렸습니다.",
      reasons: [
        { h: "발생 사실은 07.21부터 정례회의에서 공유", t: "규격 확정 지연과 추가 공수 발생은 07.14 · 07.21 정례회의에서 공유했고, 07.29에는 Global South 영향도 약 60%를 말씀드리며 비용 논의는 공수 산정이 끝난 뒤 하기로 했습니다.",
          ev: [["07.14", "스펙 확정 지연으로 개발 7월 말 → 8월 말, DVT 8월 → 9월 조정 공유"], ["07.21", "추가 공수 발생 건 CCB 등재 (CHGE-21)"], ["07.29", "Global South 영향도 약 60% 공유, 비용 논의는 공수 산정 완료 후로 합의"], ["09.30", "DVT 일정 시프트를 변경 관리 후보 항목으로 공유"]] },
        { h: "개발사 초기 공수가 과다해 LGU+ 내부 조율이 필요", t: "개발사가 처음 산정한 공수에는 변경과 직접 관련 없는 투입까지 섞여 있어 그대로 청구할 수 없었습니다. LGU+가 월별 계획 대비 실제 투입과 수행 업무를 하나씩 대조해 실제 추가분만 남기는 재정리를 거쳤습니다.",
          ev: [["10.21", "실제 개발자 투입 수준까지 확인해 산정 근거를 작성하기로 함"], ["11.03", "월별 계획 vs 실제 투입, 지연 기간 수행 업무 기준으로 재정리하기로 함"], ["11.19", "10 ~ 11월 신규 투입 29.00 MM 중 DVT 시험 · 결함 17.95 MM은 인지만 하고 청구 제외, uCUBE 0.95 MM은 LGU+ 부담 → 청구 10.10 MM"]] },
        { h: "e-Care 콜버튼과 달리 개발이 계속 진행 중인 과제", t: "콜버튼은 범위가 정해진 신규 요청이라 접수 1주 만에 공수를 제시할 수 있었습니다. 반면 ACOS · VDP 건은 진행 중인 개발 위에서 07.27 이후에도 변경이 이어져, DVT가 끝나기 전에는 범위를 확정하기 어려웠습니다.",
          ev: [["콜버튼", "08.28 요청 접수 → 09.04 1차 공수 4.30 MM 전달 → 10.13 최종 3.86 MM"], ["08.19", "07.27 이후 API 변경은 변경 건으로 이력 관리하기로 함"], ["10.15 ~ 11.13", "Notify API 변경, 10.26 Endpoint 정정, 10.28 DMS 사양 변경, 11.13 VDP Diag 첫 실연동"]] },
        { h: "TMC 환경 불확실성을 빠르게 인지하지 못함", t: "당시에는 TMC 서버 · 시험 환경이 이 정도로 늦어질지 예상하지 못해 일정 조정으로 대응했습니다. 공수 영향이 커졌다는 것은 DVT 착수 후 접속 시험이 계속 실패하면서 분명해졌습니다.",
          ev: [["08.26", "TSC · VDP · Digital Key 연동 준비 미비로 DVT 착수 재검토"], ["09.15", "TMC VDP 서버 정보 제공 지연(10.05 예정)으로 일정 조정 요청 (서면)"], ["10.06", "DVT 착수, VDP 접속 시험 9건 전건 Timeout"], ["10.26", "TMC Endpoint(/v1) 정정"]] },
      ],
      close: "어떤 사정이 있었든 공수를 더 빨리 정리해 제출하지 못한 점은 양해 부탁드립니다. 같은 일이 반복되지 않도록, 개발이 이어지는 Item2(DVT 개발 인력 유지)는 11.17 DVT 3차 종료 직후 바로 정리해 이번에 함께 제출드렸습니다. 이 점 감안해 주시면 감사하겠습니다.",
      src: [["history", "A1 경과 · 공유 이력 (PM 정례회의록)"], ["https://toyotasystem.atlassian.net/browse/CHGE-21", "Jira CHGE-21 (07.21 등재)", 1], ["callbtn", "A12 e-Care 콜버튼 산정 경과"], ["delay-ev", "E2 항목별 지연 사유 · 증적"], ["i1-mm", "Item1 ② 청구 10.10 산식"]],
      gap: "개발사가 처음 제시한 공수안(초기 산정 원본)과 LGU+ 내부 조율 기록은 장표에 없어 ②의 직접 증적이 비어 있음. 자료를 주시면 추가함.",
    },
    // 지연 사유 · 증적 (8.10 · 10.10)
    why810: {
      h: "② ACOS 규격 변경 추가 개발 8.10 MM", per: "07.28 ~ 09.30 · 수행 완료",
      flow: [["04.20", "최초 규격", "34개 API"], ["06.28", "변경 규격 배포", "24개 API 변경"], ["07.27", "최종 규격", "9개 API 추가 변경"], ["07.28 ~ 09.30", "GS · e-Care 변경 개발 · 내부 테스트", "12개 항목 162 MD"]],
      why: "계약은 TMC 규격 · 서버의 적기 제공을 전제로 했으나 최종 규격이 07.27에 확정되어 Global South 개발 범위의 약 60%를 다시 작업했습니다. DVT에 배정된 8 ~ 9월 인력이 이 변경 개발과 계획에 없던 내부 테스트를 수행했고, DVT는 10.06 ~ 11.17로 이동했습니다.",
      ev: [["spec", "A3 규격 배포 이력 · 영향 범위"], ["chgdev", "A4 변경 개발 12개 항목 (항목별 AS-IS / TO-BE · 증적 이미지)"], ["history", "A1 경과 · 공유 이력 (PM 정례회의록)"], ["https://toyotasystem.atlassian.net/browse/CHGE-21", "Jira CHGE-21 변경 관리 등록 (07.21)", 1]],
    },
    why1010: {
      h: "③ DVT 기간 변경 · 연동 대응 10.10 MM", per: "10.01 ~ 11.17 · 수행 완료",
      why: "07.27 최종 규격 이후에도 TMC가 ACOS 정책 · 응답을 다시 바꾸었고, VDP · PGM 등 TMC 서버 · 시험 환경이 DVT 착수(10.06)까지 준비되지 않아 개발자가 분석 · 수정 · 재시험에 투입되었습니다.",
      cats: [
        { k: "①", h: "ACOS 추가 변경", mm: "2.60", areas: ["ACOS API", "ACOS Provisioning"], should: "07.27 최종 규격 이후 변경 없어야 함", act: "10.15 Notify API 변경, 10월 Upsert 정책 · Capable 응답 재변경" },
        { k: "②", h: "VDP · PGM 등 TMC 서버 · 환경 지연", mm: "4.50", areas: ["VDP Diag", "VDP CoCo", "MM/HU · DCM/ADF", "Digital Key"], should: "VDP 사양 09.04 · 서버 정보 10.05, DVT 10.06 착수 전 환경", act: "10.06 접속 9건 Timeout, 10.26 Endpoint 정정, 11.13 Diag 최초 실연동" },
        { k: "③", h: "TMKR 연계 변경", mm: "2.50", areas: ["CTI/TCK", "Global/Local App", "DMS"], should: "e-Care 2차 DVT 10.21 착수 전 연계 환경", act: "10.26 전후 CTI 중계서버 분리, 10.28 DMS 사양 변경판, 11월 Auth0 불일치" },
        { k: "④", h: "DVT 영향 분석", mm: "0.50", areas: ["DVT 영향 분석"], should: "9월 초 Regression 범위 확정", act: "10.06 ~ 11.17 변경 사양에 따른 TC 예상 결과 수정 · N/T 원인 분류" },
      ],
    },
    // 산출 툴팁 (data-calc): 키 → [제목, 산식 줄들]
    calc: {
      "35.0": ["10 ~ 11월 수행 35.0 MM", ["10월 18.0 + 11월 17.0 = 35.0", "10월 18.0 = 기획 1.0 + GS 개발 4.0 + GS 품질 2.0 + e-Care 개발 9.0 + e-Care 품질 2.0", "11월 17.0 = GS 개발 4.0 + GS 품질 2.0 + e-Care 개발 9.0 + e-Care 품질 2.0", "출처: B1 월별 투입 공수 표 (실제)"]],
      "6.0": ["계약 E2E 최소 인력 6.0 MM", ["10월 2.0 + 11월 4.0 = 6.0", "10월 2.0 = Global South E2E 2.0", "11월 4.0 = Global South E2E 2.0 + e-Care E2E 2.0", "출처: B1 월별 투입 공수 표 (계약 시점 계획)"]],
      "29.00": ["10 ~ 11월 신규 투입 29.00 MM", ["35.0 − 6.0 = 29.00", "= 10월 순증 16.0 (18.0 − 2.0) + 11월 순증 13.0 (17.0 − 4.0)", "계약상 E2E 최소 인력만 있던 기간에 이월된 DVT와 변경 · 연동 대응을 위해 새로 투입한 공수"]],
      "17.95": ["DVT 시험 · 결함 대응 17.95 MM (인지)", ["10월 8.97 + 11월 8.98 = 17.95", "= 29.00 − 11.05", "1 ~ 3차 시험 수행, 결함 분석 · 수정 · 재시험 (품질 · 기획 인력 포함)", "청구하지 않고 인지만 요청"]],
      "11.05": ["변경 · 연동 대응 투입 11.05 MM (다산 산정)", ["29.00 − 17.95 = 11.05", "= 청구 10.10 + uCUBE 0.95", "= A13 10개 영역 합 10.10 + uCUBE 0.95", "산정 기간 10.01 ~ 11.17, 1 MM = 20 근무일 (221 MD)"]],
      "0.95": ["uCUBE 연계 대응 0.95 MM (LGU+ 부담)", ["10월 0.60 + 11월 0.35 = 0.95", "LGU+ 연계 시스템 대응분으로 다산 투입 11.05에는 포함, 고객사 청구에서는 제외"]],
      "10.10": ["고객사 청구 10.10 MM", ["11.05 − 0.95 = 10.10", "= ① 2.60 + ② 4.50 + ③ 2.50 + ④ 0.50", "= 10월 6.43 + 11월 3.67 (근무일 비례 추정, 10월 21일 · 11월 12일)", "= 202 MD (1 MM = 20 MD)"]],
      "8.10": ["ACOS 규격 변경 추가 개발 8.10 MM", ["8 ~ 9월 실제 50.3 − 계약 42.2 = 8.10", "= 8월 −2.2 (26.0 − 28.2) + 9월 +10.3 (24.3 − 14.0)", "변경 개발 12개 항목 162 MD ÷ 20 = 8.10 MM (A4)"]],
      "18.20": ["청구 공수 18.20 MM", ["8.10 + 10.10 = 18.20", "+ e-Care 콜버튼 3.86 = 요청 합계 22.06"]],
      "22.06": ["요청 합계 22.06 MM", ["3.86 + 8.10 + 10.10 = 22.06", "이전 요청 23.01 − uCUBE 0.95 = 22.06"]],
      "37.10": ["계약 대비 순증 37.10 MM", ["실제 85.3 − 계약 48.2 = 37.10", "= 8 ~ 9월 8.10 + 10 ~ 11월 29.00"]],
      "6.43": ["10월 변경 · 연동 대응 6.43 MM", ["10.10 × 21 ÷ 33 = 6.43", "산정 기간 10.01 ~ 11.17 근무일 33일 중 10월 21일 비례 (추정)"]],
      "3.67": ["11월 변경 · 연동 대응 3.67 MM", ["10.10 × 12 ÷ 33 = 3.67", "산정 기간 근무일 33일 중 11월 12일 비례 (추정)"]],
    },
  };
  // 4개 분류 · 10개 영역 툴팁
  A.dvtChg.rows.forEach((r) => {
    const det = [];
    let on = false;
    A.dvtChg.detail.forEach((d) => { if (d[0]) on = d[0].indexOf(r[1] === "MM/HU · DCM/ADF" ? "DCM/ADF" : r[1]) === 0 || (r[1] === "MM/HU · DCM/ADF" && d[0].indexOf("MM/HU") === 0); if (on) det.push(d[1]); });
    M.calc["a:" + r[1]] = [r[1] + " " + r[5].toFixed(2) + " MM", [r[5].toFixed(2) + " MM × 20 = " + Math.round(r[5] * 20) + " MD", "세부: " + det.join(" · "), "사유: " + r[3], "현재: " + (now[r[1]] || "")]];
  });
  const catSum = {};
  A.dvtChg.rows.forEach((r) => { const c = r[0].slice(0, 1); (catSum[c] = catSum[c] || []).push(r); });
  M.why1010.cats.forEach((c) => {
    const rs = catSum[c.k];
    M.calc["c:" + c.k] = [c.k + " " + c.h + " " + c.mm + " MM", [rs.map((r) => r[1] + " " + r[5].toFixed(2)).join(" + ") + " = " + c.mm, "기준: " + c.should, "실제: " + c.act]];
    c.rows = rs.map((r) => ({ a: r[1], mm: r[5].toFixed(2) }));
  });

  M.blkDates = blkDates;
  if (X.apxNew.m11) X.apxNew.m11.message = X.apxNew.m11.message.replace("최신 집계임", "11/20 개발 PM 확인 집계임");
  (function fix3(o) { Object.keys(o).forEach((k) => { const v = o[k]; if (typeof v === "string") o[k] = v.replace("(최신 집계: Pass 21", "(11/20 개발 PM 확인 집계: Pass 21"); else if (v && typeof v === "object") fix3(v); }); })(X.appendix || {});
  if (EV.e2e1) { EV.e2e1.kicker = "Kensho E2E"; EV.e2e1.title = "GS TC 위주, DVT와 병행 (11/23 ~ 12/30)"; }

  /* ── 11/24 전제 재정리: DVT는 고객사 요청으로 11/23부로 중지, 단 잔여 이슈는 해결까지 관리 ── */
  (function dvtStop() {
    const STOP = "DVT는 고객사 요청으로 11/23부로 중지";
    EV.p1 = { kicker: "진행 기준 1", title: "DVT 중지(11/23) · 잔여 이슈 해결", facts: [STOP + "하되, 중지 시점의 잔여 이슈는 해결 대상으로 관리", "잔여 Fail 2 · NT 334건은 일정을 이유로 Pass 처리하지 않고 상태 그대로 기록", "TMC · TMKR 측 선행 조건이 해소되는 대로 해당 이슈를 수정 · 재확인 — 일정은 주간 단위로 조율", "결함은 개발사가 수정 · 재확인"], src: ["r3", "pm1111"], apx: "apx-total" };
    EV.p2.title = "E2E 병행 수행";
    EV.p2.facts = EV.p2.facts.map((t) => t.replace("E2E는 DVT 잔여 대응과 병행", "E2E는 잔여 이슈 해결과 병행").replace("Kensho E2E를 DVT와 병행 수행", "Kensho E2E 수행"));
    EV.p3.title = "외부 선행 조건 해소가 잔여 이슈 해결 완료 시점을 결정";
    EV.p3.facts[2] = "11월 중 해소 → 12월 말 해결 완료 가능 / 12월 중 단계적 해소 → 1월 말 해결 완료";
    EV.p5.facts = EV.p5.facts.map((t) => t.replace("DVT 종료 시점 확정에 따라", "잔여 이슈 해결 완료 시점에 따라"));
    EV.reg.facts = EV.reg.facts.map((t) => t.replace("GS TC 위주 E2E와 DVT 잔여 대응을 병행", "GS TC 위주 E2E와 잔여 이슈 해결을 병행"));
    EV.deadline.title = "12/30 = Kensho E2E 회귀 테스트 종료일 · 잔여 이슈 해결 현황 점검";
    EV.deadline.facts[1] = "12월 중 TMC · TMKR 측 선행 조건 해소 현황을 점검해 잔여 이슈 해결 완료를 12월 말로 할지 1월 말로 할지 확정";
    EV.end.kicker = "근거 · 잔여 이슈 해결 완료 시점";
    EV.end.title = "12월 말 vs 1월 말 — 잔여 이슈의 선행 조건 해소 시점에 달림";
    EV.end.facts = EV.end.facts.map((t) => t.replace("12월 말 종료:", "12월 말 해결 완료:").replace("1월 말 종료:", "1월 말 해결 완료:").replace("12월 말 종료 시", "12월 말 해결 완료 시").replace("1월 말 종료 시", "1월 말 해결 완료 시"));
    if (EV.e2e1) { EV.e2e1.title = "GS TC 위주, 잔여 이슈 해결과 병행 (11/23 ~ 12/30)"; EV.e2e1.facts = EV.e2e1.facts.map((t) => t.replace("DVT 잔여 이슈 해소 현황", "잔여 이슈 해결 현황")); }
    if (EV.t1123) { EV.t1123.title = "11/23 DVT 중지(고객사 요청) · Kensho E2E 착수"; EV.t1123.facts = [STOP + ". 잔여 이슈는 해결 대상으로 계속 관리"].concat(EV.t1123.facts || []); }

    DK.s1.title = STOP + "하되 잔여 이슈는 해결까지 관리하고, E2E는 병행 수행함. 초반 E2E는 GS TC 위주로 진행하며, 이를 위한 개발 인력 유지(월 10 MM)가 필요함";
    DK.s1.kpis[3].small = "추가 인력 (11/18 ~ 해결 완료)";
    DK.s1.kpis[3].d = "12월 말 해결 15.00 · 1월 말 해결 25.00 (선행 조건 해소에 따름)";
    DK.s1.cols[2].head = "DVT는 11/23 중지, 잔여 이슈는 해결까지 관리하고 E2E는 GS TC 위주로 병행 수행함";
    DK.s1.cols[2].body = STOP + "함. 잔여 이슈는 해결까지 관리하며, VDP 서버 영향으로 e-Care E2E는 진행이 불가하여 초반 E2E는 GS TC 위주로 진행함. 잔여 이슈를 언제 해결할 수 있는지(12월 말 또는 1월 말)는 TMC · TMKR 측 선행 조건 해소에 달려 있으며, 그때까지 대기 · 운영 15명 내외, 청구 월 10 MM이 필요함.";
    DK.s1.cols[2].more = "해결 완료 시점 근거";
    DK.s1.ask = "요청 사항: ① DVT는 고객사 요청으로 11/23 중지, 잔여 이슈는 해결까지 관리 ② E2E는 GS TC 위주로 병행 수행(e-Care는 VDP 서버 정상화 후) ③ 11/18 이후 개발 인력 월 10 MM(11월 5 MM) 인정 — 12월 말 해결 완료 시 15.00 MM, 1월 말 해결 완료 시 25.00 MM";
    DK.blk.title = "잔여 이슈 5건은 TMC · TMKR 측 선행 조건이 풀려야 해소되며, 해소 시점이 잔여 이슈 해결 완료(12월 말 또는 1월 말)를 결정함";
    DK.blk.doneTitle = "잔여 이슈 해결 완료 시점: 12월 말 vs 1월 말 (선행 조건 해소에 따름)";
    DK.man.title = "DVT 잔여 이슈 해결 · E2E 대응 인력 유지 · 예측 공수 25.00 MM (11.18 ~ 2027.01.29, 1월 말 해결 완료 기준)";
    DK.man.foot = DK.man.foot.replace("12월 말 종료로 확정되면", "12월 말 해결 완료로 확정되면");
    DK.man.bullets = DK.man.bullets.map((t) => t.replace("DVT · E2E 기간에는 각 모듈 담당자가", "DVT 중지(11/23) 이후에도 잔여 이슈 해결 · E2E 기간에는 각 모듈 담당자가"));

    const P = DK.plan;
    P.title = STOP + "하고 E2E(GS TC 위주)를 착수함. 잔여 이슈는 TMC · TMKR 측 선행 조건 해소에 맞춰 12월 말 또는 1월 말까지 해결함";
    P.lede = "DVT 중지(11/23) 시점의 잔여 이슈(Fail 2 · NT 334)는 상태 그대로 기록하고, 선행 조건이 풀리는 순서대로 해결 · 재확인함. Kensho E2E는 GS TC 위주로 병행함. 12월 중 해소 현황을 점검해 해결 완료 시점(12월 말 · 1월 말)을 확정함. 점선은 미확정 구간임.";
    P.prem[0] = ["1", "DVT 중지 · 잔여 이슈 해결", STOP + ". 중지 시점 잔여 Fail 2 · NT 334건은 상태 그대로 기록하고, 선행 조건이 해소되는 대로 해결 · 재확인 (주간 일정 조율)", "해결 완료 시점 재협의"];
    P.prem[1] = ["2", "Kensho E2E 병행", "11/23 착수, GS TC 위주로 잔여 이슈 해결과 병행. 회귀 테스트는 TMC 환경 구성(Procedure · DCM Update) 선결 후 수행", "E2E 일정 재조정"];
    P.prem[2][3] = "해소 시점에 따라 12월 말 ↔ 1월 말 해결 완료";
    P.prem[4][3] = "해결 완료 시점에 맞춰 1월분 조정";
    P.tracks[0] = { h: "DVT 중지 (11/23) · 잔여 이슈 해결", b: STOP + ". 잔여 Fail · NT는 상태 그대로 기록하고, 위 선행 조건이 풀리는 대로 해결 · 재확인 (주간 일정 조율). 해소가 늦어지면 1월 말까지", ev: "dv:p1" };
    P.tracks[1] = { h: "Kensho E2E · GS TC 위주 (11/23 ~ 12/30)", b: "VDP 서버 영향이 없는 GS TC 위주로 잔여 이슈 해결과 병행 수행. ACOS IF 기반 TC 포함", ev: "dv:e2e1" };
    EV.prem.facts = P.prem.map((r) => r[0] + ". " + r[1] + " — " + r[2] + " (달라지면: " + r[3] + ")");
    const T = DK.tl;
    T.marks = T.marks.map((m) => m.l === "11/23 E2E 착수" ? Object.assign({}, m, { l: "11/23 DVT 중지 · E2E 착수" }) : m.l === "12/30 종료 시점 점검" ? Object.assign({}, m, { l: "12/30 해결 현황 점검" }) : m);
    T.lanes[0] = { h: "잔여 이슈 해결", sub: "DVT는 11/23 중지", bars: [
      { a: [2026, 11, 18], b: [2026, 12, 31], t: "dvt", l: "잔여 이슈 해결 · 선행 조건 해소분 수정 · 재확인", ev: "dv:p1" },
      { a: [2027, 1, 1], b: [2027, 1, 29], t: "cond", dash: true, l: "선행 조건 해소 지연 시 1월 말까지", ev: "dv:end" },
    ] };
    T.lanes[1].sub = "GS TC 위주 · 병행";
    T.lanes[1].bars[0].l = "GS TC 위주 · 잔여 이슈 해결과 병행 (ACOS IF 포함)";
    T.notes = [STOP + "하되 잔여 이슈는 해결까지 관리하고 E2E는 병행 수행 (A · B 대안 비교 없이 단일 진행 기조)", "12월 중 TMC · TMKR 측 선행 조건 해소 현황을 점검해 잔여 이슈 해결 완료를 12월 말 또는 1월 말로 확정"];
    const m4 = X.apxNew.m4;
    m4.message = "11.18 이후 DVT 잔여 이슈 해결(DVT는 11/23 고객사 요청으로 중지)과 E2E 병행에 필요한 개발 인력 산정임. 해결 완료 시점(12월 말 / 1월 말)에 따라 1월분을 조정함.";
    m4.rows[0] = ["1", "DVT 중지 · 잔여 이슈 해결", STOP + ". 잔여 Fail · NT는 상태 그대로 기록, 선행 조건 해소 시 해결 · 재확인", "해결 완료 시점 재협의", "잔여 N/T 재수행 · 회귀시험 2.60"];
    m4.rows[1][2] = "11/23 착수, GS TC 위주로 잔여 이슈 해결과 병행. 회귀 테스트는 TMC 환경 구성 선결 후";
    m4.rows[2][3] = "12월 말 ↔ 1월 말 해결 완료";
    m4.rows[4][4] = "12월 말 해결 완료 15.00 · 1월 말 해결 완료 25.00";

    const O = M.overview.i2;
    O.kpi[2] = ["GS TC", "Kensho E2E 위주", "11/23 착수 · DVT 중지"];
    O.stance = "NT 건 대응방안 : " + STOP + "하되, 잔여 이슈는 해결까지 관리하고 E2E는 병행 수행합니다. 초반 E2E는 GS TC 위주로 진행합니다.";
    O.end[0].k = "12월 말 해결 가능 시"; O.end[0].c = "11월 중 TMC · TMKR 측 주요 선행 조건 해소 시";
    O.end[1].k = "1월 말 해결 가능 시";
    O.endNote = "잔여 이슈를 언제까지 해결할 수 있는지는 TMC · TMKR 측 선행 조건(VDP 서버 · ACOS API · CTI · DMS 등) 해소에 달려 있어, 12월 중 점검해 확정합니다.";
    M.overview.ask = M.overview.ask.replace("DVT 종료 시점에 따라", "잔여 이슈 해결 완료 시점에 따라");
    A.extraDvt.notes[1] = "잔여 이슈 해결 완료 시점은 TMC · TMKR 측 선행 조건 해소에 따라 2026년 12월 말 또는 2027년 1월 말로 확정 — 12월 말 해결 완료 시 15.00 MM(11월 5 + 12월 10)";
    EV.deadline.facts = EV.deadline.facts.map((t) => t.replace("일정 조율을 통해 지속 관리", "해결까지 관리"));
    if (EV.e2e1) EV.e2e1.facts = EV.e2e1.facts.map((t) => t.replace("진행 기조: DVT 잔여 이슈는 일정 조율을 통해 지속 관리하고 E2E는 병행 수행", "진행 기조: " + STOP + "하되, 잔여 이슈는 해결까지 관리하고 E2E는 병행 수행"));
    if (X.apxNew.m11 && X.apxNew.m11.message) X.apxNew.m11.message = X.apxNew.m11.message.replace("Open Item으로 두고 일정 조율을 통해 지속 관리함", "Open Item으로 두고, DVT 중지(11/23, 고객사 요청) 이후에도 해결까지 관리함");
    if (EV.e2e11) { EV.e2e11.title = "DVT 중지(11/23) · 잔여 이슈 해결 + E2E 병행 수행"; EV.e2e11.facts = [STOP + "하되, 잔여 이슈는 해결까지 관리하고 E2E는 병행 수행"].concat(EV.e2e11.facts.slice(1).map((t) => t.replace("E2E 기간에도 DVT 잔여 대응 인력이 함께 필요", "E2E 기간에도 잔여 이슈 해결 인력이 함께 필요"))); }
  })();

  /* ── 11/24 (2): DVT는 이미 중지됨 · E2E 계약 인력은 PM 0.25(분석)뿐 · 개발 인력 없이 E2E 진행 시 문제점 ── */
  (function noDev() {
    const E2EC = "E2E 계약 인력은 PM 0.25 MM(분석 업무)만 할당되어 있음 — DVT가 정상 종료된다는 전제로 산정된 것";
    DK.man.bullets.push("E2E 계약 기준 인력은 PM 0.25 MM(분석 업무)뿐이며, 이는 DVT가 정상 종료된다는 전제로 산정되었습니다. DVT가 중지되어 잔여 이슈가 남은 지금은 결함 수정 · 재확인을 맡을 개발 인력이 계약에 없습니다.");
    EV.p2.facts.unshift(E2EC + ". DVT가 중지되어 잔여 이슈가 남은 상태로 E2E에 진입하므로 개발 인력이 별도로 필요");
    DK.plan.prem[1][2] = DK.plan.prem[1][2] + ". E2E 계약 인력은 PM 0.25(분석)뿐 — DVT 정상 종료 전제";
    EV.prem.facts = DK.plan.prem.map((r) => r[0] + ". " + r[1] + " — " + r[2] + " (달라지면: " + r[3] + ")");
    const R = {}; (X.apxNew.m11 ? X.apxNew.m11.rows : []).forEach((r) => { R[r[0]] = r; });
    const tot = R["합계"] || ["합계", "992", "656", "2", "334", "66.1%"], open = (+tot[3]) + (+tot[4]);
    const ar = {}; DK.man.areaRows.forEach((r) => { if (r[1]) ar[r[1]] = r; });
    const mm = (k) => ar[k] ? ar[k][6] : "";
    M.nodev = {
      kicker: "Item2 · 개발 인력 없이 E2E를 진행할 경우",
      title: "개발 인력 없이 E2E를 진행할 경우의 문제점",
      lead: "DVT는 고객사 요청으로 11/23부로 중지되었고, " + E2EC + "임. 중지 시점에 남은 잔여 이슈는 개발 수정 없이는 해소되지 않으므로, 계약 인력만으로 E2E를 진행하면 아래 문제가 생김.",
      kpi: [["DVT 중지 시점 미완료", open + " TC", "Fail " + tot[3] + " · NT " + tot[4] + " / " + tot[1] + " TC (" + (open / +tot[1] * 100).toFixed(1) + "%)"], ["미해소 Critical Blocker", "4 / 5건", "VDP Diag · CTI/TCK · DMS · ACOS API"], ["E2E 계약 인력", "PM 0.25", "분석 업무만 · 개발 0"], ["E2E 기간", "11/23 ~ 12/30", "e-Care E2E 12/14 ~ 12/30 계획"]],
      areaHead: ["영역", "Total", "Fail", "NT", "미완료", "개발 인력이 없으면"],
      areaRows: [
        ["GS", "GS 잔여 NT 재시험 중 결함이 나와도 수정 · 재배포할 사람이 없음"],
        ["OPW", "잔여 NT 재수행 결과에 따른 수정 불가"],
        ["CCW", "CTI/TCK 중계서버 연계 개발(최대 3주)이 끝나지 않아 236 TC 전량 미수행 — 개발 없이는 E2E에서도 시험 자체가 불가"],
        ["DMS", "API 5 → 24개 반영 중, 최종 변경분 E2E TC Merge 필요 — 반영 작업이 멈춤"],
        ["VDP(Diag)", "Fail 1 · NT 2 미해소 — VDP 서버 정상화 후 수정 · 재확인 필요, 안 되면 e-Care E2E는 시뮬레이터로 KR 영역만 시험"],
      ].filter((x) => R[x[0]]).map((x) => { const r = R[x[0]]; return [x[0], r[1], r[2] === undefined ? "" : r[3], r[4], String((+r[3]) + (+r[4])), x[1]]; }),
      issues: [
        { h: "결함이 나와도 고칠 사람이 없음", t: "10 ~ 11월 DVT 시험 · 결함 대응에만 개발 · 품질 인력 17.95 MM이 실제로 투입되었고, 1 ~ 3차 시험마다 결함 수정 · 재배포(예: 2차 수정 반영 11.03 ~ 11.10)를 반복함. E2E도 같은 영역을 시험하므로 결함이 예상되나, 계약 인력(PM 0.25)은 분석만 할 수 있음.", ev: [["i1-mm", "Item1 ② 17.95 MM (인지)"], ["dvt", "A5 DVT 수행 일정"], ["dvt-run", "A10 DVT 수행 실적"]] },
        { h: "선행 조건이 풀려도 후속 개발을 할 수 없음", t: "미해소 Blocker 4건은 모두 해소되는 시점에 개발 작업이 따라붙음: VDP Diag 수정 · 재확인, CTI/TCK 중계서버 연계 개발(최대 3주), DMS API 5 → 24개 반영, ACOS API 미동작 버전 6개 정리(Redoc · Pre-PROD 반영 시 추가 개발 가능).", ev: [["blk-dates", "E4 이슈별 해결 일자 · 현재 상태"], ["chg-plan", "A16 항목별 예정 vs 실제와 공수"]] },
        { h: "CCW 236 TC는 한 번도 시험되지 않은 상태", t: "CCW는 DVT 기간 내내 CTI 연계환경 미해소로 0 / 236 TC 수행. 개발이 끝나야 처음 시험할 수 있고, 처음 수행하는 시험이라 결함 발생 가능성이 가장 높음.", ev: [["apx-total", "D1 DVT 통합 결과 (992 TC)"], ["blk-dates", "E4 CTI/TCK 중계"]] },
        { h: "회귀 테스트에서 나온 결함도 대응 불가", t: "회귀 테스트는 TMC Procedure 제공(11월 말 예상) · DCM Update 지원 후 수행되며 1월로 넘어갈 가능성이 있음(11/18 PM 회의). 회귀 결함을 수정할 개발 인력이 없으면 회귀 완료 판정을 받을 수 없음.", ev: [["apx-pre", "E2E 사전 준비 · 회귀 테스트"]] },
        { h: "Migration 단계 진입이 막힘", t: "24DCM Pre-Prod Regression Test는 ACOS E2E와 Regression이 모두 정상 완료된 경우에만 Migration 단계로 진행함. 잔여 이슈와 E2E 결함이 수정되지 않으면 Migration 일정 전체가 뒤로 밀림.", ev: [["dvt", "A5 일정 변경 비교 (24DCM Pre-Prod Regression)"]] },
      ],
      frame: [
        ["LGU+ 개발 범위", "개발 완료 — LGU+ 개발 로직은 내부 검증 완료(11/14 논의). 남은 Fail · NT는 외부 연동 선행 조건에 묶여 있음"],
        ["E2E 계약 인력의 전제", "PM 0.25 MM(분석 업무)은 DVT가 클리어된 상태로 E2E에 들어간다는 프레임으로 산정됨. 당시 합의를 바꾸자는 것이 아니라, 그 전제(DVT 클리어)가 성립하지 않았다는 사실의 문제임"],
        ["분석 대상 범위", "8개 시스템 · 15개 연동을 대상으로 하는 E2E로, 잔여 이슈가 남은 상태에서는 PM 1인 분석만으로 원인 확인 · 조치까지 이어가기 어려움"],
      ],
      now: [
        ["API 연동 테스트가 끝나지 않음", "VDP(Diag) 24 TC 중 Fail 1 · NT 2, CCW 236 TC 전량 NT(CTI 미연동), DMS는 VDP 실데이터 미수신으로 시뮬레이터 대체 시험(11/20 집계)", "apx-total"],
        ["ACOS API가 아직 변경되고 있음", "TSC-GC/GB Request/Response 변경 영향 지속, Redoc 사양 변경 · Pre-PROD 반영 일정에 따라 추가 개발 가능(E4 ⑤)", "blk-dates"],
        ["인터페이스는 그대로인데 로직이 바뀜", "API 프로토콜(인터페이스)은 유지되나 24DCM과 로직이 바뀌고 있음 — 예: 회원가입 프로세스 변경", ""],
        ["VDP(Diag) NT 2건은 LGU+ 개발과 무관", "VDP 서버(TMC) 영향으로 진입 자체가 안 된 건. 서버 정상화 전에는 수정할 대상이 없음", "blk-dates"],
      ],
      worry: ["E2E에서도 Fail · NT는 계속 나올 것", "나온 건에 대해 원인 분석부터 쉽지 않음(8개 시스템 · 15개 연동)", "잔여 이슈는 결국 해결해야 함 — 해결 주체(개발 인력)가 계약에 없음"],
      ownHead: ["영역", "잔여", "TMC", "TMKR", "LGU+", "근거 · 확인 필요"],
      ownRows: [
        ["CCW", "NT 236", "연계환경 공동", "236", "0", "CTI 중계서버(TCK) 미개발로 전량 NT — 10/21 · 11/03 PM 회의록, E2E 사전준비 #10 CTI 중계(PIC TMKR). 27CY SU#2 전용 연계환경은 TMKR · TMC 공동(E4 ③)"],
        ["VDP(Diag)", "Fail 1 · NT 2", "NT 2", "0", "확인 필요", "NT 2는 VDP 서버(TMC) 영향. Fail 1은 x-api-key 불일치 · WNG 필드 조건 · odometer · resultCd 처리 이슈 중 어느 건인지, 원인 주체 기록 확인 필요"],
        ["DMS", "Fail 1 · NT 35", "NT 4 (HU 연결)", "NT 7 (CTI 연결)", "확인 필요", "건수는 11/17 NT 34건 분해 기준(선행 Blocked 17 · CTI 7 · HU 4 · 기타 6). 선행 Blocked · 기타는 건별 확인 필요. Fail 1은 11/17 Fail 2건(WNG Symbol 덮어쓰기 · CCW 위치 라벨) 중 남은 건 — 결함 여부 확인 필요"],
        ["GS", "NT 38", "주 원인", "근거 없음", "0", "HU SW(SU#1) · MM Flag, GSA/Auth0(GSP DB상 TMC가 원인 인정, 11/6), DCM · DK 서버. 11/17 59건 분해(HU 22 · 선행 Blocked 17 · 기간 설정 12 · 기타 8) 이후 11/20 38건의 건별 분해는 미확보. HU는 GSP DB에 ‘TMC HU SW 구버전 + 한국 측 업데이트 미실행’ 복합으로 기록되어 있어 한국 측 주체 확인 필요"],
        ["OPW", "NT 23", "확인 필요", "확인 필요", "0", "11/17 기준 23건 전량 ‘CAN Configuration 미확보 · 실패 환경 미구성’. CAN Configuration 제공 주체가 기록에 없어 귀책 미분류"],
      ],
      ownNote: "근거로 확인된 귀책: TMKR 측 CCW 236 · DMS CTI 연결 7(11/17), TMC 측 VDP NT 2 · DMS HU 연결 4(11/17) · GS 대부분. LGU+ 귀책으로 기록된 NT는 없음. Fail 2건과 나머지 NT는 영역 단위 원인만 있어 건별 확인 전에는 귀책을 단정하지 않음.",
      need: "필요 인력(Item2 ②): VDP " + (+mm("VDP Diag") + +mm("VDP CoCo")).toFixed(2) + " · ACOS " + (+mm("ACOS API") + +mm("ACOS Provisioning")).toFixed(2) + " · 외부시스템 " + ["MM/HU · DCM/ADF", "CTI/TCK", "Global/Local App", "DMS · Digital Key", "e-Care"].reduce((a, k) => a + +mm(k), 0).toFixed(2) + " · DVT 영향 " + mm("DVT 영향 분석") + " MM = 25.00 MM (11월 5 · 12월 10 · 1월 10)",
      src: "근거: D1 DVT 통합 결과(11/20 개발 PM 확인 집계) · DVT 결과 11/17 NT · Fail 분해 · GSP DB · E4 이슈별 해결 일자(11/18 PM 정례회의록 · E2E 사전준비 · E2E 세부일정) · A5 · A10 · Item1 ② · Item2 ②. E2E 계약 인력(PM 0.25) · 8개 시스템 15개 연동 · 24DCM 로직 변경은 내부 메모 기준.",
    };
    /* "중지함/중지하되" → 이미 중지된 사실로 */
    (function past(o) { Object.keys(o).forEach((k) => { const v = o[k]; if (typeof v === "string") o[k] = v.replace(/11\/23부로 중지하되/g, "11/23부로 중지되었으나").replace(/11\/23부로 중지하고/g, "11/23부로 중지되었고").replace(/11\/23부로 중지함/g, "11/23부로 중지됨").replace(/11\/23 중지하되/g, "11/23 중지되었으나"); else if (v && typeof v === "object") past(v); }); })({ DK, M, EV, apx: X.apxNew, ex: A.extraDvt });
  })();
  /* 11/24 메일 조사(받은편지함 10/19 ~ 11/23) 반영 — 근거가 메일로 확인된 것만 */
  (function mail1124() {
    const N = M.nodev;
    N.now[2] = ["인터페이스는 그대로인데 로직이 바뀜", "API 프로토콜(인터페이스)은 유지되나 24DCM과 로직이 바뀌고 있음 — 예: 회원가입 프로세스 변경. 관련 검토(10/12 OneID 영향도 검토 메일): Auth0 · 백엔드 · QA 영향도 ‘매우 높음’, 통합 방식과 사용자 식별 체계를 먼저 정해야 함", ""];
    N.ownRows.forEach((r) => {
      if (r[0] === "VDP(Diag)") r[5] = r[5].replace("NT 2는 VDP 서버(TMC) 영향.", "NT 2는 VDP 서버(TMC) 영향(10/27 VDP 접속 주소 변경 경과 메일).");
      if (r[0] === "GS") r[5] = r[5].replace("GSA/Auth0(GSP DB상 TMC가 원인 인정, 11/6)", "GSA/Auth0(GSP DB상 TMC가 원인 인정 11/6, 11/04 Auth0 흰 화면 원인 분석 메일)");
    });
    N.src = N.src.replace("GSP DB · E4", "GSP DB · 11/24 메일 조사(10/12 OneID 영향도 검토, 10/27 VDP 접속 주소 변경 경과, 11/04 Auth0 흰 화면 원인 분석) · E4");
    if (DK.ev && DK.ev.vdp) DK.ev.vdp.facts.push("10/27 VDP 접속 주소 변경 경과 메일: 접속 주소(Endpoint) 변경이 이어진 경과 기록");
    const DKR = [
      ["TSC-DK Wrapper 신규 연계 (일자 확인 중)", "TSC-DK Wrapper 신규 연계 (11/04 방화벽 등록 요청 메일)"],
      ["White List 필요 (일자 확인 중)", "White List 필요 (11/04 방화벽 등록 요청)"],
      ["Digital Key 발생 일자는 개발팀 확인 후 갱신 예정", "Digital Key: 11/04 방화벽(White List) 등록 요청 메일로 연동 작업 확인. 최초 발생 일자는 개발팀 확인 후 갱신 예정"],
      ["근거 없는 항목: DMS 1.05 · Digital Key 0.25 · Share User 409", "근거 없는 항목: DMS 1.05 · Share User 409"],
      ["근거가 없는 항목: DMS 1.05 · Digital Key 0.25", "근거가 없는 항목: DMS 1.05 (Digital Key 0.25는 11/04 방화벽 등록 요청 메일로 확인)"],
    ];
    (function rep(o) { Object.keys(o).forEach((k) => { const v = o[k]; if (typeof v === "string") o[k] = DKR.reduce((t, r) => t.split(r[0]).join(r[1]), v); else if (v && typeof v === "object") rep(v); }); })({ DK, M, EV, A, X });
  })();
  base.M = M;
  base.X = X;
  /* 고객사에 LGU+ 이름으로 나가는 자료: 요청 · 부담 주체를 LGU+로 통일 (변경 이력 meta는 원문 유지) */
  const VOICE = [["개발사(다산)", "개발사"], [" MM(다산 산정)", " MM"], ["(다산 산정)", ""], ["(다산 산정, ", "("], ["A13 다산 산정(", "A13 산정("], ["다산 투입 · 산정 공수는 그대로", "투입 · 산정 공수는 그대로"], ["다산 산정 내역", "개발 산정 내역"], ["다산 산정 기간", "투입 산정 기간"], ["다산 산정", "투입 산정"], ["다산 투입 기준", "투입 기준"], ["다산 투입 11.05", "투입 11.05"], ["유휴분은 다산이 부담", "유휴분은 LGU+가 부담"], ["유휴는 다산 부담", "유휴분 LGU+ 부담"], ["유휴 인력 비용은 수행사가 부담", "유휴 인력 비용은 LGU+가 부담"], ["유휴분은 수행사 부담", "유휴분은 LGU+ 부담"], ["유휴분 수행사 부담", "유휴분 LGU+ 부담"], ["유휴분은 수행사가 부담", "유휴분은 LGU+가 부담"], ["LGU+ · 다산 개발 영역", "LGU+ 개발 영역"], ["다산 메일", "LGU+ 개발팀 메일"], ["DasanDMC 한국 개발팀", "LGU+ 개발팀"], ["결함은 개발사가 수정", "결함은 LGU+ 개발팀이 수정"], ["Dasan 측", "LGU+ 개발팀"], ["Dasan 회신", "LGU+ 개발팀 회신"], ["Dasan 정리표", "LGU+ 개발팀 정리표"], ["Dasan", "LGU+ 개발팀"]];
  (function voice(o) { Object.keys(o).forEach((k) => { if (o === base && k === "meta") return; const v = o[k]; if (typeof v === "string") o[k] = VOICE.reduce((t, r) => t.split(r[0]).join(r[1]), v); else if (v && typeof v === "object") voice(v); }); })(base);
  return base;
};
