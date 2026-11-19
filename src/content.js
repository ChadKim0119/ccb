// Single source of truth for both the HTML page and the PPTX deck.
// Figures come from CCB v44 (2026.11.09) and the hand-off note (2026.11.11).
const fs = require("fs");
const path = require("path");
const tasks = JSON.parse(fs.readFileSync(path.join(__dirname, "tasks.json"), "utf8"));

const M = ["8월", "9월", "10월", "11월"];

const effort = {
  months: M,
  // 계약 시점 계획
  plan: [
    { team: "Global South", role: "개발", v: [7.8, 3, 0, 0] },
    { team: "Global South", role: "DVT · E2E", v: [2, 2, 2, 2], note: "8 ~ 9월 DVT, 10 ~ 11월 E2E" },
    { team: "e-Care", role: "DVT 대응 개발", v: [13.0, 0, 0, 0], split: true },
    { team: "e-Care", role: "내부 테스트 (Internal Test)", v: [3.4, 0, 0, 0], split: true },
    { team: "e-Care", role: "개발", v: [0, 7, 0, 0] },
    { team: "e-Care", role: "DVT · E2E", v: [2, 2, 0, 2], note: "8 ~ 9월 DVT, 11월 E2E" },
  ],
  // 엑셀 표 형식(월별 투입 공수)용 계획 행. DVT와 E2E를 원본처럼 분리
  planGrid: [
    { cat: "dev", team: "Global South", role: "개발", v: [7.8, 3, 0, 0], act: 1, work: ["Global South DVT(08.01 ~ 08.31) 대응 개발: 시험 중 발견된 결함 수정 · 재배포", "DVT 이후 결함 수정 마무리 및 e-Care DVT(09.01 ~ 09.30) 연동 대응"] },
    { cat: "dvt", team: "Global South", role: "DVT (2026.08 ~ 09)", v: [2, 2, 0, 0], act: 2, work: ["Global South DVT 시험 수행 (계약 기준 08.01 ~ 08.31)", "DVT 결함 재시험 및 e-Care DVT 연계 시험"] },
    { cat: "e2e", team: "Global South", role: "E2E (Kensho, Goguchi)", v: [0, 0, 2, 2], act: 2, work: [null, null, "DVT 완료 후 E2E(Kensho) 대응 최소 인력", "E2E(Kensho · Goguchi) 대응 최소 인력"] },
    { cat: "dev", team: "e-Care", role: "개발 · DVT 대응", v: [13.0, 0, 0, 0], tag: "8월 16.4 중 13.0", act: 3, work: ["e-Care DVT 진입 준비와 DVT 대응 개발 (신규 기능 개발이 아닌 DVT 대응 배정 인력)"] },
    { cat: "dev", team: "e-Care", role: "개발 · 내부 테스트 (Internal Test)", v: [3.4, 0, 0, 0], tag: "8월 16.4 중 3.4", act: 3, work: ["DVT 진입 전 내부 테스트 (Internal Test)"] },
    { cat: "dev", team: "e-Care", role: "개발", v: [0, 7, 0, 0], act: 3, work: [null, "e-Care DVT(09.01 ~ 09.30) 대응 개발: 시험 중 발견된 결함 수정 · 재배포"] },
    { cat: "dvt", team: "e-Care", role: "DVT (2026.08 ~ 09)", v: [2, 2, 0, 0], act: 4, work: ["e-Care DVT 시험 준비 (시험 항목 · 환경 준비)", "e-Care DVT 시험 수행 (계약 기준 09.01 ~ 09.30)"] },
    { cat: "e2e", team: "e-Care", role: "E2E (Kensho, Goguchi)", v: [0, 0, 0, 2], act: 4, work: [null, null, null, "E2E(Kensho · Goguchi) 대응 최소 인력"] },
  ],
  planTotal: [28.2, 14, 2, 4],
  // 실제 변경 일정 및 인력 투입
  actual: [
    { cat: "ux", team: "기획 / 디자인", role: "UX/GUI", v: [1, 1, 1, 0] },
    { cat: "dev", team: "Global South", role: "개발", v: [6, 6.1, 4, 4] },
    { cat: "dvt", team: "Global South", role: "품질", v: [2, 2, 2, 2] },
    { cat: "dev", team: "e-Care", role: "개발", v: [14, 13.2, 9, 9] },
    { cat: "dvt", team: "e-Care", role: "품질", v: [3, 2, 2, 2] },
  ],
  actualTotal: [26, 24.3, 18, 17],
  // 계약 대비 순증
  delta: [
    { team: "기획 / 디자인", role: "UX/GUI", v: [1, 1, 1, 0] },
    { team: "Global South", role: "개발", v: [-1.8, 3.1, 4, 4] },
    { team: "Global South", role: "품질", v: [0, 0, 0, 0] },
    { team: "e-Care", role: "개발", v: [-2.4, 6.2, 9, 9] },
    { team: "e-Care", role: "품질", v: [1, 0, 2, 0] },
  ],
  deltaTotal: [-2.2, 10.3, 16, 13],
  // 변경 후 실제 수행 업무 (실제 행 기준, 월별)
  actualWork: {
    dev: ["ACOS 최종 규격(07.27) 기준 Gap 분석(08.03 ~ 07) 후 {scope} 변경 개발 · 내부 테스트", "{scope} ACOS 규격 변경 개발 지속(~ 09.30) 및 DVT 진행을 위한 내부 테스트", "이월된 DVT 대응 개발: 1 · 2차 시험 결함 수정 · 재배포", "이월된 DVT 대응 개발: 2차 결함 수정 반영(11.03 ~ 10), 3차 시험 대응"],
    dvt: ["DVT 순연으로 변경 개발분 내부 테스트와 DVT 시험 준비", "변경 개발분 내부 테스트 및 DVT 일정 조율 (09.15 · 09.22 일정 변경 서면 공유)", "이월된 DVT 수행: 시험 환경 준비, 1차 시험(GS, 10.15 ~ 20), 2차 시험(GS + e-Care, 10.21 ~ 30)", "이월된 DVT 수행: 2차 시험 리뷰(11.02), 3차 시험(11.11 ~ 16), DVT 종료(11.17)"],
  },
  work: {
    plan: ["Global South DVT (계약 기준 08.01 ~ 08.31)", "e-Care DVT (계약 기준 09.01 ~ 09.30)", "E2E 대응 최소 인력", "E2E 대응 최소 인력"],
    actual: [
      "최종 규격(07.27) 기준 Gap 분석(08.03 ~ 07), ACOS 규격 반영 변경 개발 (Global South 12개 항목)",
      "변경 개발 지속(~ 09.30), DVT 진행을 위한 내부 테스트(신규). 09.15 · 09.22 DVT 일정 변경 서면 공유",
      "DVT 착수(10.06). 시험 환경 준비(White list · VDP 연동 확인), 1차 시험(GS, 10.15 ~ 20), 2차 시험(GS + e-Care, 10.21 ~ 30)",
      "2차 시험 리뷰(11.02), 2차 수정 반영(11.03 ~ 10), 3차 시험(11.11 ~ 16), 최종 리뷰 및 DVT 종료(11.17). 11.09 기준 투입 및 투입 예정",
    ],
  },
  periods: [
    { label: "8 ~ 9월", plan: 42.2, actual: 50.3, delta: 8.1, planWork: "DVT 수행 · 대응", actualWork: "ACOS 규격 변경 개발 · 내부 테스트" },
    { label: "10 ~ 11월", plan: 6.0, actual: 35.0, delta: 29.0, planWork: "E2E 대응 최소 인력", actualWork: "이월된 DVT 수행 (1 ~ 3차 시험)" },
  ],
  total: { plan: 48.2, actual: 85.3, delta: 37.1 },
  split: {
    title: "8월 e-Care 계획 16.4 MM의 구성",
    parts: [
      { label: "DVT 대응 개발", v: 13.0 },
      { label: "내부 테스트 (Internal Test)", v: 3.4 },
    ],
    note: "8월 e-Care 계획 인력 16.4 MM은 신규 기능 개발이 아니라 DVT 대응과 내부 테스트를 위해 배정된 인력임",
  },
  notes: [
    "기획 3 MM(8 · 9월 2 MM, 10월 1 MM)은 37.10 MM에 포함. 8 · 9월은 DMS 요청, 요금제 변경, 운영유지보수 팀 요청 반영, 10월은 계획에 없던 변경 반영분",
    "11월은 11.09 기준 투입 및 투입 예정 공수",
    "VDP · PGM 개발 지연으로 미시험(N/T) 항목이 남을 경우 DVT 기간이 추가될 수 있음",
  ],
};

const schedule = {
  axis: { start: [2026, 6], months: 8 }, // 2026.06 ~ 2027.01
  rows: [
    { id: "gs", label: "Global South", ghost: { from: [2026, 8, 1], to: [2026, 8, 31], label: "기존 DVT 기간" } },
    { id: "ec", label: "e-Care", ghost: { from: [2026, 9, 1], to: [2026, 9, 30], label: "기존 DVT 기간" } },
  ],
  // plan/changed = [from, to] as [year, month, day]; null = the bar does not exist in that mode
  bars: [
    { id: "gs-dev", row: "gs", track: 0, kind: "base", planLabel: "Development (~ 7월)", changedLabel: "Development (~ 7월)", plan: [[2026, 6, 1], [2026, 7, 31]], changed: [[2026, 6, 1], [2026, 7, 27]], openLeft: true },
    { id: "gs-chg", row: "gs", track: 0, kind: "add", changedLabel: "변경 개발", plan: null, changed: [[2026, 7, 28], [2026, 8, 31]], panel: "chgdev", order: 1 },
    { id: "gs-it", row: "gs", track: 0, kind: "add", changedLabel: "내부 테스트", plan: null, changed: [[2026, 9, 1], [2026, 9, 30]], panel: "delay", order: 2 },
    { id: "gs-dvt", row: "gs", track: 0, kind: "dvt", planLabel: "DVT (8월)", changedLabel: "DVT 10.06 ~ 11.17", plan: [[2026, 8, 1], [2026, 8, 31]], changed: [[2026, 10, 6], [2026, 11, 17]], panel: "dvt", order: 3 },
    { id: "gs-e2e", row: "gs", track: 1, kind: "e2e", planLabel: "Pre-Prod. E2E (5M)", changedLabel: "Pre-Prod. E2E (3M)", plan: [[2026, 9, 1], [2027, 1, 31]], changed: [[2026, 11, 1], [2027, 1, 31]], order: 4 },
    { id: "ec-dev", row: "ec", track: 0, kind: "base", planLabel: "Development (~ 8월)", changedLabel: "Development (~ 8월)", plan: [[2026, 6, 1], [2026, 8, 31]], changed: [[2026, 6, 1], [2026, 8, 31]], openLeft: true },
    { id: "ec-chg", row: "ec", track: 1, kind: "add", changedLabel: "변경 개발", plan: null, changed: [[2026, 7, 28], [2026, 8, 31]], panel: "chgdev", order: 1 },
    { id: "ec-it", row: "ec", track: 0, kind: "add", changedLabel: "내부 테스트", plan: null, changed: [[2026, 9, 1], [2026, 9, 30]], panel: "delay", order: 2 },
    { id: "ec-dvt", row: "ec", track: 0, kind: "dvt", planLabel: "DVT (9월)", changedLabel: "DVT 10.06 ~ 11.17", plan: [[2026, 9, 1], [2026, 9, 30]], changed: [[2026, 10, 6], [2026, 11, 17]], panel: "dvt", order: 3 },
    { id: "ec-e2e", row: "ec", track: 1, kind: "e2e", planLabel: "Pre-Prod. E2E #1 (4M)", changedLabel: "Pre-Prod. E2E #1 (3M)", plan: [[2026, 10, 1], [2027, 1, 31]], changed: [[2026, 11, 1], [2027, 1, 31]], order: 4 },
  ],
  strip: {
    label: "투입 인력의 수행 업무",
    blocks: [
      { from: [2026, 8, 1], to: [2026, 9, 30] },
      { from: [2026, 10, 1], to: [2026, 11, 30] },
    ],
  },
  marker: { d: [2026, 7, 28], label: "07.28 ACOS 규격 배포" },
  dvtWindow: { from: [2026, 10, 6], to: [2026, 11, 17], label: "DVT 2026.10.06 ~ 11.17 (1.5M)" },
  steps: [
    { n: 1, title: "07.28 ACOS 규격 배포", body: "최종 규격 07.27 수신. 34개 API 중 33건 변경 대응", panel: "spec" },
    { n: 2, title: "ACOS · VDP · PGM 준비 지연", body: "TMC 시험 환경 준비 지연으로 DVT 일정 조율. 09.15 · 09.22 서면 공유", panel: "vdp" },
    { n: 3, title: "9월 내부 테스트", body: "변경 규격 기준 DVT 진행을 위한 사전 검증 (신규)", panel: "delay" },
    { n: 4, title: "DVT 최종 변경", body: "2026.10.06 ~ 11.17 (1.5M), GS · e-Care 통합 1 ~ 3차 시험", panel: "dvt" },
  ],
  bridge: "같은 인력이 8 ~ 9월에는 변경 개발을, 10 ~ 11월에는 이월된 DVT를 수행했습니다",
  compare: [
    ["Global South DVT (System Test)", "2026.08.01 ~ 08.31", "2026.10.06 ~ 11.17"],
    ["e-Care DVT (System Test)", "2026.09.01 ~ 09.30", "2026.10.06 ~ 11.17"],
    ["Global South Pre-Prod", "2026.09.01 ~ 2027.01.31", "2026.11.01 ~ 2027.01.31"],
    ["e-Care Pre-Prod", "2026.10.01 ~ 2027.01.31", "2026.11.01 ~ 2027.01.31"],
    ["ACOS Kensho E2E", "2026.07.16 ~ 2027.01.31", "2026.11.01 ~ 2027.01.31"],
    ["24DCM Pre-Prod Regression Test", "– (신규 추가)", "2026.11.01 ~ 2027.01.31"],
  ],
  delay: {
    title: "9월 내부 테스트와 DVT 일정 조율",
    items: [
      ["9월", "변경 규격을 반영한 개발분에 대해 DVT 진행을 위한 내부 테스트 수행 (계약 계획에 없던 신규 작업)"],
      ["09.15", "TMC VDP 서버 정보 제공 지연(10.05 예정) 및 DMS 연동 미완료에 따라 DVT 일정 조정을 서면 요청"],
      ["09.22", "DVT 10.06 이동 및 ACOS API 4차 테스트 결과(36건 중 19건 성공)를 서면 공유"],
      ["10.04", "TMC 기준 변경 일정 확정. DVT 2026.10.06 ~ 11.17 (1.5개월)"],
    ],
  },
  why: [
    { when: "계약 기준", text: "8월 Global South DVT, 9월 e-Care DVT. 8 ~ 9월 계획 인력 42.2 MM은 DVT 수행 · 대응에 배정" },
    { when: "07.27", text: "ACOS 최종 규격 수신. 변경 규격을 반영하는 개발이 선행되어야 하여 DVT 순연" },
    { when: "8 ~ 9월", text: "DVT에 배정된 인력이 변경 개발과 내부 테스트 수행. 실투입 50.3 MM (계약 대비 +8.10 MM)" },
    { when: "10 ~ 11월", text: "TMC VDP · PGM 시험 환경 준비 지연으로 DVT가 10.06 ~ 11.17로 확정. 이월된 DVT 수행에 35.0 MM 투입 (계약 대비 +29.00 MM)" },
  ],
};

