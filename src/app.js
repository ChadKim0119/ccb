(function () {
  "use strict";
  var D = JSON.parse(document.getElementById("data").textContent);
  var S = D.summary, R = D.rounds, Y = D.daily, Q = D.ntWhy, M = D.remain, G = D.schedule, P = D.plan, A = D.appendix, SRC = D.src;
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var pct = function (a, b) { return (Math.round(a / b * 1000) / 10).toFixed(1); };
  var ownerOf = function (id) { return Q.owners.filter(function (o) { return o.id === id; })[0]; };
  var OC = { tmc: "var(--o-tmc)", tck: "var(--o-tck)", lgu: "var(--o-lgu)", dsn: "var(--o-dsn)" };
  var lateWhen = function (w) { return /12월|미정|대기|11\/1[6-9]|11\/2/.test(w); };

  /* ── gantt helpers (day precision) ── */
  var AX = G.axis, N = AX.months;
  function dim(y, m) { return new Date(y, m, 0).getDate(); }
  function pos(d, end) { var mi = (d[0] - AX.start[0]) * 12 + (d[1] - AX.start[1]); return (mi + (end ? d[2] : d[2] - 1) / dim(d[0], d[1])) / N * 100; }
  function span(r) { var l = pos(r[0], false), w = pos(r[1], true) - l; return [l.toFixed(3) + "%", w.toFixed(3) + "%"]; }
  function seg() { return '<div class="segw"><div class="seg" role="group" aria-label="일정 기준 선택"><span class="thumb" aria-hidden="true"></span><button type="button" data-set="plan" aria-pressed="false">' + esc(D.meta.modes.plan) + '<small>' + esc(D.meta.modes.planSub) + '</small></button><button type="button" data-set="changed" aria-pressed="true">' + esc(D.meta.modes.changed) + '<small>' + esc(D.meta.modes.changedSub) + '</small></button></div><kbd title="Space 키로 전환">Space</kbd></div>'; }
  function table(head, rows, opt) { opt = opt || {}; return '<div class="scroll"><table class="tbl ' + (opt.cls || "") + '"><thead><tr>' + head.map(function (h, i) { return '<th class="' + ((opt.right || []).indexOf(i) >= 0 ? "r" : "") + '">' + esc(h) + '</th>'; }).join("") + '</tr></thead><tbody>' + rows.map(function (r) { return '<tr class="' + (opt.rowCls ? opt.rowCls(r) : (r[0] === "합계" ? "tot" : "")) + '">' + r.map(function (c, i) { return '<td class="' + ((opt.right || []).indexOf(i) >= 0 ? "r " : "") + ((opt.nowrap || []).indexOf(i) >= 0 ? "nw" : "") + '">' + (opt.raw ? c : esc(c)) + '</td>'; }).join("") + '</tr>'; }).join("") + '</tbody></table></div>'; }
  function numTable(o, extra) { var right = []; o.head.forEach(function (h, i) { if (i > 0 && /TC|Acted|Pass|Fail|NT|Remained|Planned|미수행/.test(h)) right.push(i); }); return table(o.head, o.rows, { right: right, nowrap: [0], cls: "num" }) + (o.notes ? '<ul class="notes">' + o.notes.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join("") + '</ul>' : "") + (extra || ""); }
  function srcLinks(keys) { return '<p class="srcs">근거: ' + keys.map(function (k) { var s = SRC[k]; return s.u ? '<a href="' + s.u + '" target="_blank" rel="noopener">' + esc(s.t) + '</a>' : esc(s.t); }).join(" · ") + '</p>'; }
  function sheetTop(n, title) { return '<div class="sh-top"><span class="sheet-no"><span class="pill main">메인</span><b>' + n + '</b> / 5 · ' + esc(title) + '</span></div>'; }

  /* ── 1 summary ── */
  function vSummary() {
    var r2 = R[1], r3 = R[2], open3 = r3.fail + r3.nt + r3.rest;
    return '<section class="sheet hero" id="summary">' + sheetTop(1, S.kicker) +
      '<h1>' + esc(S.headline) + '</h1><p class="ask">' + esc(S.ask) + '</p>' +
      '<div class="kpi4 num">' +
        '<button type="button" data-panel="round:r1"><small>1차 · GS 290 TC</small><span class="v">' + R[0].nt + '<em>NT</em></span><span class="d">전체의 ' + pct(R[0].nt, R[0].tc) + '% · 주원인 ADF 미업로드</span></button>' +
        '<button type="button" class="hot" data-panel="round:r2"><small>2차 · 854 TC</small><span class="v">' + r2.nt + '<em>NT</em></span><span class="d">' + pct(r2.nt, r2.tc) + '% · 그중 CCW 236(CTI 미개발)</span></button>' +
        '<button type="button" data-panel="round:r3"><small>3차 · 80 TC (11/12)</small><span class="v">' + r3.pass + '<em>/ ' + r3.tc + ' Pass</em></span><span class="d">미검증 ' + open3 + '건 = Fail ' + r3.fail + ' · NT ' + r3.nt + ' · 미수행 ' + r3.rest + '</span></button>' +
        '<button type="button" data-go="4"><small>선행조건 해소 예정</small><span class="v" style="font-size:24px;line-height:1.55">11/13 ~ 12월</span><span class="d">HU 11/13 · VDP Diag 11/16~20 · CTI 12월</span></button>' +
      '</div>' +
      '<ol class="chain">' + S.steps.map(function (s) { return '<li><span class="tag">' + s.n + ' · ' + esc(s.tag) + '</span><h3>' + esc(s.title) + '</h3><p>' + esc(s.body) + '</p><a class="more" href="#' + s.go + '">' + esc(s.link) + '</a></li>'; }).join("") + '</ol>' +
      '<div class="stat3">' + S.status.map(function (p) { return '<div><h3>' + esc(p.k) + '</h3><p>' + esc(p.v) + '</p>' + (p.facts ? '<dl class="facts num">' + p.facts.map(function (f) { return '<dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd>'; }).join("") + '</dl>' : "") + '<button type="button" class="more" data-panel="' + p.panel + '">' + esc(p.link) + '</button></div>'; }).join("") + '</div>' +
      '</section>';
  }

  /* ── 2 rounds ── */
  function rbar(r) {
    var parts = [["pass", r.pass, "Pass"], ["fail", r.fail, "Fail"], ["nt", r.nt, "NT"], ["rest", r.rest, "미수행"]];
    return '<span class="rbar">' + parts.filter(function (p) { return p[1] > 0; }).map(function (p) { var w = p[1] / r.tc * 100; return '<i class="' + p[0] + '" style="width:' + w + '%" title="' + p[2] + ' ' + p[1] + '">' + (w > 4.5 ? p[1] : "") + '</i>'; }).join("") + '</span>';
  }
  function trendSvg() {
    var rows = Y.r2cum.rows, W = 520, H = 170, L = 34, B = 22, max = 600;
    var x = function (i) { return L + i * (W - L - 70) / (rows.length - 1); }, y = function (v) { return H - B - v / max * (H - B - 10); };
    var line = function (ci, col, w) { return '<polyline fill="none" stroke="' + col + '" stroke-width="' + w + '" points="' + rows.map(function (r, i) { return x(i) + "," + y(+r[ci]); }).join(" ") + '"/>' + rows.map(function (r, i) { return '<circle cx="' + x(i) + '" cy="' + y(+r[ci]) + '" r="3" fill="' + col + '"/>'; }).join(""); };
    var g = [0, 200, 400, 600].map(function (v) { return '<line x1="' + L + '" x2="' + (W - 60) + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke="#ddd8e2"/><text x="' + (L - 6) + '" y="' + (y(v) + 4) + '" text-anchor="end">' + v + '</text>'; }).join("");
    var xl = rows.map(function (r, i) { return '<text x="' + x(i) + '" y="' + (H - 4) + '" text-anchor="middle">' + r[0] + '</text>'; }).join("");
    var last = rows.length - 1;
    var ccw = '<line x1="' + L + '" x2="' + (W - 60) + '" y1="' + y(236) + '" y2="' + y(236) + '" stroke="#a3005a" stroke-dasharray="4 4"/><text x="' + (L + 4) + '" y="' + (y(236) - 5) + '" style="fill:#a3005a">CCW 236 (CTI 미개발)</text>';
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="2차 DVT 누적 Pass·NT 추이">' + g + ccw + line(2, "#17141a", 2.5) + line(4, "#e6007e", 2.5) + xl +
      '<text class="lbl" x="' + (x(last) + 8) + '" y="' + (y(+rows[last][2]) + 4) + '" style="fill:#17141a">Pass ' + rows[last][2] + '</text>' +
      '<text class="lbl" x="' + (x(last) + 8) + '" y="' + (y(+rows[last][4]) + 4) + '" style="fill:#a3005a">NT ' + rows[last][4] + '</text></svg>';
  }
  function vRounds() {
    var tot = R.reduce(function (s, r) { return s + r.tc; }, 0);
    return '<section class="sheet" id="rounds">' + sheetTop(2, "차수별 결과") +
      '<h2>NT 비중은 1차 50% → 2차 38% → 3차 59%(수행분). 3차는 2차에서 막혔던 TC를 다시 보는데, 수행한 56건 중 33건이 또 NT다 — 막던 조건이 그대로라는 뜻</h2>' +
      '<p class="lede">막대는 차수별 TC 100% 기준. 막대를 누르면 일별 기록이 열린다. 3차 NT 비중은 수행한 56건 기준.</p>' +
      '<div class="lg"><span><i class="sw2 pass"></i>Pass</span><span><i class="sw2 fail"></i>Fail</span><span><i class="sw2 nt"></i>NT (진입 불가)</span><span><i class="sw2 rest"></i>미수행</span></div>' +
      '<div class="rb3 num">' + R.map(function (r) { var base = r.tc - r.rest; return '<button type="button" class="rrow" data-panel="round:' + r.id + '"><span class="rlab"><b>' + r.name + ' DVT · ' + r.tc + ' TC</b><span>' + esc(r.period) + ' · ' + esc(r.scope) + '</span></span>' + rbar(r) + '<span class="rnt"><b>' + pct(r.nt, base) + '%</b><span>NT ' + r.nt + ' / ' + base + '</span></span></button>'; }).join("") + '</div>' +
      '<div class="cols2" style="margin-top:22px"><div><h3 style="font-size:15px;padding-bottom:8px;border-bottom:1px solid var(--ink)">2차 누적 추이 — NT는 10/23 이후 300 안팎에서 멈춤</h3><div class="trend">' + trendSvg() + '</div>' +
      '<ul class="notes"><li>10/23 NT 362 → 288: 시험이 진척된 것이 아니라 ‘ADF 선행 조건’ NT를 시험 가능 조건으로 바꾼 결과(2차 결과 페이지)</li></ul></div>' +
      '<div><h3 style="font-size:15px;padding-bottom:8px;border-bottom:1px solid var(--ink)">2차 영역별 최종 (10/30)</h3>' + numTable(Y.r2area) +
      '<ul class="notes"><li>CCW를 빼면 2차 NT는 87 / 618 = ' + pct(87, 618) + '%. NT 문제의 대부분은 콜센터 웹 하나에 몰려 있다</li></ul></div></div>' +
      '</section>';
  }

  /* ── 3 why ── */
  function vWhy() {
    var parts = Q.parts;
    var bar = parts.map(function (p) { return '<button type="button" class="' + p.k + '" style="flex:' + p.n + '" data-panel="part:' + p.k + '"><b class="num" data-sp="n323" data-v="' + p.n + '">' + p.n + '</b><span>' + esc(p.label) + ' · ' + esc(p.cause) + '</span></button>'; }).join("");
    var own = Q.owners.map(function (o) {
      var bl = Q.blockers.filter(function (b) { return b.owner === o.id; });
      return '<div class="own" style="--oc:' + OC[o.id] + '"><h3>' + esc(o.name) + '<small>' + esc(o.sub) + '</small></h3><span class="cnt">차단 요인 ' + bl.length + '건</span>' +
        bl.map(function (b) { return '<button type="button" class="blk" data-panel="cause:' + b.id + '"><b>' + esc(b.title) + '</b><span class="m">' + esc(b.tc) + '</span><span class="w' + (lateWhen(b.when) ? " late" : "") + '">' + esc(b.when) + '</span></button>'; }).join("") + '</div>';
    }).join("");
    return '<section class="sheet" id="why">' + sheetTop(3, "NT 원인") +
      '<h2>NT는 결함이 아니라 ‘시험에 들어가지 못한 TC’다. 막고 있는 것은 외부 연동과 시험 환경이고, 원인 제공 조직이 흩어져 있다</h2>' +
      '<div class="def"><div class="da"><small>NT 정의 · 10/07 PM 합의</small><b>진입 자체가 불가한 항목</b><p>Block 분류는 폐지. 진입 후 실패한 것은 모두 Fail로 판정</p></div><div class="db"><small>그래서</small><b>NT 건수 = 아직 열리지 않은 시험 환경의 크기</b><p>개발 품질이 아니라 선행조건 미해소의 지표. 조건이 풀려야 시험이 시작된다</p></div></div>' +
      '<div class="split323"><div class="top"><b>2차 NT</b><span class="tt num" data-sum="n323">' + Q.total + '</span><span style="font-size:13px;color:var(--ink-2)">영역별로 막힌 이유 — 누르면 근거</span></div><div class="sbar">' + bar + '</div></div>' +
      '<div class="owners">' + own + '</div>' +
      '<p class="disc">원인 제공 조직은 PM 회의록 · E2E 사전준비표(PIC) · GSP DB 이슈트래킹 기록에서 읽은 분류다. 귀책 판정이 아니라 누가 다음 행동을 해야 하는지를 보기 위한 것이며, HU처럼 복합 원인인 경우 카드에 함께 적었다. TC 행 단위 NT 사유(엑셀 본문)는 이번 판에 반영하지 못했다(Appendix A7).</p>' +
      '</section>';
  }

  /* ── 4 remain ── */
  function vRemain() {
    var rows = Y.r3area.rows.filter(function (r) { return r[0] !== "합계"; });
    var waf = rows.map(function (r) {
      var c = []; ["pass", "fail", "nt", "rest"].forEach(function (k, i) { for (var j = 0; j < +r[3 + i]; j++) c.push('<i class="' + k + '"></i>'); });
      return '<div class="wr"><div class="wl"><b>' + esc(r[0]) + '</b><span class="num">' + r[1] + ' TC · ' + esc(r[2]) + '</span></div><div class="cells">' + c.join("") + '</div></div>';
    }).join("");
    var m = M.r3, open3 = m.fail + m.nt + m.rest;
    var tot2 = M.carry.reduce(function (s, c) { return s + c.nt2; }, 0), in3 = M.carry.reduce(function (s, c) { return s + c.in3; }, 0);
    var carry = M.carry.map(function (c) { return '<div class="cr num"><b>' + esc(c.k) + '</b><span class="track"><i style="width:' + c.nt2 / 236 * 100 + '%"></i><i class="in" style="width:' + c.in3 / 236 * 100 + '%"></i></span><span class="r">' + c.in3 + ' / ' + c.nt2 + '</span></div>'; }).join("");
    return '<section class="sheet" id="remain">' + sheetTop(4, "남은 TC") +
      '<h2>3차 80 TC 중 62건이 아직 검증되지 않았고, 2차 NT 323건 중 3차에 다시 편성된 것은 42건뿐이다</h2>' +
      '<div class="rem"><div><h3>3차 DVT 80 TC · 11/12 누적 (한 칸 = 1 TC)</h3>' +
      '<div class="lg"><span><i class="sw2 pass"></i>Pass ' + m.pass + '</span><span><i class="sw2 fail"></i>Fail ' + m.fail + '</span><span><i class="sw2 nt"></i>NT ' + m.nt + '</span><span><i class="sw2 rest"></i>미수행 ' + m.rest + '</span></div>' +
      '<div class="waf">' + waf + '</div>' +
      '<div class="big3"><span class="n num" data-sum="open3">' + open3 + '</span><p>/ 80 미검증 (' + pct(open3, m.tc) + '%) = <span class="num" data-sp="open3" data-v="' + m.fail + '">Fail ' + m.fail + '</span> + <span class="num" data-sp="open3" data-v="' + m.nt + '">NT ' + m.nt + '</span> + <span class="num" data-sp="open3" data-v="' + m.rest + '">미수행 ' + m.rest + '</span></p></div>' +
      '<ul class="notes"><li>미수행 24건은 모두 VDP Diag 신규 TC — TMC 연동이 열려야 시작(11/13 1차, 11/16 ~ 20 2차)</li><li>DMS NT 18건은 DMS API 5 → 24개 변경 · 사양 미확정(ISS-008)과 연동</li></ul></div>' +
      '<div><h3>2차 NT 323 → 3차에 다시 편성된 NT</h3><div class="lg"><span><i class="sw2" style="background:var(--accent)"></i>3차 편성</span><span><i class="sw2" style="background:var(--plan)"></i>2차 NT</span></div><div class="carry">' + carry + '</div>' +
      '<p class="eq num"><span data-sum="t2">' + tot2 + '</span> = ' + M.carry.map(function (c) { return '<span data-sp="t2" data-v="' + c.nt2 + '">' + c.nt2 + '</span>'; }).join(" + ") + '<span>2차 NT</span></p>' +
      '<p class="eq num" style="color:var(--accent-deep)">3차 범위 밖 ' + (tot2 - in3) + '건<span>= 323 − 3차 편성 ' + in3 + ' (CCW 236 + GS 44 + OPW 1)</span></p>' +
      '<ul class="notes"><li>' + esc(M.carryNote) + '</li><li>11/11 PM은 MM 업데이트 후 GS 요금제 · Provisioning NT 재검증을 3차에 포함하기로 했으나, 3차 결과표(80 TC)에는 그 건수가 따로 잡혀 있지 않음</li></ul>' +
      '<div class="days">오늘(11/14 토) 기준 현행 종료일 11/17까지 남은 시험일은 <b>11/16 · 11/17 이틀</b>. 같은 기간 TMC VDP Diag 2차(11/16 ~ 20)와 e-Call SYS4 시험(11/16 ~ 18)이 진행된다.</div></div></div>' +
      '</section>';
  }

  /* ── 5 plan ── */
  function vPlan() {
    var months = []; for (var i = 0; i < N; i++) { var mm = AX.start[1] + i; months.push('<span class="hot">' + AX.start[0] + '.' + mm + '</span>'); }
    var weeks = ""; [[2026, 11, 9], [2026, 11, 16], [2026, 11, 23], [2026, 11, 30], [2026, 12, 7], [2026, 12, 14], [2026, 12, 21], [2026, 12, 28]].forEach(function (d) { weeks += '<span class="g-dot" style="left:' + pos(d, false).toFixed(3) + '%"></span>'; });
    var rows = G.rows.map(function (r) {
      var bars = G.bars.filter(function (b) { return b.row === r.id; }).map(function (b, k) {
        var p = span(b.plan), c = span(b.changed), one = b.plan[0][2] === b.plan[1][2] && b.plan[0][1] === b.plan[1][1];
        var cls = "g-bar t" + b.t + " " + b.kind + (one ? " pin" : "");
        return '<button type="button" class="' + cls + '" style="--pl:' + p[0] + ';--pw:' + p[1] + ';--cl:' + c[0] + ';--cw:' + c[1] + ';--o:' + k + '" data-panel="' + b.panel + '" title="' + esc(b.cl || b.pl) + '">' + (one ? "" : '<span class="lp">' + esc(b.pl) + '</span><span class="lc">' + esc(b.cl) + '</span>') + '</button>' + (one ? '<span class="pin-l t' + b.t + '" style="left:calc(' + p[0] + ' - 4px)">' + esc(b.pl) + '</span>' : "");
      }).join("");
      return '<div class="g-row"><div class="g-lab">' + esc(r.label) + '<small>' + esc(r.sub) + '</small></div><div class="g-track">' + weeks + bars + '</div></div>';
    }).join("");
    var mk = pos(G.marker.at, true).toFixed(3) + "%";
    var flags = '<span class="g-flag always" style="left:' + mk + '">' + esc(G.marker.label) + '</span>' + G.points.map(function (p, i) { return '<span class="g-flag pt" style="left:' + pos(p.at, i === 0).toFixed(3) + '%;top:24px;transform:translateX(' + (i === 0 ? "-100%" : "0") + ')">' + esc(p.label) + '</span>'; }).join("");
    return '<section class="sheet" id="plan"><div class="sh-top"><span class="sheet-no"><span class="pill main">메인</span><b>5</b> / 5 · 일정 · 제안</span>' + seg() + '</div>' +
      '<h2>' + esc(P.title) + '</h2><p class="lede">' + esc(P.lede) + '</p>' +
      '<div class="legend"><span><i class="k-dvt"></i>DVT</span><span><i class="k-add"></i>제안(안)</span><span><i class="k-base"></i>선행조건 해소</span><span><i style="background:repeating-linear-gradient(135deg,#eceaef 0 4px,#e0dce5 4px 8px)"></i>일자 미정</span><span><i class="k-e2e"></i>Kensho E2E</span><span><i style="box-shadow:inset 0 0 0 1.5px var(--accent)"></i>현행대로면 생기는 공백</span></div>' +
      '<div class="scroll"><div class="gantt" style="--n:' + N + '"><div class="g-head"><span></span><div class="g-months">' + months.join("") + '</div></div>' +
      '<div class="g-overlay" style="padding-top:50px"><div class="g-head" style="position:absolute;left:0;right:0;top:0;height:100%;pointer-events:none"><span></span><div style="position:relative"><span class="g-marker always" style="left:' + mk + '"></span>' + flags + '</div></div>' + rows + '</div></div></div>' +
      '<div class="plan-cap"><div><b class="pp">현행: 11/17 종료 → 11/23 Kensho 진입</b><b class="pc">제안: 선행조건 해소일에 맞춰 연장 · 분리</b><span class="pp">3차 미검증 62건과 3차 범위 밖 2차 NT 281건이 E2E로 넘어감. CCW 236은 e-Care E2E(12/14)에서 처음 시험</span><span class="pc">GS · DMS · VDP는 11/20까지 DVT 안에서 정리, CCW는 CTI 완료 즉시 별도 DVT. 연장분은 신규 TC(VDP Diag 24) · 사양 변경(DMS) · 재수행으로 구성 — 대기 공수가 아님</span></div></div>' +
      '<div class="steps">' + P.steps.map(function (s) { return '<button type="button" class="step" data-panel="' + s.panel + '"><span class="n">' + s.n + '</span><b>' + esc(s.title) + '</b><span class="sb">' + esc(s.body) + '</span></button>'; }).join("") + '</div>' +
      '</section>';
  }

  /* ── appendix ── */
  function bR1() { return numTable(Y.r1) + srcLinks(["r1", "pm1007", "db"]); }
  function bR2() { return '<h4>전체 누적</h4>' + numTable(Y.r2cum) + '<h4>영역별 최종</h4>' + numTable(Y.r2area) + srcLinks(["r2", "pm1021", "pm1028", "pm1103"]); }
  function bR3() { return '<h4>영역별 (11/12 누적)</h4>' + numTable(Y.r3area) + '<h4>일별</h4>' + numTable(Y.r3day) + srcLinks(["r3", "pm1111", "db"]); }
  function bCause() {
    return table(["원인 제공", "차단 요인", "이슈", "영향", "해소 예정"], Q.blockers.map(function (b) { var o = ownerOf(b.owner); return ['<span class="otag" style="--oc:' + OC[o.id] + '">' + esc(o.name) + '</span>', '<button type="button" class="more" style="text-align:left;white-space:normal;font-size:13.5px;color:var(--ink)" data-panel="cause:' + b.id + '">' + esc(b.title) + '</button>', esc(b.iss), esc(b.tc), '<span class="' + (lateWhen(b.when) ? "st-wait" : "") + '">' + esc(b.when) + '</span>']; }), { raw: true, nowrap: [0, 2] }) + srcLinks(["pre", "pm1021", "pm1028", "pm1103", "db"]);
  }
  function bPre() {
    var a = A.a5, done = a.rows.filter(function (r) { return r[3] === "준비완료"; }).length;
    return '<p style="font-size:13.5px;margin-bottom:8px"><b>' + a.rows.length + '개 항목</b>(번호 17 중복 포함) 중 준비완료 <b>' + done + '</b> · 그 외 ' + (a.rows.length - done) + '</p>' +
      table(a.head, a.rows.map(function (r) { return r.map(function (c, i) { return i === 3 ? '<span class="' + (c === "준비완료" ? "st-done" : "st-wait") + '">' + esc(c) + '</span>' : esc(c); }); }), { raw: true, nowrap: [0, 1, 3, 4, 5] }) + srcLinks(["pre"]);
  }
  function bPlanHist() { return table(A.a6.head, A.a6.rows, { nowrap: [0] }) + srcLinks(["pm1007", "pm1021", "pm1103", "pm1111", "db"]); }
  function bSrc() {
    var a = A.a7;
    return '<h4>DVT 결과 페이지 첨부</h4>' + table(["차수", "파일", "올린 날", "올린 사람"], a.files, { nowrap: [0, 2, 3] }) +
      '<h4>System Test Case 문서 버전</h4>' + table(["버전", "일자", "변경 내용"], a.tcHist, { nowrap: [0, 1] }) +
      '<h4>이 보드가 참조한 문서</h4><ul class="plain">' + Object.keys(SRC).map(function (k) { var s = SRC[k]; return '<li>' + (s.u ? '<a href="' + s.u + '" target="_blank" rel="noopener">' + esc(s.t) + '</a>' : esc(s.t) + ' (프로젝트 DB 문서)') + '</li>'; }).join("") + '</ul>';
  }
  var APX = [[A.a1, bR1], [A.a2, bR2], [A.a3, bR3], [A.a4, bCause], [A.a5, bPre], [A.a6, bPlanHist], [A.a7, bSrc]];
  function vAppendix() {
    return '<section class="sheet apx-head" id="appendix"><span class="sheet-no"><span class="pill">Appendix</span>목차</span><h2>근거 자료</h2><p class="lede">메인 장표의 숫자와 원인 분류가 나온 원본 기록. ' + esc(D.meta.asof) + '.</p>' +
      '<nav class="apx-index" aria-label="Appendix 목차">' + APX.map(function (x) { return '<a href="#' + x[0].id + '"><b>' + x[0].code + '</b>' + esc(x[0].title) + '</a>'; }).join("") + '</nav></section>' +
      APX.map(function (x) { return '<section class="apx" id="' + x[0].id + '"><span class="code"><span class="pill">Appendix</span>' + x[0].code + '</span><h3 class="t">' + esc(x[0].title) + '</h3><p class="msg">' + esc(x[0].message) + '</p>' + x[1]() + '</section>'; }).join("");
  }

  /* ── panels ── */
  function panelContent(key) {
    var k = key.split(":");
    if (k[0] === "doc-history") return { kicker: "보드 정보", title: "이 보드의 변경 이력", html: '<ol class="clog">' + D.meta.changelog.map(function (c, i) { return '<li><div class="hd"><b>' + esc(c.v) + '</b><span>' + esc(c.at) + '</span>' + (i === 0 ? '<span class="now">현재</span>' : "") + '</div><ul>' + c.items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join("") + '</ul></li>'; }).join("") + '</ol>' };
    if (k[0] === "round") {
      var r = R.filter(function (x) { return x.id === k[1]; })[0], base = r.tc - r.rest;
      var kp = '<div class="p-kpi num"><div><small>Pass</small><b>' + r.pass + '</b></div><div><small>Fail</small><b>' + r.fail + '</b></div><div class="d"><small>NT</small><b>' + r.nt + '</b></div></div>';
      var body = r.id === "r1" ? numTable(Y.r1) : r.id === "r2" ? numTable(Y.r2area) + '<h4>누적 추이</h4>' + numTable(Y.r2cum) : numTable(Y.r3area) + '<h4>일별</h4>' + numTable(Y.r3day);
      return { kicker: r.name + " DVT · " + r.period, title: r.tc + " TC · NT " + pct(r.nt, base) + "%", html: kp + '<p>' + esc(r.note) + '</p>' + body + srcLinks([r.src]) };
    }
    if (k[0] === "part") {
      var p = Q.parts.filter(function (x) { return x.k === k[1]; })[0];
      var rel = { ccw: ["cti"], gs: ["hu", "gsa", "ucube", "fix"], opw: ["vdp", "dms", "dtc"] }[p.k];
      return { kicker: "2차 NT " + Q.total + "건 중", title: p.label + " " + p.n + "건 · " + p.cause, html: '<p>' + esc(p.fact) + '</p><h4>관련 차단 요인</h4>' + rel.map(function (id) { var b = Q.blockers.filter(function (x) { return x.id === id; })[0], o = ownerOf(b.owner); return '<button type="button" class="blk" data-panel="cause:' + b.id + '" style="--oc:' + OC[o.id] + '"><span class="otag">' + esc(o.name) + '</span><b style="margin-top:4px">' + esc(b.title) + '</b><span class="m">' + esc(b.tc) + ' · ' + esc(b.when) + '</span></button>'; }).join("") + srcLinks(["r2", "pm1021", "pm1028", "pm1111"]) };
    }
    if (k[0] === "cause") {
      var b = Q.blockers.filter(function (x) { return x.id === k[1]; })[0]; if (!b) return null; var o = ownerOf(b.owner);
      return { kicker: "차단 요인 · " + o.name, title: b.title, html: '<dl class="p-meta"><dt>원인 제공</dt><dd><span class="otag" style="--oc:' + OC[o.id] + '">' + esc(o.name) + '</span> ' + esc(o.sub) + '</dd><dt>이슈</dt><dd>' + esc(b.iss) + '</dd><dt>영향</dt><dd>' + esc(b.tc) + '</dd><dt>해소 예정</dt><dd><b>' + esc(b.when) + '</b></dd></dl><h4>기록된 사실</h4><ul class="fl">' + b.facts.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join("") + '</ul>' + srcLinks(b.src) };
    }
    if (k[0] === "sched") {
      var s = P.sched[k[1]]; if (!s) return null;
      return { kicker: s.kicker, title: s.title, html: '<ul class="fl">' + s.body.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join("") + '</ul>' + srcLinks(s.src) };
    }
    if (k[0] === "src") {
      var x = SRC[k[1]]; if (!x) return null;
      var said = { pm1103: ["Kensho E2E는 현재 제약사항을 고려하여 테스트 가능한 범위를 세분화하고, 처음부터 N/T가 예상되는 TC가 최소화되도록 세부 일정을 재작성", "Kensho E2E 진입 시점에는 사전에 알고 있는 제약사항으로 N/T가 발생하지 않도록 기능별 테스트 가능시점을 기준으로 세부 일정을 재구성", "DVT 2차: 약 850 TC 중 약 520 Pass, Fail 8, N/T 약 300 — CTI 미개발 영향으로 N/T 비중이 높음"],
        pm1111: ["TMKR 내부 의견(최종 합의 아님): ACOS 규격 변경에 따른 실제 변경 개발은 추가비용 협의 가능, DVT 일정 지연에 따른 단순 대기 · 유지 인력 공수는 인정 어려움", "DVT 자체 Scope가 증가하여 실제 추가 Test · 개발 업무가 발생한 경우에는 해당 근거를 기준으로 별도 검토 가능", "DVT 3차: MM Update 이후 기존 N/T 요금제 · Provisioning 재검증, VDP Server API, e-Care API, GSA 설치 · Login, DeepLink/상품가입 Flow", "E2E는 토요타 공식 검증 Event 관점. System Architecture · Interface Spec · Test Case를 기준 문서로, Tier2의 구두 설명만으로 이슈를 종료하지 않음"] }[k[1]] || [];
      return { kicker: "근거 문서", title: x.t, html: (said.length ? '<h4>해당 기록</h4><ul class="fl">' + said.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join("") + '</ul>' : "") + (x.u ? '<p style="margin-top:14px"><a href="' + x.u + '" target="_blank" rel="noopener" style="color:var(--accent-deep);font-weight:600">Confluence에서 원문 열기</a></p>' : "") };
    }
    return null;
  }

  /* ── mount ── */
  $("chg").innerHTML = '변경 이력 <b>' + esc(D.meta.changelog[0].v) + '</b>'; $("chg").setAttribute("aria-label", "이 보드의 변경 이력, 현재 " + D.meta.changelog[0].v);
  $("brand").innerHTML = esc(D.meta.title) + ' <span>· ' + esc(D.meta.project) + ' · ' + esc(D.meta.date) + '</span>';
  $("nav").innerHTML = [["summary", "1 요약"], ["rounds", "2 차수별 결과"], ["why", "3 NT 원인"], ["remain", "4 남은 TC"], ["plan", "5 일정 · 제안"]].map(function (n) { return '<a href="#' + n[0] + '">' + n[1] + '</a>'; }).join("") + '<span class="sep"></span><a href="#appendix">Appendix</a>';
  $("app").innerHTML = vSummary() + vRounds() + vWhy() + vRemain() + vPlan() + vAppendix();
  function setMode(m) {
    if (sumEl) clearSum();
    document.body.setAttribute("data-mode", m);
    Array.prototype.forEach.call(document.querySelectorAll("[data-set]"), function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-set") === m)); });
  }
  /*__ENGINE__*/
  /*__EDITOR__*/
})();
