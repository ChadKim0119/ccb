// ── 2026.11.21 통합: Item1(ACOS · VDP 지연 추가 개발) + Item2(DVT 개발 인력 유지) ──
// content.js 의 module.exports 를 받아 통합 장표용 데이터(M)와 Item2 데이터(X)를 붙이고,
// Item1 부록의 현재 상태를 DVT 최신 평가(992 TC)로 갱신한다.
const X = require("./dvt.js");

module.exports = function (base) {
  const A = base.appendix;

  /* ── 1. Item1 부록 현재 상태 최신화 (DVT 장표 v2.9 · 11/21 집계 기준) ── */
  const now = {
    "ACOS API": "변경 반영 · 재검증 완료. TSC-GC/GB Request/Response 변경 영향 지속 (Redoc 사양 · Pre-PROD 반영 일정에 따라 추가 개발 가능)",
    "ACOS Provisioning": "11.18 MM Capable Flag 확인 완료. Flag 조합별 Opt-in/out 추가 검증 필요",
    "VDP Diag": "11.13 첫 실연동 이후 24 TC 중 Pass 21 · Fail 1 · NT 2. VDP 서버 영향으로 e-Care E2E는 진행 불가",
    "VDP CoCo": "Center Request 정상 응답, Callback 검증 중",
    "MM/HU · DCM/ADF": "SU#1 H/U · SubMCU 업데이트 5회 완료, 업데이트 후 테스트 필요",
    "Digital Key": "TSC-DK 연동 환경 확인 진행 중",
    "CTI/TCK": "27CY SU#2 전용 연계환경 구성 필요. CCW 236 TC는 CTI 미연동으로 NT, CCW 통화 E2E 미수행",
    "Global/Local App": "TMC Auth0 설정 변경 협의 중",
    "DMS": "VDP 실데이터 미수신으로 시뮬레이터 대체 시험. DMS 114 TC 중 Pass 78 · Fail 1 · NT 35",
    "DVT 영향 분석": "통합 992 TC 중 잔여 NT 334건 원인 분류 · 재수행 대기",
  };
  A.dvtChg.rows.forEach((r) => {
    if (now[r[1]]) r[4] = r[4].split("→")[0].trim() + " → " + now[r[1]];
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
    "현재 상태는 DVT 통합 결과 최신 집계(992 TC · Pass 656 · Fail 2 · NT 334, 11.21 반영) 기준",
    "기준 일자 출처: 07.27 TMC 최종 규격, 08.26 · 09.02 · 10.07 ~ 21 PM 정례회의록, 09.15 서면, 10.04 TMC 일정 (A1 · A13 · A14)",
  ];
  // A15: Item2 와 같은 25.00 MM 산정으로 통일 (이전 판 24.95 는 Item2 산정으로 대체)
  A.extraDvt.title = "추가 DVT 기간 예측 공수 (2026.11.18 ~ 2027.01.29, 25.00 MM)";
  A.extraDvt.message = "Item2 추가 인력 산정과 같은 기준임. 대기 · 운영 인력은 월 15명 내외로 두고, 청구는 실제 대응분 월 10 MM(11월 5 MM)으로 한정함. uCUBE는 제외";
  A.extraDvt.areas = X.deck.man.areaRows.filter((r) => r[0] !== "합계").map((r) => [r[1], r[2], +r[6]]);
  A.extraDvt.periods = [["11/18 ~ 11/30", "연동 장애 해소, 환경 정상화, E2E 진입 대응", 5.0], ["12/01 ~ 12/31", "잔여 기능 수정, 외부 연동시험, E2E 병행 대응", 10.0], ["2027.01.01 ~ 01.29", "잔여 N/T 해소, 결함 수정, 최종 회귀시험", 10.0]];
  A.extraDvt.result = { head: ["영역", "전체 TC", "Pass", "Fail", "NT", "Pass 비율"], rows: X.apxNew.m11.rows.map((r) => r.slice()) };
  A.extraDvt.resultNotes = ["DVT 통합 결과 최신 집계(11.21 반영). 이전 집계(11.17, 968 TC)의 NT 352건 → 334건으로 감소", "CCW 236건은 CTI 미연동으로 전량 NT"];
  A.extraDvt.notes = ["월 MM = 해당 월 실제 대응 예상 인원 기준(11월은 11/18 이후 잔여 기간)", "DVT 종료 시점은 TMC 측 선행 조건 해소에 따라 2026년 12월 말 또는 2027년 1월 말로 확정 — 12월 말 종료 시 15.00 MM(11월 5 + 12월 10)", "uCUBE(LGU+ 연계)는 별도 협의로 본 산정에서 제외"];
  A.extraDvt.source = "출처: DVT · E2E 운영방안 보고(2026.11.21), CCB 자료 2026.11.18 p.21 갱신본";
  if (A.extraDvt.issues) A.extraDvt.issues = X.deck.blk.cards.map((c) => [c.no + " " + c.h, c.who, c.fact.replace(/\n/g, " ") + ". " + c.note]);
  if (A.extraDvt.schedule) A.extraDvt.schedule = { head: X.deck.blk.doneHead, rows: X.deck.blk.doneRows };

  /* ── 2. Item2 데이터: 옵션(A · B · C) · 조건부 승인 문구 제거, 진행 기조로 통일 ── */
  const DK = X.deck, EV = DK.ev;
  const keepEv = ["status", "vdp", "hu", "cause", "e2e1", "e2e2", "blk", "e2e11", "c3", "t1113", "t1116", "t1117", "t1123", "deadline"];
  Object.keys(EV).forEach((k) => { if (keepEv.indexOf(k) < 0) delete EV[k]; });
  EV.e2e11.apx = "apx-pre";
  EV.deadline = { kicker: "근거 · 12월 점검", title: "12/30 = Kensho E2E 회귀 테스트 종료일 · DVT 종료 시점 점검", facts: ["Kensho E2E 회귀 테스트 종료일(E2E 세부일정상 e-Care E2E 종료일 12/30)", "12월 중 TMC 측 선행 조건(HU/MM · VDP 서버 · ACOS API) 해소 현황을 점검해 DVT 종료를 12월 말로 할지 1월 말로 할지 확정", "해소되지 않은 항목은 Fail · NT 상태 그대로 기록하고 일정 조율을 통해 지속 관리"], src: ["sch"], apx: "apx-plan" };
  EV.t1116.apx = "apx-plan";
  EV.e2e1.facts = EV.e2e1.facts.filter((t) => !/마지노선/.test(t)).concat(["12/30 회귀 테스트 종료 시점에 DVT 잔여 이슈 해소 현황을 함께 점검"]);
  EV.e2e2.facts = EV.e2e2.facts.filter((t) => !/대체 수단/.test(t));
  EV.end = { kicker: "근거 · DVT 종료 시점", title: "12월 말 vs 1월 말 — TMC 선행 조건 해소 시점에 달림", facts: ["12월 말 종료: 11월 중 TMC 측 주요 선행 조건 해소가 필요하고 개발 · QA 집중 병렬 투입 필요 — 현실적으로 어려움, 조건부 단축 협의 필요", "1월 말 종료: 12월 중 단계적 해소를 전제로 단계별 투입 · 반복 검증 — 현실적인 일정", "필요 인력(청구): 12월 말 종료 시 15.00 MM(11월 5 + 12월 10), 1월 말 종료 시 25.00 MM(+ 1월 10)", "본사 API 사양 변경 · Pre-PROD 반영이 2027년 2월 이후 확정되면 별도 일정 · 공수로 관리하거나 종료 기준 재협의"], src: ["ccb1118"], apx: "apx-man" };
  EV.p1 = { kicker: "진행 기준 1", title: "DVT 잔여 이슈 관리", facts: ["잔여 Fail 2 · NT 334건은 일정을 이유로 Pass 처리하지 않고 상태 그대로 기록", "TMC · TMKR 측 선행 조건이 해소되는 대로 해당 TC를 재수행 — 일정은 주간 단위로 조율", "결함은 개발사가 수정 · 재시험"], src: ["r3", "pm1111"], apx: "apx-total" };
  EV.p2 = { kicker: "진행 기준 2", title: "E2E 병행 수행", facts: ["E2E는 DVT 잔여 대응과 병행", "VDP 서버 영향으로 e-Care E2E는 현재 진행 불가 → 초반 E2E는 GS TC 위주", "e-Care E2E는 VDP 서버 정상화 시점에 맞춰 일정 조율 후 진행", "11/03 PM 합의: 시험 가능 범위를 세분화해 시작부터 NT가 예상되는 TC를 최소화"], src: ["pm1103", "sch", "pre"], apx: "apx-pre" };
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
  DK.blk.doneRows = DK.blk.doneRows.concat([["필요 인력 (청구)", "15.00 MM (11월 5 + 12월 10)", "25.00 MM (11월 5 + 12월 10 + 1월 10)"]]);
  DK.man.kicker = "Item2 · 추가 인력 산정";
  DK.man.title = "DVT 개발 인력 유지 · 예측 공수 25.00 MM (11.18 ~ 2027.01.29, 1월 말 종료 기준)";
  DK.man.foot += ". 12월 말 종료로 확정되면 1월분 10.0 MM을 제외한 15.00 MM";
  DK.plan = {
    kicker: "Item2 · 진행 계획",
    title: "E2E는 11/23 GS TC 위주로 병행 착수하고, DVT 잔여 이슈는 TMC 측 선행 조건 해소에 맞춰 12월 말 또는 1월 말까지 지속 관리함",
    lede: "12월 중 선행 조건 해소 현황을 점검해 종료 시점을 확정함. 점선은 미확정 구간임.",
    premHead: ["#", "기준", "내용", "달라지면"],
    prem: [
      ["1", "DVT 잔여 이슈 관리", "잔여 Fail 2 · NT 334건은 상태 그대로 기록, 선행 조건이 해소되는 대로 재수행 (주간 일정 조율)", "종료 시점 재협의"],
      ["2", "E2E 병행", "11/23 착수, 초반 GS TC 위주. e-Care는 VDP 서버 정상화 후 일정 조율", "E2E 일정 재조정"],
      ["3", "외부 선행 조건", "TMC: HU(MM) · VDP 서버 · ACOS API / TMKR: CTI 연계환경 · DMS 실데이터", "해소 시점에 따라 12월 말 ↔ 1월 말"],
      ["4", "범위 변경", "사양 변경은 TC 문서 기준으로 신규 · 재수행 범위 확정", "근거 기준 별도 협의"],
      ["5", "인력 · 청구", "대기 · 운영 15명 내외, 청구 월 10 MM(11월 5 MM), 유휴분 수행사 부담", "종료 시점에 맞춰 1월분 조정"],
    ],
    premEv: ["dv:p1", "dv:p2", "dv:p3", "dv:p4", "dv:p5"],
    tracks: [
      { h: "E2E #1 · GS TC 위주 (11/23 ~ 12/30)", b: "VDP 서버 영향이 없는 GS TC 위주로 착수. 회귀 테스트 · ACOS IF 기반 TC 포함, 회귀용 24 DCM 기자재 활용", ev: "dv:e2e1" },
      { h: "E2E #2 · e-Care (VDP 서버 정상화 후)", b: "VDP 서버 영향으로 현재 진행 불가. 서버 정상화 시점에 맞춰 일정 조율 후 진행", ev: "dv:e2e2" },
    ],
  };
  DK.tl = {
    start: [2026, 11, 16], days: 77,
    marks: [
      { d: [2026, 11, 17], l: "11/17 DVT 3차 종료", ev: "dv:t1117" },
      { d: [2026, 11, 23], l: "11/23 E2E 착수", ev: "dv:t1123", lo: 1 },
      { d: [2026, 12, 30], l: "12/30 종료 시점 점검", ev: "dv:deadline", dead: true },
      { d: [2027, 1, 29], l: "1/29", ev: "dv:end", lo: 1 },
    ],
    lanes: [
      { h: "DVT", sub: "잔여 이슈 지속 관리", bars: [
        { a: [2026, 11, 18], b: [2026, 12, 31], t: "dvt", l: "잔여 이슈 지속 관리 · 재수행 (일정 조율)", ev: "dv:p1" },
        { a: [2027, 1, 1], b: [2027, 1, 29], t: "cond", dash: true, l: "TMC 해소 지연 시 1월 말까지", ev: "dv:end" },
      ] },
      { h: "외부 선행 조건", sub: "TMC · TMKR", bars: [
        { a: [2026, 11, 18], b: [2026, 12, 31], t: "ext", dash: true, l: "HU(MM) 테스트 · VDP 서버 · ACOS API · CTI · DMS 해소 (일자 미정)", ev: "dv:blk" },
      ] },
      { h: "E2E #1", sub: "GS TC 위주", bars: [
        { a: [2026, 11, 23], b: [2026, 12, 30], t: "e2e", l: "GS TC 위주 병행 (회귀 · ACOS IF 포함)", ev: "dv:e2e1" },
      ] },
      { h: "E2E #2", sub: "e-Care", bars: [
        { a: [2026, 12, 1], b: [2027, 1, 29], t: "late", dash: true, l: "VDP 서버 정상화 후 일정 조율 (미정)", ev: "dv:e2e2" },
      ] },
    ],
    notes: ["DVT 잔여 이슈는 일정 조율을 통해 지속 관리하고 E2E는 병행 수행 (A · B 대안 비교 없이 단일 진행 기조)", "12월 중 TMC 측 선행 조건 해소 현황을 점검해 DVT 종료를 12월 말 또는 1월 말로 확정"],
  };
  // 부록: 조건부 승인 · Gate · 대안 비교 · 내부 논의 요약 제외, 공수 전제를 진행 기준으로 교체
  X.apxNew.m4 = { id: "apx-man", code: "", title: "Item2 추가 인력 산정과 진행 기준", message: "11.18 이후 DVT 잔여 대응과 E2E 병행에 필요한 개발 인력 산정임. 종료 시점(12월 말 / 1월 말)에 따라 1월분을 조정함.",
    head: ["#", "기준", "내용", "달라지면", "공수 연계"],
    rows: [
      ["1", "DVT 잔여 이슈 관리", "잔여 Fail · NT는 상태 그대로 기록, 선행 조건 해소 시 재수행", "종료 시점 재협의", "잔여 N/T 재수행 · 회귀시험 2.60"],
      ["2", "E2E 병행", "11/23 착수, 초반 GS TC 위주, e-Care는 VDP 서버 정상화 후", "E2E 일정 재조정", "E2E 대응은 영역별 담당자 내 수행"],
      ["3", "외부 선행 조건", "TMC: HU(MM) · VDP 서버 · ACOS API / TMKR: CTI · DMS", "12월 말 ↔ 1월 말", "VDP 6.80 · ACOS 5.70 · 외부시스템 9.90"],
      ["4", "범위 변경", "TC 문서 기준 신규 · 재수행 범위 확정", "근거 기준 별도 협의", "산정 제외"],
      ["5", "인력 · 청구", "대기 · 운영 15명 내외, 청구 월 10 MM(11월 5 MM)", "1월분 10.0 조정", "12월 말 종료 15.00 · 1월 말 종료 25.00"],
    ] };
  ["m1", "m2", "m3", "m5"].forEach((k) => { delete X.apxNew[k]; });

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
        go: [["i1-why", "지연 사유 · 증적"], ["i1-mm", "공수 산출 (10.10 산식)"]],
      },
      i2: {
        tag: "Item2", h: "DVT 개발 인력 유지", chip: "최신 평가 반영 · 992 TC", total: "25.00",
        kpi: [["656", "/ 992 TC Pass", "66.1%"], ["334", "잔여 NT", "Fail 2 · CCW 236 포함"], ["GS TC", "E2E 초반 위주", "e-Care는 VDP 서버 정상화 후"]],
        stance: "DVT 잔여 이슈는 일정 조율을 통해 지속 관리하고, E2E는 병행 수행합니다. 초반 E2E는 GS TC 위주로 진행합니다.",
        end: [
          { k: "12월 말 종료", c: "11월 중 TMC 측 주요 선행 조건 해소 시", mm: "15.00", d: "11월 5 + 12월 10" },
          { k: "1월 말 종료", c: "12월 중 단계적 해소 시 (현실적 일정)", mm: "25.00", d: "11월 5 + 12월 10 + 1월 10", hot: true },
        ],
        endNote: "DVT를 언제까지 해야 하는지는 TMC 측 선행 조건(HU/MM · VDP 서버 · ACOS API) 해소에 달려 있어, 12월 중 점검해 확정합니다.",
        go: [["i2-status", "현황 · 기조"], ["i2-blk", "잔여 이슈 · 종료 시점"], ["i2-man", "추가 인력"], ["i2-plan", "진행 계획"]],
      },
      ask: "요청: ① Item1 22.06 MM(콜버튼 3.86 + ACOS 8.10 + DVT 변경 · 연동 10.10) 인정 ② Item2 11/18 이후 개발 인력 월 10 MM(11월 5 MM) 인정 — DVT 종료 시점에 따라 15.00 ~ 25.00 MM",
    },
    // 고객사 증적 요청(메일) 5개 항목 대응
    evreq: {
      id: "evreq", code: "E1", title: "고객사 증적 요청 5개 항목 대응표",
      message: "고객사가 요청한 증적 5개 항목마다 이 장표에서 바로 볼 수 있는 자료와 아직 보완 중인 자료를 구분함. 자료 이름을 누르면 해당 부록으로 이동함.",
      rows: [
        { no: "1", ask: "전체 프로젝트별(GS / ACOS / 마이그레이션) 개발 인력 투입 실적", st: "part",
          have: [["sheet", "B1 월별 투입 공수 표 (GS · e-Care, 계획 vs 실제)"], ["dvt-effort", "A6 10 ~ 11월 업무 영역별 공수 (ACOS Core/Interface · Provisioning/PGM · DB/Migration · e-Care · Global South · Digital Key · Global App · 통합 Defect)"], ["effort-detail", "A2 월별 투입 공수 상세"]],
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

  base.M = M;
  base.X = X;
  return base;
};