const summary = {
  headline: "ACOS 규격 확정 지연으로 DVT 계획 인력이 변경 개발을 먼저 수행했고, 이월된 DVT를 10 ~ 11월에 수행했습니다",
  ask: "계약 대비 순증 37.10 MM에 대한 검토 및 협의를 요청드립니다",
  frame: {
    title: "본 공수는 인력 대기 비용이 아닙니다",
    body: "8 ~ 9월에는 ACOS 규격 변경 개발과 내부 테스트를, 10 ~ 11월에는 이월된 DVT를 실제로 수행한 투입 공수입니다",
  },
  equation: [
    { v: "8.10", unit: "MM", label: "8 ~ 9월", desc: "ACOS 규격 변경 개발 · 내부 테스트" },
    { v: "29.00", unit: "MM", label: "10 ~ 11월", desc: "이월된 DVT 수행 (1 ~ 3차 시험)" },
    { v: "37.10", unit: "MM", label: "계약 대비 순증", desc: "2026.08 ~ 11, Global South · e-Care" },
  ],
  steps: [
    { n: 1, tag: "원인", title: "ACOS 최종 규격 확정 지연", body: "04.20 최초 규격(34개 API) 수령 후 06.28에 24개, 07.27 최종 규격에서 9개가 추가 변경됨. Global South 개발 범위의 약 60%가 재검토 · 수정 · 재검증 대상", panel: "spec", link: "규격 배포 이력" },
    { n: 2, tag: "8 ~ 9월", title: "DVT 계획 인력이 변경 개발 · 내부 테스트 수행", body: "변경 규격 반영 개발(Global South 12개 항목, 162 MD)이 선행되어야 하여 DVT(GS 8월 · e-Care 9월)가 순연됨. 해당 기간 계획 인력 42.2 MM이 변경 개발과 내부 테스트를 수행했고 실투입은 50.3 MM", panel: "chgdev", link: "변경 개발 12개 항목" },
    { n: 3, tag: "10 ~ 11월", title: "이월된 DVT를 10.06 ~ 11.17에 수행", body: "TMC VDP · PGM 시험 환경 준비 지연으로 DVT가 10.06 ~ 11.17(1.5개월)로 확정됨. 계약상 E2E 대응 최소 인력 6.0 MM만 계획된 기간에 DVT 1 ~ 3차 시험을 수행하여 35.0 MM 투입", panel: "dvt", link: "DVT 수행 일정" },
  ],
  principle: {
    title: "산정 원칙",
    lead: "수행 과업이 있는 투입만 산정했습니다. 대기 공수는 포함하지 않았습니다",
    items: [
      { k: "계약 대비 순증만 산정", v: "월별 계획과 실제 투입을 대조하여 차이만 반영. 8월 감소분 −2.2 MM 상계" },
      { k: "ACOS 개발분 제외", v: "ACOS는 별도 계약. Global South · e-Care 영향분에 한정" },
      { k: "LGU+ 자체 감수", v: "ACOS 전환 · e-Care 규격 대응은 일정 · 인력 변경 없이 자체 감수" },
      { k: "12월 이후 제외", v: "10 ~ 11월 DVT 대응까지만 산정. E2E · Migration 공수 제외" },
      { k: "VDP 재작업 미포함", v: "Endpoint 변경에 따른 수정 개발 · 재검증은 TMC 최종 사양 확정 후 별도 협의" },
    ],
  },
  status: [
    { k: "투입 증적은 상세 검토 중", v: "실제 투입 인력에 대한 증적은 현재 상세 검토 중입니다" },
    { k: "11월분은 실적으로 확정", v: "11월 13 MM은 투입 예정을 포함한 값이므로, DVT 종료(11.17) 후 실적 기준으로 확정합니다" },
    { k: "비용 제시가 늦어진 사유", v: "추가 공수 발생은 07.21 PM 정례회의부터 공유했습니다. 금액은 실제 투입 내역을 확인해 제시하기로 하여 제시 시점이 늦어졌습니다",
        facts: [
          ["07.21", "ACOS 스펙 확정 지연에 따른 추가 공수 건을 CCB에 등재"],
          ["07.29", "비용 분담 논의는 공수 산정 완료 후 진행하기로 함"],
          ["10.21", "실제 개발자 투입 수준까지 확인해 산정 근거를 작성하기로 함"],
          ["11.03", "월별 계획 대비 실제 투입과 수행 업무 기준으로 재정리하기로 함"],
        ], panel: "notice", link: "공유 이력과 출처 보기" },
  ],
};

const appendix = {
  history: {
    id: "history", code: "A1", title: "경과 및 공유 이력",
    message: "ACOS 스펙 확정 지연에 따른 추가 공수 발생과 CCB 등재는 07.21 PM 정례회의부터 공유되었고, 금액은 실제 투입 내역 확인 후 제시함",
    sourceNote: "PM 정례회의는 TMKR 사무실에서 TMKR · LGU+가 참석한 주간 회의이며, 회의록은 프로젝트 Confluence에 등록되어 있음",
    rows: [
      ["04.20", "규격", "TMC로부터 최초 ACOS API · 프로토콜 규격(Excel) 수령, 3개 과제 연동 개발 착수 (34개 API)", "TMC 배포"],
      ["06.23", "기획", "최초 정책 확정. 이후 10월까지 화면 정의서 18회, 57건 변경 반영", "화면 정의서"],
      ["06.28", "규격", "TMC ACOS API Portal에 변경 규격 배포 (34개 API 중 24개 변경)", "TMC 배포"],
      ["07.03", "규격", "TMC · TMKR · LGU+ 컨퍼런스콜. 변경 범위 및 최종 배포 일정 공식 요청", "컨퍼런스콜"],
      ["07.06", "규격", "TMC, 최종 규격 배포일 07.27 안내", "TMC 안내"],
      ["07.08", "공수", "변경 관리(CCB) 절차 초안 공유. Global South 개발 완료를 8월 말로, 시스템 테스트를 9월로 조정하는 방안 논의", "PM 정례회의 회의록"],
      ["07.14", "일정", "ACOS 인터페이스 변경(07.27 확정 예정) 등 개발 스펙 확정 지연으로 개발 기간을 7월 말에서 8월 말로, DVT 착수를 8월에서 9월로 조정. 기존 개발분 재개발 영향 확인을 이슈로 등록", "PM 정례회의 회의록"],
      ["07.21", "공수", "ACOS 스펙 확정 지연으로 개발 완료가 8월로 이동하고 추가 공수가 발생하는 건을 CCB에 등재. CCB 절차 진행 확정", "PM 정례회의 회의록, CCB 등록 건 CHGE-21"],
      ["07.27", "규격", "최종 규격 수신 (9개 API 추가 변경). 이후에도 Service Flag 등 변경 지속", "TMC 배포"],
      ["07.29", "공수", "07.27 규격 수령 후 갭 분석 진행, CCB 1건(ACOS 연동 개발 범위 변경) 등록, Global South 영향도 약 60% 공유. 비용 분담 논의는 공수 산정 완료 후 진행하기로 함", "PM 정례회의 회의록"],
      ["08.03 ~ 07", "규격", "최종 규격 기준 Gap 분석 및 상세 변경 공수 산정", "CCB 등록 건 CHGE-21"],
      ["08.10", "규격", "Digital Key 미지원 환경 대응을 한국 Local App 개발 범위에서 제외하기로 협의", "협의"],
      ["08.12", "공수", "08.07 갭 분석 제출 완료를 공유. 결과는 정리 후 공유하기로 함", "PM 정례회의 회의록"],
      ["08.19", "일정", "07.27 이후 API 변경은 변경 건으로 이력 관리하기로 함. DVT 일정 재조정 필요성 논의", "PM 정례회의 회의록"],
      ["08.26", "일정", "TSC · VDP · Digital Key 등 외부 시스템 연동 준비 미비로 09.01 착수가 어려워 DVT 착수 일정 재검토 (Global South 09.21, e-Care 10.05 이후)", "PM 정례회의 회의록"],
      ["09.02", "일정", "API 오픈 지연과 외부 연동 병목으로 DVT를 3차수로 분할하는 계획 수립 (1차 Global South 중심, 2차 Bug Fix + e-Care, 3차 미진 항목)", "PM 정례회의 회의록"],
      ["09.15", "일정", "TMC VDP 서버 정보 제공 지연(10.05 예정) 및 DMS 연동 미완료에 따라 DVT 일정 조정 요청", "서면"],
      ["09.21", "일정", "TMC와 DVT 착수 일정 조율, 10월 초 착수 기준으로 재계획", "PM 정례회의 회의록"],
      ["09.22", "일정", "DVT 10.06 이동 및 ACOS API 4차 테스트 결과(36건 중 19건 성공) 공유", "서면"],
      ["09.30", "공수", "DVT 재계획(1차 10.06, 11월 중순 완료 목표) 공유. 변경 관리 후보 항목으로 DVT 일정 시프트를 공유", "PM 정례회의 회의록"],
      ["10.04", "일정", "TMC 기준 변경 일정 확정. DVT 2026.10.06 ~ 11.17", "TMC 일정"],
      ["10.06", "일정", "DVT 착수. TMC 제공 IP 기준 VDP 접속 시험 9건 전건 Timeout", "시험 기록"],
      ["10.07 ~ 21", "일정", "VDP 플래그 시험 지연과 DCM ADF · VDP · CTI 제약으로 e-Care 일부 항목 미수행. 2차 DVT를 10.21 착수하고 미수행 항목은 3차로 이관", "PM 정례회의 회의록"],
      ["10.21", "공수", "ACOS 규격 변경 등 추가 개발 건의 비용을 실제 개발자 투입 수준까지 확인하여 산정 근거를 작성하기로 함. 11.20 중간보고 전 합의를 목표로 협의 일정 수립", "PM 정례회의 회의록"],
      ["10.27", "일정", "정정된 /v1 Endpoint 기준 시험. VDP 정상 응답 미확인", "시험 기록"],
      ["11.03", "일정", "DVT 2차 결과 공유 (약 850건 중 520 Pass, 8 Fail, 약 300 N/T). 3차 DVT 11.11 착수 확정", "PM 정례회의 회의록"],
      ["11.03", "공수", "CCB 실무 검토. 추가 공수 발생은 인정하되, 월별 계획 MM과 실제 투입 MM을 비교하고 DVT 지연 기간 중 수행 업무를 확인해 실제 추가분 기준으로 재정리하기로 함", "PM 정례회의 회의록"],
      ["11.07", "공수", "CCB 안건으로 추가 공수 협의 요청", "CCB 안건 자료"],
    ],
  },
  effortDetail: {
    id: "effort-detail", code: "A2", title: "월별 투입 공수 상세",
    message: "계약 시점 계획 48.2 MM 대비 실제 85.3 MM이 투입되어 37.10 MM이 순증함",
  },
  spec: {
    id: "spec", code: "A3", title: "ACOS 규격 배포 이력 및 개발 범위 영향",
    message: "TMC 최종 규격 배포가 지연되고 변경 규격이 두 차례 배포되어 Global South 개발 범위의 약 60%가 재검토 대상이 됨",
    api: [
      { when: "2026.04 최초 규격", big: "34개", small: "API 기준" },
      { when: "2026.06.28 변경 규격", big: "24개 변경", small: "동일 10개" },
      { when: "2026.07.27 최종 규격", big: "9개 변경", small: "동일 25개" },
    ],
    apiNote: "최종 34개 API. 1차 24개 + 2차 9개 = 총 33건 변경 대응. 07.27 이후에도 API 변경 발생",
    scope: [
      { pct: 40, label: "직접 연동", desc: "Provisioning · API 요청/응답 · Service Flag · Callback", hit: true },
      { pct: 20, label: "간접 영향", desc: "Backend 연동 · 이력 · OPW · E2E", hit: true },
      { pct: 40, label: "비연동", desc: "Deep Link · 독립 App 화면 (영향 없음)", hit: false },
    ],
    scopeNote: "전체 개발 범위의 약 60%가 재검토 · 수정 · 재검증 대상",
    result: [
      "ACOS 전환 · e-Care: 일정 · 인력 변경 없이 LGU+ 자체 감수",
      "Global South: 최종 규격 Gap 분석, 수정 개발 및 재검증을 위해 일정 조정 및 개발 인력 추가 투입",
    ],
  },
  chgdev: {
    id: "chgdev", code: "A4", title: "8 ~ 9월 변경 개발 12개 항목",
    message: "변경 규격 반영을 위해 Global South 12개 항목을 수정 · 추가 개발함. 162 MD (8.10 MM), 2026.07.28 ~ 09.30",
    items: [
      { no: "2.1", name: "ADF Result Notification (Vehicle Info 연계 Chaining)", type: "기능 추가", md: 15,
        as: "ADF Result Notification 수신 → 결과 처리 · 저장 후 종료되는 단독 처리 구조",
        to: "Notification 수신 후 차량정보 조회 → VehicleInfo Mapping → Upsert VehicleInfo 호출로 이어지는 Chaining 구조",
        impact: "후속 처리 조건 · 차량 정보 조회 로직 추가, VehicleInfo 재구성 · Mapping 및 Upsert 호출 연계, 성공/실패 · 예외 처리, Logging, 연계 테스트 추가" },
      { no: "2.2", name: "Provisioning – Opt In/Out Request", type: "기능 변경", md: 15,
        as: "OneServer 기반 Service Flag 규격으로 가입/해지 상태를 판단하여 Provisioning 정보 생성",
        to: "ACOS ServiceFlagSetting 기준 Mapping으로 전환. 신규 Flag 다수 추가, 일부 기존 Flag 제외 (URL · Path · Parameter · Request/Response Body · 구조 변경)",
        impact: "신규/삭제 Service Flag 처리, 내부 Service–ACOS Flag Mapping 및 Opt In/Out 판단 로직 수정, DTO · Provisioning 생성 로직 수정, 변경 사양 기준 재시험" },
      { no: "2.3", name: "Get Opt In/Out Information", type: "수정 개발", md: 15,
        as: "OneServer Service Flag 정의 기준으로 Opt In/Out 상태를 조회 · 응답",
        to: "ACOS ServiceFlagSetting 규격에 맞춰 조회 결과를 신규 Service Flag 구조로 변환하여 응답",
        impact: "URL/Path/Parameter · Request/Response 구조 수정, 신규 Flag 적용 · 삭제 Flag 제거, Mapping · Response 생성 로직 · DTO · Validation 수정, 회귀 테스트" },
      { no: "2.4", name: "Get Capable Service Flag", type: "수정 개발", md: 15,
        as: "차량 · 계약 정보 기반으로 기존 Service Flag를 조회해 이용 가능 서비스를 판단",
        to: "ServiceFlagSetting 항목 · 구조 변경으로 서비스 가능 여부 판단 기준이 변경",
        impact: "판단 대상 Flag 변경, 신규 Flag 적용 · 삭제 Flag 제외, Request/Response 구조 · Mapping · 판단 로직 수정, 변경 Flag 조합 기준 재시험" },
      { no: "2.5", name: "NotificationDelivery – Get Notification", type: "수정 개발", md: 10,
        as: "초기 NotificationDelivery 규격의 필드(VinList · Country · GroupCondition 등) 기준으로 DTO · Mapping · 조회 로직 구현",
        to: "최종 규격에서 데이터 구조가 변경되어 NotificationId · DestinationFilter · NotificationInformation · PushInformation 등 신규/변경 항목 기반으로 조회",
        impact: "URL/Parameter 변경, Request · Response DTO 변경, 신규 Nested Object 정의, 기존 필드 삭제, Mapping · Response 생성 로직 수정, 기존 개발분 회귀 테스트" },
      { no: "2.6", name: "NotificationDelivery – Update Notification", type: "수정 개발", md: 10,
        as: "ACOS-GC 규격이 정의되지 않은 상태에서 OneServer 규격(29개 필드) 기준으로 수신 → 검증 → 저장 로직 구현",
        to: "7월 말 사양 확정으로 Request Body 구조 변경 (NotificationId · ScheduledSendDateTime · NextPageToken · Message Info · Deeplink 등)",
        impact: "Request Body 재정의, DTO · Validation · Mapping Logic 수정, 저장/변환 로직 수정, 기존 필드 제거, API 단위 테스트 및 연계 회귀 테스트" },
      { no: "2.7", name: "NotificationDelivery – Create Notification", type: "기능 변경", md: 10,
        as: "ACOS-GC 규격이 정의되지 않은 상태에서 OneServer 규격의 Notification 필드로 생성 로직 구현",
        to: "7월 말 사양 확정으로 생성 절차가 대상 지정(DestinationFilter) → 정보 구성 → Push/In-App 구성 → 생성으로 변경",
        impact: "Request/Response 구조 · 생성 데이터 Mapping 변경, 기존 필드 처리 제거, DestinationFilter · Push · In-App 처리 추가, Business Logic 변경, 테스트 케이스 재작성" },
      { no: "2.8", name: "Vehicle Information – Associate / Dissociate / Upsert (1 → 6개 API)", type: "구조 변경", md: 35,
        as: "OneServer 연계와 유사한 단일 API(register-request) 중심 구조로 분석. Local App B/E ↔ WAM 호출도 단일 Flow로 설계",
        to: "register-request 1개가 Vehicle 등록 · VehicleImage Upsert · Administrator 등록/삭제 · ShareUser 등록/삭제 5개로 분할되고 search-request 조회가 추가되어 총 6개 API 구조",
        impact: "API 호출 구조 분리, Local App B/E 호출 로직 · WAM Orchestration 수정, 호출 조건 수정, Upsert VehicleImage Parameter 변경, Validation · Logging 추가, API별 결과 · 오류 처리 수정" },
      { no: "2.9", name: "Warning Notification (위치정보 항목 제거)", type: "수정 개발", md: 10,
        as: "Request에 위치정보(PositionInformation · Latitude · Longitude)가 포함되어 WAM에서 차량 위치를 조회 · 수신하고 Mapping하여 전송",
        to: "7월 말 최종 Spec에서 위치정보 항목 제거. 해당 데이터를 조회 · 조합 · 저장하던 기존 로직 정리",
        impact: "위치정보 Parameter 처리 제거 및 DTO 변경, DBMS 컬럼 조정, Mapping · Validation 로직 변경, 조회/조합 · 예외 처리 수정, 변경 Spec 기준 연계 테스트" },
      { no: "2.10", name: "Digital Key – 미지원 환경 Local App / Deep Link", type: "범위 제외", md: 10,
        as: "Digital Key 사용 불가 Web/OS 환경에 Local App 안내 화면 제공 및 Deep Link 연계를 개발 범위에 포함하여 분석 (07.10 JIRA 작업 추가)",
        to: "08.10 최종 협의에서 한국 Local App 개발 범위에서 제외",
        impact: "범위 확정 이전에 수행한 GSP/TLSC 분석, Local App 영향도 분석, Deep Link 검토 선행 작업분" },
      { no: "2.11", name: "Valet Mode – ValetModeMobile Flag Provisioning", type: "신규 개발", md: 5,
        as: "Provisioning 개발 범위 및 v1.1.2 기획서에 ValetModeMobile Flag를 별도 ON 처리하는 항목 없음",
        to: "특정 조건에서 ValetModeMobile Flag를 ON으로 설정하여 ACOS로 전달하는 요구사항 추가 (07.13 JIRA 등록)",
        impact: "기존 Provisioning Framework에 신규 Flag와 설정 조건(가입/활성 상태 판단) 추가" },
      { no: "2.12", name: "OPW Provisioning 화면 기획 변경", type: "기능 변경", md: 12,
        as: "v1.1.2 화면기획서 및 당시 협의된 GUI 기준으로 OPW Provisioning 화면(상세 정보 · 상세 보기 · Service Flag 설정) F/E · B/E 설계 · 개발",
        to: "Figma 및 최종 화면기획(13.1.1.4 서비스 플래그 설정 변경) 기준으로 3개 화면 변경",
        impact: "F/E Layout · Component · 표시 방식 · Flow · Validation 수정, B/E 조회 API · 데이터 구조 · Business Logic 수정" },
    ],
    byType: "수정 개발 5건 60 MD · 구조 변경 1건 35 MD · 기능 변경 3건 37 MD · 기능 추가 1건 15 MD · 범위 제외 · 신규 개발 2건 15 MD",
    notes: [
      "본 공수는 ACOS 개발분이 아닌 Global South · e-Care 측 영향분만 산정함. ACOS는 별도 계약임",
      "2.10 Digital Key는 2026.08.10 협의로 개발 범위에서 제외되었으며, 범위 확정 이전에 수행한 분석 · 검토 선행 작업분임",
      "2.12 OPW 화면 기획 변경은 기존 협의사항으로, 추가 반영 여부는 별도 협의 대상임",
    ],
  },
  dvt: {
    id: "dvt", code: "A5", title: "DVT 일정 변경 및 수행 일정",
    message: "DVT 기간(2026.10.06 ~ 11.17) 동안 시험 차수별로 GS · e-Care 개발 인력이 결함 분석 · 수정 · 재시험을 수행함",
    background: "DVT는 07.28 규격 확정 이후 9월에 추진할 계획이었으나, TMC의 VDP · PGM 개발 일정 지연으로 테스트 환경 구성이 불가하여 10 ~ 11월로 변경됨",
    weeks: ["10.05", "10.12", "10.19", "10.26", "11.02", "11.09", "11.16"],
    stages: [
      { name: "시험 환경 준비", period: "10.06 ~ 10.20", target: "GS · e-Care", work: "White list 처리, VDP 연동 확인, VDP Flag 시험 셋팅", cells: [1, 1, 1, 0, 0, 0, 0] },
      { name: "1차 시험", period: "10.15 ~ 10.20", target: "GS", work: "GS 항목 시험 및 결함 수정", cells: [0, 1, 1, 0, 0, 0, 0] },
      { name: "2차 시험", period: "10.21 ~ 10.30", target: "GS + e-Care", work: "GS · e-Care 통합 시험 및 결함 분석", cells: [0, 0, 1, 1, 0, 0, 0] },
      { name: "2차 시험 리뷰", period: "11.02", target: "GS + e-Care", work: "시험 결과 리뷰 및 수정 범위 확정", cells: [0, 0, 0, 0, 2, 0, 0] },
      { name: "2차 수정 반영", period: "11.03 ~ 11.10", target: "GS + e-Care", work: "결함 수정 및 재배포", cells: [0, 0, 0, 0, 1, 1, 0] },
      { name: "3차 시험", period: "11.11 ~ 11.16", target: "2차 결함 항목", work: "2차 결함 항목 재시험", cells: [0, 0, 0, 0, 0, 1, 1] },
      { name: "3차 시험 리뷰", period: "11.17", target: "GS + e-Care", work: "최종 결과 리뷰 및 DVT 종료", cells: [0, 0, 0, 0, 0, 0, 2] },
    ],
    scope: [
      { k: "Global South", v: "Provisioning · Capability · GS 서비스 연계 시험 결함 수정" },
      { k: "e-Care", v: "VDP/VEP Event · Workflow/Case · DMS/CCW 연계 시험 결함 수정" },
      { k: "공통", v: "ACOS Core/Interface · DB 정합성 · 통합 Defect 분석 및 재시험 지원" },
    ],
    regression: "24DCM Pre-Prod Regression Test 추가. OneServer → ACOS 전환에 따른 기존 24DCM 기능 영향을 검증하며, ACOS E2E와 Regression이 모두 정상 완료된 경우에만 Migration 단계로 진행",
    note: "주 단위(월 ~ 일), 마지막 주는 11.17까지. 출처: DVT 개발 인력 계획(2026.10.20). VDP 연동 현황에 따라 일정 조정 가능",
  },
  dvtEffort: {
    id: "dvt-effort", code: "A6", title: "10 ~ 11월 DVT 투입 공수 및 업무",
    message: "DVT 기간(1.5개월) 동안 35 MM이 필요하며, 기존 계획 6 MM 대비 29 MM을 추가 투입함",
    table: {
      head: ["구분", "과제", "2026.10", "2026.11", "합계 (MM)"],
      rows: [
        ["변경 계획 (DVT 대응)", "기획 (UX/GUI)", "1", "–", "1.00"],
        ["", "Global South", "6", "6", "12.00"],
        ["", "e-Care", "11", "11", "22.00"],
        ["", "소계", "18", "17", "35.00"],
        ["기존 계획 (E2E 대응)", "Global South", "2", "2", "4.00"],
        ["", "e-Care", "–", "2", "2.00"],
        ["", "소계", "2", "4", "6.00"],
        ["기존 계획 대비 추가", "기획 (UX/GUI)", "1", "–", "1.00"],
        ["", "Global South", "4", "4", "8.00"],
        ["", "e-Care", "11", "9", "20.00"],
        ["추가 공수 합계", "", "16", "13", "29.00"],
      ],
    },
    basis: [
      "10 ~ 11월 DVT 대응 공수만 산정. 12월 이후 E2E · Migration 공수는 제외",
      "계약 기준 DVT(GS 8월 · e-Care 9월) 대비 일정 이동에 따른 순증분",
      "출처: DVT/E2E 대응 추가 투입인력 계획(2026.10.16)",
    ],
    staffing: {
      head: ["업무 영역", "인원", "10월 · 기능 Test / DVT", "11월 · 기능 Test / DVT / E2E 1차 병행"],
      rows: [
        ["ACOS Core / Interface", "3", "ACOS API, WAM 연계, TSC-GC/GB, MQTT, 인증/KMS 관련 수정", "기능 Test · DVT 결함 수정 + 시스템 간 E2E 연동"],
        ["Provisioning / PGM", "2", "Vehicle/Admin/Subscription, Service Flag, Consent/PGM", "기능 Test · DVT 잔여 검증 + Provisioning 시나리오 E2E"],
        ["DB / Migration", "1", "DB Mapping 및 Migration 사전 검증", "Migration 사전 검증 지속 + E2E 데이터 정합성"],
        ["e-Care", "3", "VDP/VEP, Event, Workflow/Case, DMS/CCW 연계", "VDP/VEP 기능 Test 지속 + 이벤트 → VEP → DMS/CCW E2E"],
        ["Global South", "2", "Provisioning, Capability, GS 서비스 연계", "GS 기능 Test 지속 + GS 서비스 · Capability E2E"],
        ["통합 / Defect 대응", "2", "기능 Test 및 DVT 결함 분석 · 수정", "기능 Test · DVT 결함 대응 + Cross-System Blocking Issue"],
      ],
    },
    tasks: {
      oct: { label: "10월", sub: "27개 업무 · 108개 세부 항목 · 260 MD (13.00 MM)", rows: tasks.oct },
      nov: { label: "11월", sub: "27개 업무 · 108개 세부 항목 · 260 MD (13.00 MM), 11.09 기준 투입 및 투입 예정", rows: tasks.nov },
    },
  },
  vdp: {
    id: "vdp", code: "A7", title: "VDP 연계 경과 (2026.08.26 ~ 10.27)",
    message: "TMC VDP 접속 정보 · Endpoint 사양이 정정되어 연계 시험을 재수행 중이며, 10.27 기준 VDP 정상 응답은 확인되지 않음",
    rows: [
      ["08.26 ~ 9월", "TMC가 CoCo · Diag 담당자를 안내하고 일부 사양 확정이 지연됨. 접속 정보는 Diag 플랫폼 IP 3개만 제공, CoCo API Endpoint는 미안내", "CoCo API 호출 대상 미확정"],
      ["10.06", "TMC 제공 IP 3개 × 3개 포트, 총 9건 접속 시험 수행", "전건 Timeout, 로그 공유 및 확인 요청"],
      ["10월 중", "TMC 확인 결과, 제공 IP는 Diag 플랫폼용이며 CoCo API 호출 대상이 아님", "TMC가 안내 내용 정정"],
      ["10.22", "TMC가 신규 안내한 Endpoint 3종(STG)에 API 호출 시험", "전건 HTTP 401 (인증 오류)"],
      ["10.26", "TMC 요청에 따라 송신 IP Whitelist 등록 후 재시험. 이후 TMC가 기존 3종 URL을 사용 불가로 정정하고 단일 /v1 Endpoint 안내", "재시험도 HTTP 401, Endpoint 정정"],
      ["10.27", "정정된 /v1 Endpoint 기준 DTC 조회 시험 (요청 유형 2 · 3)", "테스트 VIN 유효성 오류, VDP 등록 확인 필요"],
    ],
    cards: [
      { k: "TMC 제공 정보 → 정정 사항", v: ["접속 대상: Diag 플랫폼 IP 3개 → CoCo API 호출 대상 아님", "Endpoint: 개별 REST 3종 → 단일 /v1", "적용 범위: e-Care는 DTC 조회만 적용 (SSR 미적용)"] },
      { k: "DVT 영향 및 후속 대응", v: ["10.27 기준 VDP 연동 미완료로 2차 시험 중 VDP 연동 항목 일정 조정 가능", "TMC 확정 요청: 최종 인터페이스 사양, 인증 조건, DTC 조회 가능 테스트 VIN", "LGU+ 대응: Endpoint 변경 반영, 재검증, DVT 계획 반영"] },
      { k: "공수 영향", v: ["Endpoint 변경에 따른 수정 개발 · 재검증은 DVT 기간 변경 · 연동 대응 10.10 MM(A13)에 반영. 이후 추가 변경분은 추가 DVT 예측(A15)에서 관리"] },
    ],
  },
  ux: {
    id: "ux", code: "A8", title: "기획 · UX/GUI 변경 이력",
    message: "06.23 최초 정책 확정 이후 18차례에 걸쳐 화면 목차 57건이 변경되었고, 그중 44건이 7 ~ 8월에 집중됨",
    monthly: [["6월", 1], ["7월", 28], ["8월", 16], ["9월", 2], ["10월", 10]],
    monthlyNote: "화면 목차(4자리) 기준 건수, 반영일 2026.06 ~ 2026.10",
    byMonth: [
      ["6월", "1회", "CCW 경고 알림 팝업 카운트 정책"],
      ["7월", "9회", "응대 · 경고 팝업, e-Care 응대 시간 관리(OPW) 신설, WNG 필터 · 등록, 서비스센터 처리상태 · 라벨 일괄 변경"],
      ["8월", "5회", "WNG 필터 · Master · 이벤트, 서비스 플래그 설정, 상담이력 목록 전면 개선, OTT/Wi-Fi 필터"],
      ["9월", "1회", "WNG Master 버전 설명 위치 이동"],
      ["10월", "2회", "WNG 등록 중복 검사 기준 변경, 변경 이력 목록 · 텍스트 검색 방식 정리"],
    ],
    reversals: [
      ["WNG 중복 검사", "08.05 → 10.26", "중복 경고등명 허용 체크박스 추가 → 체크박스 삭제, 검사 기준을 WNG 코드로 변경"],
      ["상담이력 상태", "07.08 → 08.28", "'완료' 컬럼 삭제 → 상담 상태 3종에서 4종으로 재정의"],
      ["재연결 SMS", "07.03 → 08.04", "5분 카운트다운 정의 → 발송 조건 원복(수동 → 자동), 대기시간 5분 → 1분"],
      ["WNG Master 버전", "08.04 → 09.16", "버전 컬럼 삭제 → 버전 설명을 변경 이력 하위로 이동"],
      ["WNG 필터 관리", "07.08, 07.27", "전체 구조 변경 2회, 진행 중 작업 중지 요청 발생"],
    ],
    effect: "변경마다 기획 재확정 → GUI 수정 → 개발 → 재검증이 반복되어 개발 · 시험 일정에 영향. 8 · 9월 기획 2 MM, 10월 계획에 없던 변경(10건) 반영 1 MM이 37.10 MM에 포함됨",
    note: "반영일은 화면 정의서 반영 기준이며 정책 확정일(06.23, 08.13, 08.31)과 다를 수 있음",
    specs: [
      { no: "01", area: "CCW", screen: "11.4.1.1 e-Care 상담 이력 · 다건 처리 상태 개선", reason: "DMS 요청사항",
        as: "처리 상태 열에 텍스트 1개만 표시. 다른 예약 건의 센터 · 상태 확인 불가",
        to: "배지+센터명, 일시, [외 N건] 3행 구조로 개편. 2건 이상 시 대표 1건 + [외 N건] 팝오버 추가" },
      { no: "02", area: "CCW", screen: "부록 · 처리 상태 정의, 다건 표시 규칙", reason: "DVT 품질 이슈",
        as: "다건 예약 시 팝오버 표기 기준 미정의. 상태 배지 색상 · 일시 표기 규칙 없음",
        to: "서비스센터 처리 상태 8종 + 예약취소, 긴급출동 4종 정의. 다건 노출 · 정렬 및 배지 공통 규칙 정의" },
      { no: "03", area: "로컬앱", screen: "토요타 커넥트 가입 플로우 개편 v2.1", reason: "1차 프로젝트 기획 누락",
        as: "납부 정보 입력이 가입정보 3단계에 포함. 무료/유료 서비스 선택 화면이 2개로 분리",
        to: "납부정보를 서비스 선택[유료] 이후로 이동. 서비스 선택 1개 화면 통합. 삭제 확정 화면 6종 제거" },
      { no: "04", area: "OPW", screen: "13.1.1.4 – 13.1.1.5 프로비저닝 · 서비스 플래그 설정 개편", reason: "요금제 확정에 따른 규격 변경",
        as: "플래그 항목이 나열식으로 배치되어 패키지 구분 없음. 변경된 플래그와 기본값 구분 불가",
        to: "패키지별 블록 그룹화, 범례 · 가입 상태 · [기본값 불러오기] 추가. 변경 내용 확인 모달 신규 추가" },
      { no: "05", area: "OPW", screen: "12.1.1.1 · 12.2.1.1 서비스 관리 · 요금제 해지 이력 반영", reason: "부가서비스 (WiFi Hotspot) 변경",
        as: "해지된 요금제를 DB에서 삭제하여 화면 미표시. 가입 · 해지 이력 추적 불가",
        to: "해지 시 '해지' 상태 유지(이력 보관). 요금제 상태 필터 및 컬럼(요금제 상태 · 해지일) 추가" },
      { no: "06", area: "OPW", screen: "12.3.2.1 – 12.3.2.6 WNG Master 관리 · 처리 일시, 이력 정합성", reason: "WNG Master 변경 관리 방안 고도화",
        as: "'최종 변경 시간'이 수정 건만 반영. 이력 구분이 '수정' 단일 값으로 등록과 구분 불가",
        to: "'처리 일시'로 변경(등록 · 수정 모두). 이력 구분 '등록/수정', 저장 흐름 및 인증 실패 예외 정의" },
      { no: "07", area: "OPW", screen: "12.3.4.1 · 12.3.4.2 서비스 센터 관리 · 검색, 운영시간 개선", reason: "DVT 품질 지적사항 반영",
        as: "센터명 · 번호만 검색 가능. 운영 상태 판단 기준 미정의",
        to: "통합 검색에 주소 추가. 운영 상태 드롭다운 · 컬럼 삭제, 운영 시간 테이블 및 센터코드 컬럼 추가" },
      { no: "08", area: "OPW", screen: "12.3.3.2 – 12.3.3.6 WNG 중복 필터 · 초기값, 저장 흐름 개선", reason: "DVT 품질 지적사항 반영",
        as: "중복 판단 시간 초기값 미선택. 전체 일괄 선택 시에도 WNG별 시간 입력이 활성화되어 조건 충돌",
        to: "초기값 '전체 일괄 · 5분' 디폴트. 전체 일괄 선택 시 WNG별 입력 비활성. 버튼 명칭 및 저장 후 복귀 흐름 정의" },
    ],
  },
  dvtRun: {
    id: "dvt-run", code: "A10", title: "DVT 수행 실적 (2026.10.06 ~ 10.30)",
    message: "1 · 2차 DVT에서 시험과 함께 오류 분석, 프로그램 수정, 재시험, 외부 시스템 연동 확인을 병행했고, 시험이 없는 기간에도 결함 후속 대응이 이어짐",
    source: "출처: CCB 자료 v45 Appendix A2 (DVT 투입인력 업무 상세), DasanDMC 한국 개발팀 작성",
    stages: [
      ["1차 DVT", "10.06 ~ 10.14", "GS · Local App 기능 시험, 오류 식별, 결함 분석 및 수정"],
      ["결함 F/U · 2차 준비", "10.15 ~ 10.21", "Fail/NT 분석, 프로그램 수정, 재시험 준비, 시험 환경 점검"],
      ["2차 DVT", "10.22 ~ 10.30", "GS · e-Care 시험, 기존 결함 재시험, 신규 오류 분석 및 수정"],
      ["3차 DVT · 후속 대응", "10.31 이후", "잔여 결함 수정, 추가 시험, 연동 검증, E2E 준비"],
    ],
    result: {
      head: ["구분", "전체 TC", "Pass", "Fail", "NT", "미분류", "Pass 비율"],
      rows: [["1차 GS", "290", "132", "14", "144", "0", "45.5%"], ["2차 GS", "326", "262", "5", "59", "0", "80.4%"], ["2차 e-Care", "548", "261", "3", "264", "20", "47.6%"]],
      notes: ["1차와 2차의 TC 범위가 달라 Pass 비율은 같은 항목 기준 개선율과 구분해야 함", "e-Care CCW 236건은 CTI 미연동으로 전체 NT, DMS Interface 20건은 최종 판정 정보가 없어 미분류", "2차 합계(GS + e-Care) 874건 중 Pass 523건, Fail 8건은 11.03 PM 정례회의 공유 결과와 일치"],
    },
    day1: { head: ["일자", "Planned", "Acted", "Pass", "Fail", "NT"], rows: [["10/06", "38", "40", "22", "15", "3"], ["10/07", "64", "290", "50", "207", "33"], ["10/08", "69", "125", "36", "52", "37"], ["10/12", "56", "215", "71", "106", "38"], ["10/13", "63", "290", "119", "14", "157"], ["10/14", "–", "–", "–", "–", "–"], ["합계", "290", "960", "298", "394", "268"]] },
    comp1: { head: ["구성요소", "Total", "Pass", "Fail", "NT"], rows: [["Local App", "27", "14", "1", "12"], ["Digital Key", "2", "0", "0", "2"], ["OTT", "107", "49", "9", "49"], ["Wi-Fi Hotspot", "73", "34", "0", "39"], ["Provisioning", "81", "35", "4", "42"], ["합계", "290", "132", "14", "144"]] },
    day2: { head: ["일자", "Acted", "Pass", "Fail", "NT"], rows: [["10/22", "247", "120", "11", "116"], ["10/23", "132", "82", "8", "42"], ["10/26", "33", "29", "1", "3"], ["10/27", "19", "13", "0", "6"], ["10/28", "9", "8", "1", "0"], ["10/29", "17", "11", "0", "6"], ["10/30", "24", "7", "1", "16"], ["합계", "481", "270", "22", "189"]] },
    comp2: { head: ["구성요소", "Total", "Pass", "Fail", "NT"], rows: [["Local App", "36", "32", "0", "4"], ["Digital Key", "2", "0", "0", "2"], ["OTT", "120", "96", "1", "23"], ["Wi-Fi Hotspot", "70", "58", "0", "12"], ["Provisioning", "98", "76", "4", "18"], ["합계", "326", "262", "5", "59"]] },
    day2e: { head: ["일자", "Acted", "Pass", "Fail", "NT"], rows: [["10/22", "115", "79", "26", "10"], ["10/23", "100", "69", "21", "10"], ["10/26", "52", "35", "5", "12"], ["10/27", "58", "46", "11", "1"], ["10/28", "26", "26", "0", "0"], ["10/29", "0", "0", "0", "0"], ["10/30", "3", "3", "0", "0"], ["합계", "354", "258", "63", "33"]] },
    comp2e: { head: ["구성요소", "Total", "Pass", "Fail", "NT", "미분류"], rows: [["CCW", "236", "0", "0", "236", "0"], ["OPW", "292", "261", "3", "28", "0"], ["DMS Interface", "20", "0", "0", "0", "20"], ["합계", "548", "261", "3", "264", "20"]] },
    dailyNote: "일별 결과는 반복 수행과 재시험을 포함한 누적 실행 건수로, 최종 TC 판정과 집계 기준이 다름. 10/14 일별 실적은 집계 자료에 없음",
    gap: {
      lead: "시험 실행이 없는 날에도 프로그램 수정, 결함 분석, 시험 환경 준비, 관계사 협의가 진행되어 DVT 업무 기간에 포함",
      rows: [["10/15", "결함 F/U", "1차 DVT Fail/NT 항목 분석, 결함 분류 및 조치 대상 확인"], ["10/16", "오류 분석 및 수정", "서비스 기능 오류 분석, 개발 수정 대상 검토, 관계사 확인 사항 정리"], ["10/19", "시험 결과 분석", "DVT 진척 현황 및 잔여 결함 분석, Blocked/NT 원인 분류"], ["10/20", "연동 검증 및 시험 준비", "수정 사항 검토, ACOS/VDP 연동 조건 확인, 시험 환경 점검"], ["10/21", "2차 DVT 준비", "잔여 이슈 Follow-up, 시험 데이터 및 선행 조건 확인"]],
      note: "일자별 세부 업무는 대응 이력에 따른 정리안이며, 최종 실적 확정 시 Daily Report 및 개발 이력과 대조함",
    },
    issues: {
      head: ["영역", "주요 이슈", "분석 및 대응 업무", "후속 관리"],
      rows: [
        ["Global South", "서비스 가입 및 상태 불일치", "WAM 서비스 가입 및 상태 처리 분석", "수정 · 재시험 결과 확인"],
        ["Global South", "차량 등록 오류", "DMS 차량 정보 및 VIN 검증", "데이터 확인"],
        ["Global South", "OTT 서비스 상태 오류", "가입 · 해지 · 연장 · 유료전환 처리 분석", "수정 · 재시험"],
        ["Local App", "Auth0 인증 오류 (WebLink 진입)", "Global App · Local App 인증 테넌트 및 세션 분석", "TMC 협의"],
        ["ACOS Provisioning", "MM Capable 미반환", "MM Flag 4개 항목 조회 및 활성화 조건 분석", "추가 확인"],
        ["ACOS Provisioning", "Opt-in/out 오류", "Provisioning Flag 구성 및 요청 · 응답 분석", "재검증"],
        ["e-Care VDP CoCo", "API 인증 · DTC 조회 오류", "URL, 인증 헤더, API Key, VIN 등록 확인", "정상 응답 확인"],
        ["e-Care VDP CoCo", "Callback · Collection Status 미수신", "Notification 송수신 및 처리 조건 분석", "추가 시험"],
        ["e-Care VDP Diag", "서버 간 통신 · 인증", "IP Whitelist, x-API-Key, 네트워크 연결 점검", "연결 시험"],
        ["Digital Key", "시험 불가 · Wrapper 연동", "Pairing Password Notification API, TSC-DK Wrapper 인증 조건 검토", "연동 검증"],
        ["인프라 · 시험 환경", "외부 시스템 접속 · HU/DCM · 테스트 데이터", "서버 간 경로, 방화벽, 단말 연결, VIN · 가입 데이터 점검", "환경 보완"],
      ],
      note: "10/30 이후 진행된 검증과 대응은 1 · 2차 DVT 기간 실적으로 소급하지 않고 11월 후속 대응 실적으로 구분함",
    },
    nov: {
      head: ["업무 영역", "주요 수행 내용", "상태"],
      rows: [["Global South", "기존 Fail/NT 재시험 및 잔여 결함 수정", "진행"], ["Local App", "Auth0 인증 및 서비스 기능 오류 대응", "진행"], ["ACOS", "MM Capable, Opt-in/out, ADF 후속 검증", "진행"], ["e-Care CoCo", "DTC 조회 및 Callback/Notification 검증", "진행"], ["e-Care Diag", "네트워크 연결 및 WNG/DTC/LAST 연동 준비", "진행"], ["Digital Key", "API 및 Wrapper 연동 환경 확인", "진행"], ["DMS", "차량 및 서비스 데이터 연동 확인", "진행"], ["인프라", "서버 · 네트워크 · Whitelist 환경 대응", "진행"], ["QA", "잔여 결함 재시험, 3차 DVT 준비, 결과 관리", "진행"], ["PM · 기획", "주요 이슈 조율, 업무 요건 확인, E2E 준비", "진행"]],
    },
  },
  dvtStaff: {
    id: "dvt-staff", code: "A11", title: "DVT 투입 인력 및 공수 산정",
    message: "PM 1 · 기획 1 · 개발 16(PL 포함) · QA 5, 총 23명이 DVT에 참여했고, 개발 공수는 월 13.0 MM(260 MD)으로 산정함",
    source: "출처: CCB 자료 v45 Appendix A2. 성명은 비식별 처리(ENG · QA 번호)",
    kpi: [["전체 참여", "23명"], ["개발 (PL 포함)", "16명"], ["QA", "5명"], ["PM · 기획", "2명"]],
    dev: { head: ["No.", "구분", "인력", "직급", "담당 영역"], rows: [["1", "PL", "ENG1", "소장", "ACOS"], ["2", "PL", "ENG2", "이사", "e-Care"], ["3", "PL", "ENG3", "수석", "Global South"], ["4", "PL", "ENG4", "수석", "Local App"], ["5", "PL", "ENG5", "책임", "OPW/CCW"], ["6", "개발", "ENG6", "책임", "ACOS"], ["7", "개발", "ENG7", "책임", "ACOS"], ["8", "개발", "ENG8", "수석", "Local App"], ["9", "개발", "ENG9", "수석", "e-Care"], ["10", "개발", "ENG10", "책임", "e-Care"], ["11", "개발", "ENG11", "수석", "e-Care"], ["12", "개발", "ENG12", "수석", "Global South"], ["13", "개발", "ENG13", "수석", "Global South"], ["14", "개발", "ENG14", "수석", "OPW/CCW Front"], ["15", "디자인/퍼블리싱", "기획2", "대리", "UI 디자인 및 퍼블리싱"], ["16", "인프라", "ENG15", "수석", "서버 · 네트워크 · 연동 환경"]] },
    devNote: "PL은 별도 관리 인력이 아닌 개발 인력으로 포함해 공수 산정",
    pm: [["PM", "이사 · 총괄 PM", "DVT 일정 · 진척 관리, 주요 이슈 총괄, TMKR/TMC 협의 및 보고"], ["기획1", "이사 · 기획", "서비스 정책 · 업무 요건 검토, 사양 확인 및 변경 사항 협의"]],
    qa: { head: ["인력", "역할", "담당 영역"], rows: [["QA1", "팀장 / QA 리더", "QA 전체"], ["QA2", "QA", "DMS / VDP"], ["QA3", "QA", "Global South / Local App"], ["QA4", "QA", "e-Care"], ["QA5", "QA", "공통 지원"]] },
    devEffort: { head: ["구분", "2026.10", "2026.11", "합계"], rows: [["개발 참여 인력", "16명", "16명", "16명"], ["기준 공수", "260 MD", "260 MD", "520 MD"], ["MM 환산", "13.0 MM", "13.0 MM", "26.0 MM"], ["주요 수행 업무", "1 · 2차 DVT, 결함 분석 · 수정, 재시험", "3차 DVT, 잔여 결함, E2E 준비", ""]] },
    devBasis: ["10 ~ 11월 상세 개발 · 결함 대응 업무 기준 월 약 13 MM으로 산정 (1 MM = 20 MD)", "10월 · 11월 각 260 MD는 상세 공수표에 따른 기준 산정치로, 11월 예정 업무는 실적으로 확정", "QA 공수와 PM · 기획 공수는 개발과 별도 구분"],
    qaEffort: { head: ["구분", "수행 기간", "근무일", "QA 인원", "기준 공수"], rows: [["1차 DVT", "10/06 ~ 10/14", "6일", "5명", "30 MD"], ["결함 F/U 및 2차 준비", "10/15 ~ 10/21", "5일", "5명", "25 MD"], ["2차 DVT", "10/22 ~ 10/30", "7일", "5명", "35 MD"], ["합계", "", "18일", "5명", "90 MD"]] },
    qaNote: "QA 90 MD는 5명 전일 투입 가정 기준이며, 11월 3차 DVT 및 후속 대응 공수는 별도 산정. 4장 공수 표의 10월 품질 실적(4.0 MM)은 투입 확인 기준으로 정리",
    principle: ["인력 수 · 근무일이 아닌 실제 수행 업무 기준으로 공수 관리", "업무별 PL은 개발 인력에 포함하며 중복 공수로 계산하지 않음", "월 13 MM 기준, 초과 시 수행 근거 확인 후 반영"],
  },
  others: {
    id: "others", code: "A9", title: "기타 CCB 안건 (참고)",
    message: "본 자료의 협의 대상은 ② ACOS 규격 확정 지연 대응이며, ① · ③은 참고로 수록함",
    ecare: {
      title: "① e-Care 콜버튼 추가", mm: "3.86 MM", md: "77.2 MD", status: "11.10 PM 회의 협의 완료",
      bg: [
        "TMKR 신규 개발 요청(2026.08.28). e-Care 메시지 화면 내 콜버튼(CTA) 제공",
        "3차 개발안 확정(09.30, TMC · TMKR 합의). TSP가 VIN 기준으로 Case를 판단하여 콜센터(Case A) · 서비스센터(Case B · C) 연결",
        "시험 공수를 12 MD → 4.2 MD로 조정하여 최종 77.2 MD(3.86 MM) 산정. 착수 후 2개월",
      ],
      head: ["영역", "주요 업무", "공수 (MM)"],
      rows: [
        ["기획 / 디자인", "UX 기획서 (VIN 기반 A/B/C 분기 정책), 콜센터 · 서비스센터 화면 디자인", "0.50"],
        ["VEP / WAM", "VIN 기준 Active Warning 조회, A/B/C 등급 Mapping, 복수 Warning 우선순위 판단", "0.50"],
        ["WAM / Dealer", "선호 · 주변 Dealer 조회, Dealer 검색 · 상세 정보, DMS → WAM 데이터 정합성 검증", "0.70"],
        ["Local App B/E", "Case A 콜센터 연결 화면, Case B/C 서비스센터 화면, Dealer UI, 전화 연계", "0.80"],
        ["Naver Map", "지도 API/SDK 연계, 현재 위치 처리, Dealer Marker, 거리순 목록 연계", "0.65"],
        ["Local App (Hybrid)", "Global App Deep Link VIN 수신, WebView 호출, Native Bridge, 위치 권한, Dialer", "0.50"],
        ["통합 시험", "단위 · 내부/외부 연계 시험, Case A/B/C E2E 시험, 결함 수정 및 Regression", "0.21"],
        ["합계", "7개 영역 · 착수 후 2개월", "3.86"],
      ],
    },
    dealer: {
      title: "③ 딜러가입앱 변경", mm: "4.55 MM", md: "91 MD", status: "11.10 PM 회의 결과 본 CCB 대상에서 제외",
      bg: [
        "24MM · 27MM 등 추가 플랫폼 확장 시나리오 반영 (차량유형선택 시나리오 1.50 MM)",
        "딜러 사용자 인증을 위한 딜러앱 전용 로그인 및 계정 관리 (딜러사용자 로그인 3.05 MM)",
        "TMKR 자체 앱으로 처리하기로 하여 본 CCB 협의 대상에서 제외",
      ],
    },
  },
};

// ── CCB 자료 2026.11.16(PPT) 반영: 증적 이미지 연결 + 콜버튼 별도 건 ──
const DECK = "CCB 자료 2026.11.16";
const deckRef = { "2.1": "p.33–34", "2.2": "p.35–38", "2.3": "p.37–40", "2.4": "p.37–43", "2.5": "p.44–45", "2.6": "p.46–48", "2.7": "p.49–51", "2.8": "p.52–56", "2.9": "p.57–58", "2.10": "p.59–60", "2.11": "p.61–62", "2.12": "p.63–64" };
const evidenceByItem = {
  "2.4": [{ img: "evidence/ev-sf-product-flags.png", label: "상품(Safety Basic / Remote Package)별 ACOS Service Flag ON/OFF", slide: "p.43", note: "주황 표시는 ACOS 신규 Flag. 2026.09.02 기준 TMKR과 정리 진행 중이며 확정 시 판단 로직 Mapping에 반영" }],
  "2.6": [{ img: "evidence/ev-update-notification-spec.png", label: "Update Notification Request 규격 비교 (ACOS-GC vs OneServer)", slide: "p.48", note: "좌: ACOS-GC(TSC-GC) URL · Header · Body 미정의로 개발 착수. 우: OneServer Body 29개 필드" }],
  "2.7": [{ img: "evidence/ev-create-notification-spec.png", label: "Create Notification Request 규격 비교 (ACOS-GC vs OneServer)", slide: "p.51", note: "좌: ACOS-GC Header · Body 미정의(빈 표). 우: OneServer Header 및 Body 28개 필드. 7월 말 확정 규격으로 재개발" }],
  "2.8": [{ img: "evidence/ev-vehicle-api-split.png", label: "Vehicle Information – API 분할 구조 (register-request 1개 → 6개)", slide: "p.54", note: "Region 측 Vehicle Management API 7개 호출이 register-request(5개 맥락) + search-request(1개)로 매핑" }],
};
appendix.chgdev.items.forEach((it) => { it.deck = deckRef[it.no]; it.ev = evidenceByItem[it.no] || []; });
appendix.chgdev.items.find((x) => x.no === "2.8").verify = {
  title: "LGU+ 확인 요청: 분석 누락 공수인가, 실제 사양 변경 공수인가",
  lead: "Vehicle Information 35 MD는 최초 OneServer 분석의 오류가 아니라, 확정되지 않은 Spec을 따라가며 대응한 결과입니다.",
  flow: [
    ["① Excel Spec (2026.06)", "단일 API(register-request) 전제로 분석 및 공수 산정"],
    ["② ACOS Portal 상세 Spec", "단일 처리 영역이 다수 API로 분리된 구조 확인, 호출 Flow 재설계"],
    ["③ 최종 Spec (07.27)", "개발 진행 이후 추가 변경 발생, 재작업 반영"],
  ],
  evidence: [
    ["01", "최초 공수 산정에 사용한 규격", "6월 분석 시점의 Specification 문서명 · Version"],
    ["02", "API 다수 분리 구조를 최초 확인한 Spec Version", "단일 API 전제가 깨진 시점"],
    ["03", "해당 Spec 수신일", "수신일과 개발 착수일의 선후 관계가 판단 기준"],
    ["04", "07.27 최종 Spec과 직전 Spec의 차이", "개발 진행 이후 재변경분, 재작업 공수의 직접 근거"],
  ],
  status: "위 4건은 PPT에 제시 항목으로만 정리되어 있고 문서 원본은 첨부되어 있지 않음. 원본 확보 후 이 자리에 연결 필요",
  slide: "p.55–56",
};
appendix.ux.timeline = { img: "evidence/ux-timeline-changes.png", label: "변경 반영일 · 화면 정의서 변경 내역 원본 (정책 확정 이후 57건)", slide: "p.19" };
const uxImg = { "01": "ux-01-ccw-history", "02": "ux-02-ccw-status-rule", "03": "ux-03-app-signup-flow", "04": "ux-04-opw-service-flag", "05": "ux-05-opw-ott-service", "06": "ux-06-opw-wng-master", "07": "ux-07-opw-service-center", "08": "ux-08-opw-duplicate-filter" };
appendix.ux.specs.forEach((x) => { x.img = "evidence/" + uxImg[x.no] + ".png"; x.slide = +x.no <= 4 ? "p.21" : "p.22"; });

appendix.callbtn = {
  id: "callbtn", code: "A12", title: "e-Care 콜버튼 추가 (별도 협의 건)",
  message: "TMKR 신규 요청(08.28)으로 e-Care 메시지 화면에 콜버튼(CTA)을 추가하며, 3차 개발안(09.30 확정)으로 7개 영역 3.86 MM(77.2 MD)을 착수 후 2개월간 투입함",
  source: "출처: " + DECK + " p.4–6. 위 37.10 MM과 합산하지 않고 별도로 협의",
  flow: [["GSA", "CTA 버튼 선택"], ["GSA → TSP", "VIN 정보 전달"], ["TSP", "VIN 기준 WNG 우선순위(Case) 자체 판단"], ["결과", "Case A 콜센터 연결 · Case B/C 서비스센터 안내"]],
  history: [
    ["08.28", "고객사 요청 접수 (TMC 08.26 정례미팅 제안 기반)"],
    ["09.04", "1차 예측 공수 86 MD 전달"],
    ["09.09", "2차 개발안(Data label 방식) 검토"],
    ["09.30", "3차 개발안 확정 (TMC · TMKR 합의). Data label 방식은 필수 요건에서 제외"],
    ["10.07", "정례 미팅에서 TMC가 VIN 전송에 문제가 없다는 입장 전달"],
    ["10.13", "최종 공수 3.86 MM 산정. 평가 공수 과다 의견으로 시험 공수 12 MD → 4.2 MD 조정"],
  ],
  areas: [
    ["기획 / 디자인", "UX 기획서 (VIN 기반 A/B/C 분기 정책), 콜센터 · 서비스센터 화면 디자인", 0.5],
    ["VEP / WAM", "VIN 기준 Active Warning 조회, A/B/C 등급 Mapping, 복수 Warning 우선순위 판단", 0.5],
    ["WAM / Dealer", "선호 · 주변 Dealer 조회, Dealer 검색 · 상세 정보, DMS→WAM 데이터 정합성 검증", 0.7],
    ["Local App B/E", "Case A 콜센터 연결 화면, Case B/C 서비스센터 화면, Dealer UI, 전화 연계", 0.8],
    ["Naver Map", "지도 API/SDK 연계, 현재 위치 처리, Dealer Marker, 거리순 목록 연계", 0.65],
    ["Local App (Hybrid)", "Global App Deep Link VIN 수신, WebView 호출, Native Bridge, 위치 권한, Dialer", 0.5],
    ["통합 시험", "단위 · 내부/외부 연계 시험, Case A/B/C E2E 시험, 결함 수정 및 Regression", 0.21],
  ],
  notes: [
    "합계 3.86 MM = 77.2 MD (20 MD/MM 기준). 착수(M) 후 2개월(M ~ M+1)",
    "착수 시점은 계약 방식 확정 후 결정. TMC 시험 희망 시점은 2027.01 (목표일 2027.01.18)",
    "TMC가 제시한 평가 공수 과다 의견을 반영해 시험 공수를 12 MD에서 4.2 MD로 낮춘 값",
  ],
};
summary.separate = { tag: "별도 협의", title: "e-Care 콜버튼 추가", mm: "3.86", md: "77.2", body: "TMKR 신규 요청(08.28), 3차 개발안 확정(09.30). 위 37.10 MM과 별개의 신규 요청 건입니다", panel: "callbtn" };

// ── CCB 자료 2026.11.18 반영: 요청 23.01 MM(콜버튼 3.86 + ACOS 8.10 + DVT 변경·연동 11.05), 추가 DVT 26.95 MM 제안 ──
const DECK2 = "CCB 자료 2026.11.18";
summary.headline = "ACOS 규격 변경 추가 개발 8.10 MM, DVT 기간 변경 · 연동 대응 11.05 MM, 신규 요청 콜버튼 3.86 MM의 공수 인정을 요청드립니다";
summary.ask = "요청 공수 합계 23.01 MM에 대한 검토 및 인정을 요청드립니다";
summary.equation = [
  { v: "3.86", unit: "MM", label: "① e-Care 콜버튼", desc: "TMKR 신규 요청 · 수행 예정" },
  { v: "8.10", unit: "MM", label: "② ACOS 규격 변경 추가 개발", desc: "07.28 ~ 09.30 · 수행 완료" },
  { v: "11.05", unit: "MM", label: "③ DVT 기간 변경 · 연동 대응", desc: "10.01 ~ 11.17 · 수행 완료" },
  { v: "23.01", unit: "MM", label: "요청 공수 합계", desc: "3건 · Global South · e-Care" },
];
summary.steps = [
  { n: 1, tag: "신규 요청", title: "e-Care 콜버튼 추가 3.86 MM", body: "TMKR 신규 요청(08.28), 3차 개발안 확정(09.30, TMC · TMKR 합의). 7개 영역, 착수 후 2개월. 수행 예정이며 TMC 시험 희망은 2027.01.18", panel: "callbtn", link: "콜버튼 상세" },
  { n: 2, tag: "수행 완료", title: "ACOS 규격 변경 추가 개발 8.10 MM", body: "07.27 최종 규격까지 변경 규격이 2회 배포되어 Global South 개발 범위의 약 60%가 재검토 대상. 12개 항목을 07.28 ~ 09.30에 수정 · 추가 개발", panel: "chgdev", link: "변경 개발 12개 항목" },
  { n: 3, tag: "수행 완료", title: "DVT 기간 변경 · 연동 대응 11.05 MM", body: "7/27 이후에도 TMC · TMKR의 변경 · 정정이 4개월간 이어져 DVT 기간(10.01 ~ 11.17)에 분석 · 개발 · 재검증이 발생. 10 ~ 11월 실투입 29.00 MM 중 이 11.05 MM만 정산 요청, 나머지 17.95 MM은 인지 요청", panel: "dvtchg", link: "변경 · 정정별 업무와 공수" },
];
summary.principle = {
  title: "산정 원칙",
  lead: "수행한 업무만 산정했고, 요청(정산)과 인지를 구분했습니다",
  items: [
    { k: "정산 요청과 인지 요청 구분", v: "10 ~ 11월 실투입 29.00 MM 중 7/28 이후 규격 변경 · 이슈 대응 11.05 MM만 정산 요청. DVT 시험 · 결함 대응 17.95 MM은 인지 요청" },
    { k: "ACOS 개발분 제외", v: "ACOS는 별도 턴키 계약. Global South · e-Care 영향분에 한정" },
    { k: "LGU+ 자체 감수", v: "ACOS 전환 · e-Care 규격 대응은 일정 · 인력 변경 없이 자체 감수" },
    { k: "추가 DVT 기간은 별도 제안", v: "11.18 ~ 2027.01.29 예측 공수 26.95 MM은 본 합계(23.01 MM)에 포함하지 않음" },
    { k: "향후 인정 기준 동일 적용", v: "이번 정리의 DVT 시험 대응 공수 인정 기준을 추가 DVT 기간 예측 공수에도 동일하게 적용" },
  ],
};
summary.status = summary.status.map((x) => (x.k === "11월분은 실적으로 확정" ? { k: "투입 공수는 11.17 기준", v: "10 ~ 11월 투입은 11.17까지의 기투입 공수입니다. 3차 DVT 종료 이후 실적은 추가 DVT 기간(11.18 ~) 예측 공수로 구분합니다" } : x));
delete summary.separate;

appendix.callbtn.history = appendix.callbtn.history.map((r) => (r[0] === "09.04" ? ["09.04", "1차 예측 공수 4.30 MM 전달"] : r[0] === "10.13" ? ["10.13", "최종 공수 3.86 MM 산정. 평가 공수 과다 의견으로 시험 공수를 0.60 MM에서 0.21 MM로 조정"] : r));
appendix.callbtn.notes = ["합계 3.86 MM. 착수(M) 후 2개월(M ~ M+1)", "착수 시점은 계약 방식 확정 후 결정. TMC 시험 희망 시점은 2027.01 (목표일 2027.01.18)", "TMC의 평가 공수 과다 의견을 반영해 통합 시험 공수를 0.60 MM에서 0.21 MM로 낮춘 값"];
appendix.callbtn.message = "TMKR 신규 요청(08.28)으로 e-Care 메시지 화면에 콜버튼(CTA)을 추가하며, 3차 개발안(09.30 확정)으로 7개 영역 3.86 MM을 착수 후 2개월간 투입 예정";
appendix.callbtn.source = "출처: " + DECK2 + " p.3~5. 요청 공수 합계 23.01 MM의 ① 항목";

appendix.dvtChg = {
  id: "dvt-chg", code: "A13", title: "DVT 기간 변경 · 정정별 수행 업무와 공수 (10.01 ~ 11.17)",
  message: "DVT 기간 중 외부 시스템 연동 규격 변경과 이슈에 대한 분석 · 설계 · 개발 · 재검증에 11.05 MM이 투입되었고, 이 전체를 요청에 반영함",
  source: "출처: " + DECK2 + " p.14, p.71~72 (발생 시점은 Jira · 주간보고 · 메일 이력 기준)",
  head: ["분류", "영역", "귀책", "주요 발생 사유 · 확인 오류", "추가 · 변경 업무", "MM"],
  rows: [
    ["VDP", "VDP Diag", "TMC", "Diag 서버 미연동, x-api-key · 필드 조건 불일치, resultCd 기대값 차이", "WNG/DTC/LAST 수신 IF 분석, 유효성 검증 보완, TC 재시험", 1.40],
    ["VDP", "VDP CoCo", "TMC", "Endpoint 재확인, HTTP 401 인증 오류, Collection Status 신규", "Endpoint · API Key 재설정, 인증 보완, Notification 처리 추가", 1.00],
    ["ACOS", "ACOS API", "TMC", "본사 API 규격과 Request/Response 차이, Share User 409 오류", "필드 매핑 · 응답코드 처리 보완, 호출 순서 수정, 재시험", 1.25],
    ["ACOS", "ACOS Provisioning", "TMC", "Capable Partial 응답, MM Flag 미반환, DCM/MM/VDP Flag 조건 변경", "Flag 매핑 · 활성화 조건 분석, Opt-in/out 처리 보완", 1.35],
    ["외부 시스템", "MM/HU · DCM/ADF", "TMC", "Root CA 불일치 · ADF 등록 실패, H/U SU#1 버전, SubMCU 업데이트 오류", "인증서 · ADF 재등록, B Case 업데이트 · Key Writing, 오류 재현", 1.85],
    ["외부 시스템", "CTI/TCK", "TMKR", "24DCM 중계서버 영향으로 환경 분리, e-Care REST · CTN 연계 추가", "중계서버 분리 설계, REST API · CTN 처리 및 CCW 연동 검토", 0.90],
    ["외부 시스템", "Global/Local App", "TMKR", "Global App 일본 Auth0와 KR 테넌트 불일치, DeepLink 세션 오류", "Auth0 Tenant · Redirect 분석, 토큰 · 세션 처리 및 연계 검증", 0.55],
    ["외부 시스템", "DMS · Digital Key", "TMKR · TMC", "DMS 데이터 불일치, Warning Clear · Workflow 변경, DK White List", "DMS 매핑 · Workflow 보완, Platform Code 분기, DK 연동 시험", 1.30],
    ["외부 시스템", "uCUBE", "LGU+", "선개통 Callback 24DCM 환경 전달, svcEntr/chgsp 오류, 상태 정합성", "Callback 라우팅 수정, API 매핑 보완, 가입 · 해지 연계 수정", 0.95],
    ["DVT 수행", "DVT 영향 분석", "TMKR · TMC · LGU+", "API · IF 변경으로 TC 예상 결과 변경, 외부 환경 미구축 Blocked/N/T", "TC 영향 분석 · 예상 결과 수정, N/T 원인 분류 후 재수행", 0.50],
  ],
  detailHead: ["영역 (공수 · 귀책)", "세부 항목", "변경 유형", "발생 사유 · 확인 오류", "추가 · 변경 업무"],
  detail: [
    ["ACOS API 1.25 MM · TMC", "TSC-GC/GB API 규격 변경", "사양 변경", "본사 API와 Request/Response 구조 · 필드 차이", "필드 분석 · 매핑 수정, 처리 로직 보완, 재시험"],
    ["", "Upsert Share User 오류", "오류 대응", "등록 시 HTTP 409 · ReturnCode 130000 발생", "선행조건 분석, 호출 순서 · 오류 처리 보완"],
    ["", "API 응답코드 · 오류 처리", "사양 변경/오류", "API별 ReturnCode · 오류 처리조건 차이", "응답코드 매핑, 예외 처리 보완 · 검증"],
    ["ACOS Provisioning 1.35 MM · TMC", "Capable API Partial 오류", "오류 대응", "Capable 조회 시 000002(Partial) 응답", "원인 분석, 응답 비교, 환경 전환 후 재검증"],
    ["", "MM Provisioning Flag 오류", "오류 대응", "MM Flag 4개 미반환, Opt-in/out 오류", "DCM/MM Flag 조건 분석, 요청 구조 보완"],
    ["", "DCM/MM/VDP Flag 조건 변경", "사양 변경", "Flag 29 · 4 · 2개 구분, H/U 등록 여부별 조건", "Flag 매핑 · 활성화 조건 보완, 조합별 시험"],
    ["DCM/ADF 0.85 MM · TMC", "Root CA · 인증서 오류", "환경/오류", "인증서 · Root CA 불일치로 ADF 등록 실패", "인증서 분석, DCM 교체 지원, ADF 재시험"],
    ["", "H/U–DCM ADF 등록 오류", "오류 대응", "H/U 정보 ADF 미반영, MM 선행조건 미충족", "연결 상태 확인, CANoe ADF 재수행"],
    ["MM/HU 1.00 MM · TMC", "H/U SW 버전 불일치", "환경 변경", "보유 H/U가 SU#1, SU#2 Provisioning 불가", "버전 분석, B Case 업데이트 절차 검토"],
    ["", "Factory Backup · Key Writing", "추가 작업", "매뉴얼에 없는 Key Writing 작업 추가", "백업 수행, Key Writing 적용 · 결과 확인"],
    ["", "SubMCU 업데이트 오류", "오류 대응", "5회 수행에도 성공 확인 파일 미생성", "로그 · USB 확인, 재현, 일본 개발팀 질의"],
    ["VDP CoCo 1.00 MM · TMC", "Endpoint · API Key 변경", "환경 변경", "초기 IP가 Diag 서버, 요청 시 HTTP 401", "Endpoint 재설정, API Key 확인, 연결시험"],
    ["", "Center Request 인증 오류", "오류 대응", "HTTP 401 발생, 인증정보 수정 후 200 정상", "인증정보 · 호출 설정 보완, 재시험"],
    ["", "Collection Status 알림", "기능 추가", "기존 시험 범위 외 Notification 처리 필요", "수신 API 분석, 처리 로직 추가 개발"],
    ["VDP Diag 1.40 MM · TMC", "WNG/DTC/LAST 수신 IF", "신규 연계", "Diag 서버 미연동, 메시지 구조 확인 필요", "IF 분석, 수신 필드 · 검증 로직 보완"],
    ["", "WNG TC 1-1-1/1-1-2 오류", "오류 대응", "x-api-key 불일치, 필드 · odometer 데이터 오류", "유효성 검증 보완, TC 재시험"],
    ["", "WNG TC 1-1-3 응답 불일치", "사양 불일치", "details=[]에 KR 90 반환, JP 기대값 0", "빈 배열 허용조건 분석, TMC 사양 협의"],
    ["CTI/TCK 0.90 MM · TCK(TMKR)", "27CY SU#2 중계서버 분리", "요구사항 변경", "기존 24DCM 서버 사용 시 서비스 영향", "서버 확장 검토, Pre-PROD 라우팅 분리 설계"],
    ["", "e-Care REST API · CTN 연계", "IF 변경", "MQTT→REST 전환, CTN 연계조건 추가", "REST 구조 분석, CTN Request · CCW 연동 검토"],
    ["DMS 1.05 MM · DMS(TMKR)", "DMS API 데이터 정합성", "오류 대응", "DMS-WAM 요청 · 응답 데이터 불일치", "데이터 매핑 분석, 응답 · 오류 검증 보완"],
    ["", "Warning Clear · 상담 Workflow", "요구사항 변경", "Warning Clear · Workflow 종료 조건 추가", "Warning Clear 연계, 상담 상태 로직 보완"],
    ["", "차량정보 · Platform Code", "기능 변경", "24DCM · 27CY SU#2 차량 구분 조건 필요", "차량정보 분기 확인, 환경별 처리 검증"],
    ["uCUBE 0.95 MM · LGU+", "선개통 Callback 환경 오류", "오류 대응", "선개통 결과가 24DCM 검증환경으로 전달", "Callback URL · 라우팅 분석, 경로 수정"],
    ["", "svcEntr/chgsp API 오류", "오류 대응", "서비스 조회 · 변경 API 응답 처리 오류", "필드 매핑 · 오류 처리 보완, 재시험"],
    ["", "서비스 상태 · 해지 연계", "연동/기능 보완", "가입 · 해지 상태와 WAM/ACOS 정합성 확인", "상태값 분석, 변경 · 해지 연계 로직 보완"],
    ["Global/Local App 0.55 MM · TMKR", "Auth0 테넌트 불일치", "환경/오류", "일본 Auth0와 KR 테넌트 상이, 연결 불가", "Tenant · Redirect 분석, 인증환경 분리 검토"],
    ["", "DeepLink 인증 세션 오류", "오류 대응", "Local App 전환 시 login_required 발생", "인증 흐름 분석, 토큰 · 세션 처리 검증"],
    ["Digital Key 0.25 MM · TMC", "TSC-DK Wrapper 신규 연계", "환경 변경", "송신 IP · 신규 Endpoint White List 필요", "Notification API 설정, 네트워크 구성 · 시험"],
    ["DVT 영향 분석 0.50 MM · LGU+", "변경 사양에 따른 TC 수정", "테스트 변경", "API · IF 변경으로 TC 예상 결과 상이", "TC 영향 분석, 예상 결과 수정, 재시험"],
    ["", "Blocked/N/T 재시험 대응", "테스트 추가", "외부 환경 미구축 · 선행조건 미충족", "N/T 원인 분류, 환경 변경 후 재수행"],
  ],
  notes: [
    "8.10 MM과의 구분: Upsert Administrator · Capable API는 7/27 규격 기준으로 개발 완료 후, 10월 TMC가 정책(SkipVehicleAuthentication)과 응답 구조를 다시 변경하여 발생한 재작업임",
    "산정 기준: DVT 기간 추가 · 변경 업무 11.05 MM 전체를 요청에 반영함 (LGU+ 연계 시스템 uCUBE 대응 0.95 MM 포함). 1 MM = 20 근무일",
    "Digital Key 발생 일자는 개발팀 확인 후 갱신 예정",
  ],
  split: [["29.00 MM", "10 ~ 11월 실투입 (계약상 6 MM 대비 실제 35 MM)", "인지"], ["11.05 MM", "TMC · TMKR 7/27 이후 변경 · 정정 · 연동 대응 (10.01 ~ 11.17)", "정산 요청"], ["17.95 MM", "DVT 시험 · 결함 분석 · 수정 · 재시험 (기타 연계 포함)", "인지"]],
};

appendix.changeLog = {
  id: "change-log", code: "A14", title: "7/27 최종 규격 이후 변경 · 정정 이력",
  message: "8월 TMC 규격 확정 지연, 9월 일정 변경, 10월 Endpoint · API 규격 정정, 11월 Provisioning · CTI · 인증 연계 이슈로 이어짐",
  source: "출처: " + DECK2 + " p.15, p.85 (메일 이력 1차 정리. 월 단위 표기는 수신일 확인 후 갱신 예정. LGU+ 연계 시스템 항목 제외)",
  head: ["발생일", "주체", "변경 내용", "LGU+ · 개발팀 수행 업무", "관련 영역 (A13)"],
  rows: [
    ["08.26", "TMC", "VDP CoCo / Diag 담당자 및 인터페이스 사양 협의 시작, 일부 사양 확정 지연 통보", "인터페이스 분석 및 연계 설계 착수", "VDP Diag"],
    ["08 ~ 09월", "TMC", "대만 계정 공유 문제로 VDP 사양 확정 일정 연기 (8월 → 9/4)", "개발 일정 재조정, 사양 미확정 상태 선행 분석", "VDP Diag"],
    ["09월 초", "TMC · TMKR", "프로젝트 일정 변경 및 DVT 일정 재조정 요구", "개발 인력 계획 수정, 추가 공수 산정", "DVT 일정"],
    ["09월 초", "TMC · TMKR", "Pre-Prod Regression Test 추가 요구", "시험 범위 확대 및 대응 계획 수립", "DVT 영향 분석"],
    ["09월 중", "TMC · TMKR", "계약 시점 → 6/30 → 9/15 일정으로 변경 반영 요구", "일정표 및 인력계획 재작성", "DVT 일정"],
    ["10.06", "TMC", "VDP 접속용 IP 제공", "네트워크 연결 시험 수행", "VDP Diag"],
    ["10.06 ~ 10", "TMC", "제공 IP · 접속정보가 실제 대상이 아닌 것으로 확인, Endpoint 정보 정정", "로그 분석, 재시험, 환경 재설정", "VDP Diag · CoCo"],
    ["10.15", "TMC", "Notify Vehicle Registration Status Change API 변경 (DeRegistered 제거)", "WAM 영향도 분석 및 수정 검토", "ACOS API"],
    ["10월", "TMC", "x-api-key 인증 방식 적용 요구", "인증 모듈 수정 및 검증", "VDP CoCo · Diag"],
    ["10월", "TMC", "Upsert Vehicle Administrator API 처리 정책 변경 (SkipVehicleAuthentication=True)", "한국향 적용 검토 및 재시험", "ACOS API"],
    ["10월", "TMC", "TSC-GC Migration 이후 Capable API 응답 변경", "로그 분석 및 재검증", "ACOS Provisioning"],
    ["10 ~ 11월", "TMC", "Provisioning Flag / Capable API 동작 변경", "Flag 조합 분석 및 재시험", "ACOS Provisioning"],
    ["10 ~ 11월", "TMC", "MM Flag 처리 및 MM Provisioning 요구 발생", "MM Upgrade, ADF 재등록, 검증", "MM/HU · DCM/ADF"],
    ["10 ~ 11월", "TMC", "Collection Status Notification 추가 요구", "신규 개발 및 검증", "VDP CoCo"],
    ["11월", "TMKR · TMC", "CTI 연동 프로토콜 변경 및 신규 연계 요구", "CTI/TCK 연계 개발", "CTI/TCK"],
    ["11월", "TMC · TMKR", "Auth0 Tenant 불일치 이슈 확인", "인증 연계 영향도 분석", "Global/Local App"],
  ],
};

appendix.extraDvt = {
  id: "extra-dvt", code: "A15", title: "추가 DVT 기간 예측 공수 (2026.11.18 ~ 2027.01.29)",
  message: "TMC 측 선행 조건이 해소되지 않아 잔여 N/T 352건이 남아 있고, DVT 실질 종료(2027.01)까지 26.95 MM이 필요할 것으로 예측함. 본 요청 합계 23.01 MM에는 포함하지 않음",
  source: "출처: " + DECK2 + " p.12, p.19~20, p.73~74. 11.18 이후 계약된 개발 인력은 없는 상태",
  issues: [
    ["MM/HU · ACOS Provisioning", "TMC", "SU#1 H/U, SubMCU 업데이트 5회 완료 확인 불가. MM Capable 4개 항목 미반환, Flag 조합별 Opt-in/out 추가 검증 필요"],
    ["VDP Diag", "TMC", "11/13 최초 실연동, 24 TC 중 2건 완료 · 1건 보류 · 21건 미수행. x-api-key 불일치, WNG 필드 조건, odometer · resultCd 처리 이슈"],
    ["CTI/TCK 중계 연동", "TMKR · TMC", "27CY SU#2 전용 연계환경 구성 필요. e-Care REST API · CTN 전달, CCW 통화 E2E 미수행"],
    ["DMS 연동", "TMKR", "VDP 실데이터 미수신으로 시뮬레이터 대체 시험. Warning Clear · 상담 Workflow 처리 조건 추가 검토"],
    ["ACOS API 사양", "TMC", "TSC-GC/GB Request/Response 변경 영향 지속. Redoc 사양 변경 · Pre-PROD 반영 일정에 따른 추가 개발 가능성"],
  ],
  result: { head: ["구분", "전체 TC", "Pass", "Fail", "NT", "Pass 비율"], rows: [["GS (11/17)", "326", "264", "3", "59", "81.0%"], ["e-Care (11/17)", "528", "269", "0", "259", "50.9%"], ["DMS (11/17)", "114", "78", "2", "34", "68.4%"], ["합계", "968", "611", "5", "352", "63.1%"]] },
  resultNotes: ["e-Care NT 259건: CCW 236건 전량 CTI 내선번호 · CAN Configuration 파일 미확보, OPW 23건은 CAN Config 미확보 · 실패 환경 미구성", "GS NT 59건: HU 구성 후 검증 22건, 선행 이슈 Blocked 17건, 기간 설정 필요 12건, DCM · DK 서버 등 기타 8건", "DMS NT 34건: 선행 이슈 Blocked 17건, CTI 연결 7건, HU 연결 4건, 기타 6건", "잔여 Fail 5건: GS 3건(프로비저닝 플래그 2, CCW 해지 오류 1), DMS 2건(WNG Symbol 덮어쓰기, CCW 위치 라벨)"],
  head: ["영역", "주요 업무", "MM"],
  areas: [
    ["VDP Diag", "WNG/DTC/LAST/Notification 잔여 TC 검증 · 오류 수정", 4.20], ["ACOS Provisioning", "MM Flag · Opt-in/out · DCM/VDP Flag 처리 보완", 2.65], ["e-Care", "Warning Grouping · Clear Event · Workflow 검증", 2.65],
    ["DVT / QA", "잔여 N/T 재수행 · 전체 E2E · 회귀시험 · 종료 검증", 2.55], ["CTI/TCK", "중계서버 연계 · CCW 통화 E2E 검증", 2.45], ["ACOS API", "TSC-GC/GB · Upsert · Consent 오류 수정 · 검증", 2.30],
    ["VDP CoCo", "Callback · Center Request · Collection Status 연동", 2.20], ["uCUBE", "선개통 · 가입/변경/해지 · 정합성 검증", 2.00], ["DMS", "차량 · 예약 · 상담 API 및 Warning 연계 수정 · 검증", 1.95],
    ["Global/Local App", "Auth0 · DeepLink · 서비스 가입 E2E 검증", 1.85], ["MM/HU", "B Case 업데이트 정상화 · ADF 재등록 · MM Capable 확인", 1.45], ["Digital Key / 인프라", "TSC-DK 연계 및 환경 변경 추가 검증", 0.70],
  ],
  periods: [["11/18 ~ 11/30", "연동 장애 해소, 환경 정상화, E2E 진입 대응", 4.60], ["12/01 ~ 12/31", "잔여 기능 수정, 외부 연동시험, E2E 진입 대응", 11.75], ["2027.01.01 ~ 01.29", "잔여 N/T 해소, 결함 수정, 최종 회귀시험", 10.60]],
  schedule: { head: ["구분", "2026년 12월 말 완료", "2027년 1월 말 완료"], rows: [["목표", "잔여 N/T 0건, 주요 결함 수정 완료", "잔여 N/T 0건, 주요 결함 수정 완료"], ["외부 연계 선행 조건", "11월 중 TMC 측 주요 선행 조건 해소 필요", "12월 중 단계적 해소 가능"], ["개발 · QA 투입", "집중적인 병렬 투입 필요", "단계별 투입 및 반복 검증"], ["일정 위험 / 의견", "현실적으로 불가 예상 · 조건부 단축 협의 필요", "현실적인 일정으로 예상"]] },
  notes: ["분석 5.40 · 설계 4.15 · 개발 7.25 · 테스트 10.15 = 26.95 MM", "각 서비스 모듈 담당자는 변경 및 이슈 대응을 위해 검증 기간 중 유지되어야 함", "본사 API 사양 변경 · Pre-PROD 반영이 2027년 2월 이후 확정될 경우, 별도 일정 · 공수로 관리하거나 DVT 종료 기준 재협의 필요"],
};
// DVT 수행 실적: 11.17 기준 결과 행 추가
appendix.dvtRun.result.rows.push(["GS (11/17)", "326", "264", "3", "59", "81.0%"], ["e-Care (11/17)", "528", "269", "0", "259", "50.9%"], ["DMS (11/17)", "114", "78", "2", "34", "68.4%"]);
appendix.dvtRun.result.notes.push("11.17 기준 3개 구분 합계 968건: Pass 611, Fail 5, NT 352. 상세는 A15 참조");

// 11.05 MM 증적 연결: 영역별로 이력(A14 행), PPT 쪽수, 관련 부록을 묶음
const chgEv = {
  "VDP Diag": { log: [1, 2, 6, 7], deck: "p.71~72 · p.76", more: [["vdp", "A7 VDP 연계 경과"]] },
  "VDP CoCo": { log: [7, 9, 14], deck: "p.71 · p.76", more: [["vdp", "A7 VDP 연계 경과"], ["dvt-run", "A10 DVT 수행 실적"]] },
  "ACOS API": { log: [8, 10], deck: "p.71", more: [["dvt-run", "A10 DVT 수행 실적"]] },
  "ACOS Provisioning": { log: [11, 12], deck: "p.71", more: [["dvt-run", "A10 DVT 수행 실적"]] },
  "MM/HU · DCM/ADF": { log: [13], deck: "p.71", more: [["dvt-run", "A10 DVT 수행 실적"]] },
  "CTI/TCK": { log: [15], deck: "p.72", more: [] },
  "Global/Local App": { log: [16], deck: "p.72", more: [["dvt-run", "A10 DVT 수행 실적"]] },
  "DMS · Digital Key": { log: [], deck: "p.72", more: [["dvt-run", "A10 DVT 수행 실적"]] },
  "uCUBE": { log: [], deck: "p.72", more: [] },
  "DVT 영향 분석": { log: [3, 4, 5], deck: "p.72", more: [["dvt-run", "A10 DVT 수행 실적"], ["dvt", "A5 DVT 일정"]] },
};
appendix.dvtChg.ev = chgEv;
appendix.dvtChg.story = { total: "29.00", ack: "17.95", ask: "11.05", lead: "10 ~ 11월 실투입은 29.00 MM이지만, 최종적으로 요청하는 공수는 7/28 이후 변경 · 정정 · 연동 대응으로 발생한 11.05 MM입니다" };

summary.narrative = {
  title: "어떤 사유로 어떤 영향이 생겨 이 공수가 발생했는가",
  paras: [
    ["사유", "이 과제는 4월 계약 시점에 TMC가 서버와 규격을 적기에 제공한다는 전제로 일정과 인력을 정했습니다. 그래서 8월에는 Global South DVT, 9월에는 e-Care DVT를 수행하고, 10월 이후에는 E2E 대응에 필요한 최소 인력만 배치해 두었습니다. 그런데 04.20에 받은 최초 ACOS 규격은 06.28에 34개 API 중 24개가, 최종 규격이 나온 07.27에 다시 9개가 바뀌어 모두 33건의 변경에 대응해야 했고, 그 뒤로도 Service Flag 등의 변경이 이어졌습니다. 그 결과 Global South 개발 범위의 약 60%가 다시 검토하고 수정하고 재검증해야 하는 대상이 되었습니다."],
    ["8 · 9월에 발생한 공수 8.10 MM", "최종 규격이 07.27에야 확정되었기 때문에, 변경된 규격을 반영하는 개발이 DVT보다 먼저 이루어져야 했습니다. 8월과 9월에 DVT를 수행하도록 배정되어 있던 인력은 시험 대신 07.28부터 09.30까지 12개 항목의 수정과 추가 개발(162 MD)을 맡았고, 이어서 DVT에 들어가기 위한 9월 내부 테스트까지 수행했습니다. 내부 테스트는 계약 계획에 없던 작업입니다. 이 두 달의 계획 인력은 42.2 MM이었지만 실제로는 50.3 MM이 투입되어 계약 대비 8.10 MM이 늘었고(8월 −2.2 MM, 9월 +10.3 MM), 이는 12개 항목 공수의 합계와 같은 값입니다. 이 8.10 MM을 규격 변경 추가 개발 공수로 요청드립니다."],
    ["10 · 11월에 발생한 공수 29.00 MM", "DVT는 TMC의 VDP와 PGM 개발이 늦어 시험 환경을 구성할 수 없었기 때문에, 계획했던 8~9월이 아니라 10.06부터 11.17까지로 밀렸습니다(09.15와 09.22에 서면으로 공유했고, 10.04에 TMC 기준 일정이 확정되었습니다). 계약상 이 기간에는 E2E 대응을 위한 최소 인력 6.0 MM만 잡혀 있었는데, 실제로는 DVT 1차부터 3차까지의 시험을 수행하느라 35.0 MM(10월 18 MM, 11월 17 MM)이 투입되었고 계약 대비 29.00 MM이 늘었습니다. 같은 인력이 8~9월에는 변경 개발을, 10~11월에는 뒤로 밀린 DVT를 수행한 것이며, 일이 없어 대기한 시간은 산정에 넣지 않았습니다. 10~11월 투입은 11.17까지의 기투입 공수입니다."],
    ["그중 최종적으로 요청하는 공수 11.05 MM", "다만 29.00 MM 전부를 요청하지는 않습니다. DVT 기간에도 7/27 이후 TMC와 TMKR의 변경과 정정이 계속되었습니다. Service Flag가 34개에서 53개로 늘었고, VDP 접속 정보와 Endpoint가 정정되었으며, x-api-key 인증 적용, Upsert Administrator 정책과 Capable 응답의 변경, MM Provisioning 요구, Collection Status 알림 추가, CTI 연동 프로토콜 변경과 Auth0 테넌트 불일치가 차례로 발생했습니다. 이런 일은 단순히 시험을 수행하는 것으로 끝나지 않고 분석과 개발, 재검증이 필요했으며, 10.01부터 11.17까지 이 대응에 11.05 MM이 투입되었습니다. 나머지 17.95 MM은 시험 결과 분석과 결함 수정, 재시험에 쓰인 공수로, 계약보다 많이 투입되었다는 사실만 인지해 주시기를 요청드립니다."],
    ["최종 요청", "정리하면 8·9월의 규격 변경 추가 개발 8.10 MM과 10·11월의 변경·연동 대응 11.05 MM, 그리고 TMKR의 신규 요청으로 별도 산정한 e-Care 콜버튼 3.86 MM을 합친 23.01 MM이 최종 요청 공수입니다. 11.18 이후에도 DVT가 이어질 경우 필요한 예측 공수 26.95 MM은 이 합계에 넣지 않고 따로 제안드립니다."],
  ],
};

// 첫 장 한 장 구성: 본문은 핵심만, 전체 서술은 우측 drawer(상세 보기)
const shortNar = [
  "4월 계약은 TMC의 규격 · 서버 적기 제공을 전제로 했으나, 규격이 06.28(24개)과 07.27(9개)에 바뀌어 Global South 개발 범위의 약 60%를 다시 작업해야 했습니다.",
  "DVT에 배정된 인력이 변경 개발 12개 항목(162 MD)과 계획에 없던 내부 테스트를 먼저 수행해, 계획 42.2 MM 대비 50.3 MM이 투입되었고 증가분 8.10 MM을 요청합니다.",
  "TMC의 VDP · PGM 지연으로 DVT가 10.06 ~ 11.17로 밀리면서, 계약상 최소 인력 6.0 MM 대신 35.0 MM이 투입되어 29.00 MM이 늘었습니다.",
  "29.00 MM 중 7/27 이후 TMC · TMKR의 변경 · 정정에 대응한 11.05 MM만 요청하고, 시험 · 결함 대응 17.95 MM은 인지만 요청합니다.",
  "8.10 + 11.05 + e-Care 콜버튼 3.86 = 23.01 MM이 최종 요청이며, 11.18 이후 추가 DVT 예측 26.95 MM은 별도로 제안합니다.",
];
summary.narrative.paras = summary.narrative.paras.map((x, i) => [x[0], x[1], shortNar[i]]);
summary.narrative.title = "무엇 때문에, 어떤 공수가 발생했는가";

// ── 2026.11.19 반영: uCUBE(LGU+ 연계 시스템) 청구 제외 → 요청 22.06 MM(③ 10.10 MM), 추가 DVT 24.95 MM ──
const swap = (s) => s
  .replace(/23\.01 MM/g, "22.06 MM").replace(/11\.05 MM/g, "10.10 MM").replace(/26\.95 MM/g, "24.95 MM");
summary.headline = swap(summary.headline);
summary.ask = "요청 공수 합계 22.06 MM에 대한 검토 및 인정을 요청드립니다 (LGU+ 연계 시스템 uCUBE 대응 0.95 MM은 청구에서 제외)";
summary.equation[2] = { v: "10.10", unit: "MM", label: "③ DVT 기간 변경 · 연동 대응", desc: "10.01 ~ 11.17 · uCUBE 0.95 제외" };
summary.equation[3] = { v: "22.06", unit: "MM", label: "요청 공수 합계", desc: "기존 23.01 MM에서 uCUBE 0.95 MM 제외" };
summary.steps[2] = { ...summary.steps[2], title: "DVT 기간 변경 · 연동 대응 10.10 MM", body: "7/27 이후 ACOS 추가 변경과 VDP · PGM 등 TMC 서버 · 환경 지연에 대응해 DVT 기간(10.01 ~ 11.17)에 분석 · 개발 · 재검증이 발생. 10 ~ 11월 실투입 29.00 MM 중 10.10 MM만 정산 요청(uCUBE 0.95 MM은 LGU+ 사유로 청구 제외), 나머지 18.90 MM은 인지 요청" };
summary.principle.items = summary.principle.items.map((x) => ({ k: x.k, v: swap(x.v) }));
summary.principle.items.splice(1, 0, { k: "LGU+ 사유 청구 제외", v: "uCUBE(LGU+ 연계 시스템) 대응분은 청구하지 않음: 10 ~ 11월 0.95 MM, 추가 DVT 예측 2.00 MM" });
summary.narrative.paras = summary.narrative.paras.map((x) => x.map(swap));
summary.narrative.paras[3][0] = "그중 최종적으로 요청하는 공수 10.10 MM";
summary.narrative.paras[3][1] = summary.narrative.paras[3][1].replace("10.01부터 11.17까지 이 대응에 10.10 MM이 투입되었습니다.", "10.01부터 11.17까지 이 대응에 11.05 MM이 투입되었고, 이 중 LGU+ 연계 시스템(uCUBE) 대응 0.95 MM은 청구에서 제외해 10.10 MM을 요청드립니다.");
summary.narrative.paras[3][2] = "29.00 MM 중 7/27 이후 TMC · TMKR의 변경 · 정정에 대응한 10.10 MM만 요청하고(uCUBE 0.95 MM 제외), 시험 · 결함 대응 등 18.90 MM은 인지만 요청합니다.";
summary.narrative.paras[4][2] = "8.10 + 10.10 + e-Care 콜버튼 3.86 = 22.06 MM이 최종 요청이며, 11.18 이후 추가 DVT 예측 24.95 MM(uCUBE 제외)은 별도로 제안합니다.";
appendix.callbtn.source = swap(appendix.callbtn.source);

const D3 = "CCB 자료 2026.11.19";
appendix.dvtChg.title = "DVT 기간 변경 · 정정 대응 업무와 공수 10.10 MM (10.01 ~ 11.17)";
appendix.dvtChg.message = "7/27 규격 배포 이후 ACOS 추가 변경과 VDP · PGM 등 TMC 서버 · 환경 지연에 개발 인력이 분석 · 개발 · 재검증으로 대응함. 청구 대상은 uCUBE(0.95 MM)를 제외한 10.10 MM";
appendix.dvtChg.source = "출처: " + D3 + " p.11, p.70~71 (발생 시점은 Jira · 주간보고 · 메일 이력 기준)";
appendix.dvtChg.head = ["분류", "영역", "귀책 · 진행 일정", "주요 발생 사유 · 확인 오류", "수행 업무 → 현재 결과", "MM"];
appendix.dvtChg.rows = [
  ["① ACOS 추가 변경 (2.60)", "ACOS API", "TMC · 10.15 Notify Vehicle Reg. 변경, 10월 Upsert 정책 변경, 10~11월 Share User 409", "7/27 이후 정책 · 응답 재변경 (SkipVehicleAuthentication, DeRegistered 제거), Share User 409", "영향도 분석, 로직 · 응답코드 보완, 재시험 → Upsert · Capable 반영 · 재검증 완료, TSC-GC/GB 영향 지속", 1.25],
  ["① ACOS 추가 변경 (2.60)", "ACOS Provisioning", "TMC · 10월 Migration 후 Capable 응답 변경, 11월 초 MM Flag 미반환", "Capable Partial 응답, DCM / MM / VDP Flag 조건 변경 (29 · 4 · 2개)", "Flag 매핑 · 활성화 조건, Opt-in/out 보완 → Capable 반영 완료, MM Capable 4개 미해소(11/18 이후 지속)", 1.35],
  ["② VDP · PGM 등 TMC 서버 · 환경 지연 (4.50)", "VDP Diag", "TMC · 08.26 사양 협의 → 9/4 확정 연기 → 11/13 최초 실연동(~11/16)", "Diag 서버 미연동, x-api-key · 필드 조건 불일치, resultCd 기대값 차이", "수신 IF 분석, 유효성 검증 보완, 재시험 → 24 TC 중 2 완료 · 1 보류 · 21 미수행", 1.40],
  ["② VDP · PGM 등 TMC 서버 · 환경 지연 (4.50)", "VDP CoCo", "TMC · 10.06 접속 9건 Timeout → 10.22 401 → 10.26 /v1 정정 → 10.27 재시험", "제공 IP가 CoCo 대상 아님, Endpoint 정정, HTTP 401, Collection Status 신규", "Endpoint · Key 재설정, 인증 · Notification 보완 → Center Request 정상, Callback 검증 중", 1.00],
  ["② VDP · PGM 등 TMC 서버 · 환경 지연 (4.50)", "MM/HU · DCM/ADF", "TMC · 10월 말 MM Provisioning 요구, 11/15 SubMCU 5회 실패", "Root CA 불일치로 ADF 등록 실패, 보유 H/U SU#1 버전, SubMCU 업데이트 오류", "인증서 · ADF 재등록, B Case · Key Writing → 미해소, 11/18 이후 지속 대응", 1.85],
  ["② VDP · PGM 등 TMC 서버 · 환경 지연 (4.50)", "Digital Key", "TMC · TSC-DK Wrapper 신규 연계 (일자 확인 중)", "송신 IP · 신규 Endpoint White List 필요", "Notification API 설정, 네트워크 시험 → 연동 환경 확인 진행 중", 0.25],
  ["③ TMKR 연계 변경 (2.50)", "CTI/TCK", "TMKR · 10/26 전후 연계 필요 확인", "24DCM 중계서버 영향으로 환경 분리, e-Care REST · CTN 연계 추가", "중계서버 분리 설계, REST · CTN 처리 검토 → SU#2 전용 환경 필요, CCW E2E 미수행", 0.90],
  ["③ TMKR 연계 변경 (2.50)", "Global/Local App", "TMKR · 11월 초~중순 Auth0 검토", "Global App 일본 Auth0와 KR 테넌트 불일치, DeepLink 세션 오류", "Auth0 Tenant · Redirect, 토큰 · 세션 처리 → TMC 설정 변경 협의 중", 0.55],
  ["③ TMKR 연계 변경 (2.50)", "DMS", "TMKR · 10/28 DMS 사양 변경판", "DMS 데이터 불일치, Warning Clear · Workflow 변경, Platform Code 분기", "DMS 매핑 · Workflow 보완, 환경별 검증 → 실데이터 미수신, 시뮬레이터 대체 시험", 1.05],
  ["④ DVT 영향 분석 (0.50)", "DVT 영향 분석", "TMKR · TMC · 9월 초 Regression 추가, 10.06~11.17 TC 수정", "API · IF 변경으로 TC 예상 결과 변경, 외부 환경 미구축 Blocked/N/T", "TC 영향 분석 · 예상 결과 수정 → N/T 352건 원인 분류, 재수행 대기", 0.50],
];
appendix.dvtChg.detail = appendix.dvtChg.detail.filter((r, i, a) => !(r[0].startsWith("uCUBE") || (r[0] === "" && a.slice(0, i).reverse().find((x) => x[0])?.[0].startsWith("uCUBE"))));
appendix.dvtChg.notes = [
  "8.10 MM과의 구분: Upsert Administrator · Capable API는 7/27 규격 기준으로 개발 완료 후, 10월 TMC가 정책(SkipVehicleAuthentication)과 응답 구조를 다시 변경하여 발생한 재작업임",
  "청구 기준: DVT 기간 추가 · 변경 업무 11.05 MM 중 LGU+ 연계 시스템 uCUBE 대응 0.95 MM은 청구에서 제외하고 10.10 MM을 요청함. 1 MM = 20 근무일",
  "Digital Key 발생 일자는 개발팀 확인 후 갱신 예정",
];
appendix.dvtChg.split = [["29.00 MM", "10 ~ 11월 실투입 (계약상 6 MM 대비 실제 35 MM)", "인지"], ["10.10 MM", "TMC · TMKR 7/27 이후 변경 · 정정 · 연동 대응 (10.01 ~ 11.17)", "정산 요청"], ["0.95 MM", "uCUBE 연계 대응 (LGU+ 사유)", "청구 제외"], ["17.95 MM", "DVT 시험 · 결함 분석 · 수정 · 재시험 (기타 연계 포함)", "인지"]];
appendix.dvtChg.story = { total: "29.00", ack: "18.90", ask: "10.10", lead: "10 ~ 11월 실투입은 29.00 MM이지만, 최종적으로 요청하는 공수는 7/28 이후 변경 · 정정 · 연동 대응 중 uCUBE를 제외한 10.10 MM입니다" };
delete chgEv["uCUBE"];
delete chgEv["DMS · Digital Key"];
for (const k of Object.keys(chgEv)) chgEv[k].deck = chgEv[k].deck.replace(/p\.(\d+)/g, (m, n) => "p." + (+n - 1));
chgEv["DMS"] = { log: [], deck: "p.71", more: [["dvt-run", "A10 DVT 수행 실적"]] };
chgEv["Digital Key"] = { log: [], deck: "p.71", more: [] };

appendix.extraDvt.title = "추가 DVT 기간 예측 공수 24.95 MM (2026.11.18 ~ 2027.01.29, uCUBE 제외)";
appendix.extraDvt.message = "TMC 측 선행 조건이 해소되지 않아 잔여 N/T 352건이 남아 있고, DVT 실질 종료(2027.01)까지 uCUBE를 제외한 24.95 MM이 필요할 것으로 예측함. 월 환산 인원은 QA 포함 약 9.5 · 9.9 · 9.8명으로, 4월 계획상 9월 개발 인력 10명 이내. 본 요청 합계 22.06 MM에는 포함하지 않음";
appendix.extraDvt.source = "출처: " + D3 + " p.17~19, p.72~73";
appendix.extraDvt.areas = appendix.extraDvt.areas.filter((r) => r[0] !== "uCUBE");
appendix.extraDvt.periods = [["11/18 ~ 11/30", "연동 장애 해소, 환경 정상화, E2E 진입 대응", 4.26], ["12/01 ~ 12/31", "잔여 기능 수정, 외부 연동시험, E2E 진입 대응", 10.88], ["2027.01.01 ~ 01.29", "잔여 N/T 해소, 결함 수정, 최종 회귀시험", 9.81]];
appendix.extraDvt.notes = [
  "uCUBE 2.00 MM 제외(기존 26.95 MM). 기간별 값은 비례 차감한 값이며 단계별(분석 · 설계 · 개발 · 테스트) 구분은 재산정 예정",
  "월 환산 인원 = MM ÷ (기간 근무일 ÷ 20): 11/18~30 약 9.5명, 12월 약 9.9명, 1월 약 9.8명 (QA 포함). 10 · 11월 실적은 개발 인력만 13 · 13 MM (품질 · 기획 제외)",
  "각 서비스 모듈 담당자는 변경 및 이슈 대응을 위해 검증 기간 중 유지되어야 함",
  "본사 API 사양 변경 · Pre-PROD 반영이 2027년 2월 이후 확정될 경우, 별도 일정 · 공수로 관리하거나 DVT 종료 기준 재협의 필요",
];

module.exports = {
  meta: {
    title: "ACOS 규격 확정 지연 대응 추가 공수 협의",
    project: "Global South Project",
    owner: "LGU+",
    kicker: "LGU+ · Global South Project · CCB 안건",
    date: "2026.11.11",
    modes: { plan: "기존 계획", changed: "변경" , planSub: "계약 기준", changedSub: "ACOS 규격 지연 대응" },
    // 장표 변경 이력 (최신이 위)
    changelog: [
      { v: "v14", at: "2026.11.19 10:00", items: ["uCUBE(LGU+ 연계 시스템) 대응분 청구 제외: 요청 합계 23.01 → 22.06 MM, ③ DVT 변경 · 연동 대응 11.05 → 10.10 MM", "A13을 4개 분류(ACOS 추가 변경 · TMC 서버 · 환경 지연 · TMKR 연계 변경 · DVT 영향 분석)로 재구성하고 진행 일정 · 현재 결과 추가", "A15 추가 DVT 예측 26.95 → 24.95 MM (uCUBE 2.00 제외), 월 환산 인원 · 개발 인력 실적 기준 명시"] },
      { v: "v13", at: "2026.11.14 12:20", items: ["5장 보완: 단계는 클릭 · Space로만 진행, 8 ~ 9월 수행 업무 표기 정정 (GS · e-Care 변경 개발 · 내부 테스트), 근거 자료를 사이드 패널로 이동", "합계 강조의 안내 문구 삭제"] },
      { v: "v12", at: "2026.11.14 10:40", items: ["메인 5장을 양사 시각 정리로 재구성: 8 ~ 9월 같은 인력의 업무 변경, 10 ~ 11월 계획에 없던 기간의 신규 투입을 단계별 애니메이션으로 표시 (공수 숫자 변경 없음)", "5장에 근거 자료 링크 (Appendix, TMKR Confluence · Jira) 추가"] },
      { v: "v11", at: "2026.11.13 10:10", items: ["메인 5장 추가: 8 ~ 9월 투입 50.3 MM의 업무 구성과 추가 요청 8.10 MM의 의미"] },
      { v: "v10", at: "2026.11.12 22:10", items: ["합계 강조선이 숫자를 가리지 않도록 선의 시작 · 끝을 숫자 테두리 바깥으로 조정"] },
      { v: "v9", at: "2026.11.12 14:40", items: ["Appendix A10 DVT 수행 실적, A11 DVT 투입 인력 및 공수 산정 추가 (CCB 자료 v45 반영)", "4장 10 · 11월 실제 투입 근거에서 DVT 수행 실적으로 연결"] },
      { v: "v8", at: "2026.11.12 10:15", items: ["합계 숫자를 누르면 더해지는 숫자를 강조하고 선과 계산식으로 표시 (메인 1 · 3 · 4장, Appendix 표)"] },
    { v: "v7", at: "2026.11.12 09:50", items: ["Space 키로 기존 계획 · 변경 전환", "장표 변경 이력 보기 추가"] },
    { v: "v6", at: "2026.11.12 09:40", items: ["4장 계약 시점 공수 칸에 계획 업무 · 실제 수행 업무 · 공수 증감 상세 추가", "마우스 휠로 페이지 이동", "ACOS 계약 관련 표현 정리"] },
    { v: "v5", at: "2026.11.12 00:05", items: ["모든 페이지를 같은 화면 비율로 통일하고 전체 화면에서 확대", "4장 공수 표의 항목 색상을 숫자에 적용"] },
    { v: "v4", at: "2026.11.11 23:57", items: ["추가 공수 · 일정 변경 공유 이력을 PM 정례회의록 기준으로 정리하고 A1에 출처 표기", "요약에 증적 검토 현황, 11월 실적 확정 방식, 비용 제시 시점 설명 추가", "F 키 전체 화면, 4장 공수 표 항목별 색상"] },
    { v: "v3", at: "2026.11.11 23:32", items: ["4장 월별 투입 공수 표 추가 (계약 대비 증감, 숫자별 수행 업무 근거)", "메인 · Appendix 구분 페이지 이동 표시, 링크 이동 후 뒤로가기", "한 화면에 들어오도록 페이지 크기 조정"] },
    { v: "v2", at: "2026.11.11 23:02", items: ["한 페이지씩 넘기는 구성으로 변경", "기존 계획 · 변경 전환을 해당 페이지에 배치"] },
    { v: "v1", at: "2026.11.11 22:37", items: ["최초 공개 (메인 3장, Appendix)"] },
    ],
  },
  summary, schedule, effort, appendix,
};

if (require.main === module) {
  const d = module.exports;
  const sum = (a) => Math.round(a.reduce((x, y) => x + y, 0) * 100) / 100;
  const col = (rows, i) => sum(rows.map((r) => r.v[i]));
  const e = d.effort;
  for (let i = 0; i < 4; i++) {
    const p = col(e.plan, i), a = col(e.actual, i), dl = col(e.delta, i);
    console.log(e.months[i], "plan", p, e.planTotal[i], "actual", a, e.actualTotal[i], "delta", dl, e.deltaTotal[i], "a-p", sum([a, -p]));
  }
  for (let i = 0; i < 4; i++) if (col(e.planGrid, i) !== e.planTotal[i]) throw new Error("planGrid mismatch " + i);
  console.log("totals", sum(e.planTotal), sum(e.actualTotal), sum(e.deltaTotal));
  console.log("periods", sum(e.planTotal.slice(0, 2)), sum(e.actualTotal.slice(0, 2)), sum(e.deltaTotal.slice(0, 2)), "|", sum(e.planTotal.slice(2)), sum(e.actualTotal.slice(2)), sum(e.deltaTotal.slice(2)));
  console.log("12 items MD", sum(d.appendix.chgdev.items.map((x) => x.md)));
  console.log("ux monthly", sum(d.appendix.ux.monthly.map((x) => x[1])));
  console.log("ecare", sum(d.appendix.others.ecare.rows.slice(0, 7).map((r) => +r[2])));
  console.log("tasks", d.appendix.dvtEffort.tasks.oct.rows.length, sum(d.appendix.dvtEffort.tasks.oct.rows.map((r) => r.md)), d.appendix.dvtEffort.tasks.nov.rows.length, sum(d.appendix.dvtEffort.tasks.nov.rows.map((r) => r.md)));
  fs.writeFileSync(path.join(__dirname, "content.json"), JSON.stringify(d));
}
