  /* ── paging: 메인 1 ~ 4, then Appendix ── */
  var pages = Array.prototype.slice.call(document.querySelectorAll("#app > section")), cur = 0, NMAIN = 5, trail = [];
  var labels = { summary: "1 요약", rounds: "2 차수별 결과", why: "3 NT 원인", remain: "4 남은 TC", plan: "5 일정 · 제안", appendix: "Appendix 목차" };
  pages.forEach(function (p) { p.classList.add("page"); });
  var dotHtml = function (p, i) {
    var main = i < NMAIN, lab = labels[p.id] || p.querySelector(".code").textContent.replace("Appendix", "") + " " + p.querySelector("h3.t").textContent;
    return '<li><button type="button" class="dot' + (main ? "" : " sm") + '" data-go="' + i + '" data-label="' + esc(lab) + '" aria-label="' + esc(lab) + '">' + (main ? i + 1 : "") + '</button></li>';
  };
  $("dots-main").innerHTML = pages.slice(0, NMAIN).map(dotHtml).join("");
  $("dots-apx").innerHTML = pages.slice(NMAIN).map(function (p, i) { return dotHtml(p, i + NMAIN); }).join("");
  var dots = document.querySelectorAll(".rail .dot"), links = $("nav").querySelectorAll("a"), bar = document.querySelector(".bar");
  var SW = 1280, SH = 800, app = $("app");
  function layout() {
    var staged = window.innerWidth >= 980;
    document.body.classList.toggle("staged", staged);
    if (!staged) { app.style.transform = app.style.left = app.style.top = ""; return; }
    var top = bar.offsetHeight, aw = window.innerWidth - 120, ah = window.innerHeight - top - 24, sc = Math.min(aw / SW, ah / SH);
    app.style.transform = "scale(" + sc + ")";
    app.style.left = (12 + (aw - SW * sc) / 2) + "px";
    app.style.top = (top + 12 + (ah - SH * sc) / 2) + "px";
  }
  function fit() {
    layout();
    var p = pages[cur]; p.style.zoom = ""; p.style.height = "";
    if (!document.body.classList.contains("staged")) return;
    p.style.height = "auto";
    var H = app.getBoundingClientRect().height + 0.5, z = 1;
    if (p.getBoundingClientRect().height > H) {
      var lo = 0.74, hi = 1; p.style.zoom = lo;
      if (p.getBoundingClientRect().height > H) z = 0.86; /* too long to shrink: keep it readable and scroll inside the page */
      else { for (var n = 0; n < 8; n++) { var mid = (lo + hi) / 2; p.style.zoom = mid; if (p.getBoundingClientRect().height <= H) lo = mid; else hi = mid; } z = lo; }
      p.style.zoom = z;
    }
    p.style.height = (SH / z) + "px";
  }
  function go(i, opt) {
    opt = opt || {};
    i = Math.max(0, Math.min(pages.length - 1, i));
    if (opt.push && i !== cur) trail.push(cur);
    cur = i; if (sumEl) clearSum();
    pages.forEach(function (p, k) { p.classList.toggle("on", k === i); });
    Array.prototype.forEach.call(dots, function (d) { var on = +d.getAttribute("data-go") === i; d.classList.toggle("on", on); if (on) d.setAttribute("aria-current", "page"); else d.removeAttribute("aria-current"); });
    var sec = i < NMAIN ? pages[i].id : "appendix";
    Array.prototype.forEach.call(links, function (a) { a.classList.toggle("on", a.getAttribute("href") === "#" + sec); });
    $("count").innerHTML = i < NMAIN ? "메인<br>" + (i + 1) + " / " + NMAIN : "Appendix<br>" + (i - NMAIN + 1) + " / " + (pages.length - NMAIN);
    $("prev").disabled = i === 0; $("next").disabled = i === pages.length - 1;
    $("pg-back").hidden = trail.length === 0;
    window.scrollTo(0, 0); fit(); pages[i].scrollTop = 0;
    if (!opt.keepHash) { try { history.replaceState(null, "", "#" + pages[i].id); } catch (e) { /* hash is optional */ } }
  }
  function goId(id, opt) { for (var k = 0; k < pages.length; k++) if (pages[k].id === id) { go(k, opt); return true; } return false; }
  $("prev").addEventListener("click", function () { go(cur - 1); });
  $("next").addEventListener("click", function () { go(cur + 1); });
  $("pg-back").addEventListener("click", function () { if (trail.length) go(trail.pop()); });
  window.addEventListener("hashchange", function () { var id = location.hash.slice(1); if (id && pages[cur].id !== id) goId(id, { push: true }); });
  var rz = null; window.addEventListener("resize", function () { clearTimeout(rz); rz = setTimeout(fit, 120); });
  if (!(location.hash && goId(location.hash.slice(1)))) go(0, { keepHash: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);

  /* ── side panel, with a way back ── */
  var lastFocus = null, pStack = [], pKey = null;
  function renderPanel(key) {
    var c = panelContent(key); if (!c) return false;
    pKey = key; $("p-kicker").textContent = c.kicker; $("p-title").textContent = c.title; $("p-body").innerHTML = c.html; $("p-body").scrollTop = 0; return true;
  }
  function openPanel(key) {
    var isOpen = document.body.classList.contains("open"), prev = pKey;
    if (!renderPanel(key)) return;
    if (isOpen) { if (prev && prev !== key) pStack.push(prev); }
    else { pStack = []; lastFocus = document.activeElement; document.body.classList.add("open"); $("panel").setAttribute("aria-hidden", "false"); }
    $("p-back").focus();
  }
  function closePanel() { if (!document.body.classList.contains("open")) return; document.body.classList.remove("open"); $("panel").setAttribute("aria-hidden", "true"); pStack = []; pKey = null; if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  function backPanel() { if (pStack.length) renderPanel(pStack.pop()); else closePanel(); }
  document.addEventListener("click", function (ev) {
    if (sumEl) { var hit = ev.target.closest("[data-sum]"), again = hit === sumEl; clearSum(); ev.preventDefault(); if (!again && hit && pages[cur].contains(hit)) showSum(hit); return; }
    var sm = ev.target.closest("[data-sum]"); if (sm && pages[cur].contains(sm) && !document.body.classList.contains("open")) { ev.preventDefault(); showSum(sm); return; }
    var m = ev.target.closest("[data-set]"); if (m) { setMode(m.getAttribute("data-set")); return; }
    var g = ev.target.closest("[data-go]"); if (g) { go(+g.getAttribute("data-go"), { push: true }); return; }
    var t = ev.target.closest("[data-panel]");
    if (t) { ev.preventDefault(); openPanel(t.getAttribute("data-panel")); return; }
    var a = ev.target.closest('a[href^="#"]');
    if (a) { var inPanel = a.closest(".panel"); if (goId(a.getAttribute("href").slice(1), { push: true })) { ev.preventDefault(); if (inPanel) closePanel(); } }
  });
  $("scrim").addEventListener("click", closePanel); $("p-close").addEventListener("click", closePanel); $("p-back").addEventListener("click", backPanel);
  document.addEventListener("keydown", function (ev) {
    var open = document.body.classList.contains("open"), k = ev.key;
    if (k === "Escape") { if (sumEl) { clearSum(); return; } if (open) backPanel(); return; }
    if (open || ev.altKey || ev.ctrlKey || ev.metaKey) return;
    var tag = ev.target && ev.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    var doc = document.documentElement, sc = document.body.classList.contains("staged") ? pages[cur] : null;
    var atEnd = sc ? sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 4 : window.innerHeight + window.scrollY >= doc.scrollHeight - 4, atTop = sc ? sc.scrollTop <= 2 : window.scrollY <= 2;
    if (k === "ArrowRight" || k === "PageDown") { ev.preventDefault(); go(cur + 1); }
    else if (k === "ArrowLeft" || k === "PageUp") { ev.preventDefault(); go(cur - 1); }
    else if (k === "ArrowDown") { if (atEnd) { ev.preventDefault(); go(cur + 1); } else if (sc) { ev.preventDefault(); sc.scrollBy({ top: 140, behavior: "smooth" }); } }
    else if (k === "ArrowUp") { if (atTop) { ev.preventDefault(); go(cur - 1); } else if (sc) { ev.preventDefault(); sc.scrollBy({ top: -140, behavior: "smooth" }); } }
    else if (k === " " || k === "Spacebar") { ev.preventDefault(); if (pages[cur].querySelector("[data-set]")) setMode(document.body.getAttribute("data-mode") === "changed" ? "plan" : "changed"); }
    else if (k === "f" || k === "F" || k === "ㄹ") { ev.preventDefault(); toggleFs(); }
    else if (k === "Home") { ev.preventDefault(); go(0); }
    else if (k === "End") { ev.preventDefault(); go(pages.length - 1); }
  });
  /* ── sums: click a total to see which numbers make it ── */
  function numOf(t) { t = String(t).replace(/−/g, "-").replace(/,/g, "").replace(/MM|MD/g, "").trim(); return /^[+-]?\d+(\.\d+)?$/.test(t) ? parseFloat(t) : null; }
  function txtOf(el) { if (el.hasAttribute("data-v")) return el.getAttribute("data-v"); var v = el.querySelector(".v") || el.querySelector(".evb > span:first-child"); return (v ? v.textContent : el.textContent).trim(); }
  (function autoSums() {
    var n = 0;
    pages.forEach(function (pg) {
      Array.prototype.forEach.call(pg.querySelectorAll("table.tbl"), function (tb) {
        var heads = Array.prototype.map.call(tb.querySelectorAll("thead th"), function (th) { return th.textContent.trim(); });
        var rows = Array.prototype.map.call(tb.querySelectorAll("tbody tr"), function (tr) { return Array.prototype.slice.call(tr.children); });
        var kind = function (r) { var lab = r.slice(0, 2).map(function (c) { return c.textContent; }).join(" "); return /소계/.test(lab) ? "sub" : /합계/.test(lab) ? "tot" : ""; };
        var val = function (c) { return c ? numOf(c.textContent) : null; };
        var near = function (a, b) { return Math.abs(a - b) < 0.051; };
        var tot = function (a) { return a.reduce(function (s, x) { return s + val(x); }, 0); };
        var mark = function (c, parts) { var key = "a" + (n++); c.setAttribute("data-sum", key); parts.forEach(function (p) { p.setAttribute("data-sp", ((p.getAttribute("data-sp") || "") + " " + key).trim()); }); };
        rows.forEach(function (r, ri) {
          var k = kind(r); if (!k) return;
          r.forEach(function (c, ci) {
            if (ci < 1 || val(c) === null) return;
            var parts = [], subs = [];
            for (var j = ri - 1; j >= 0; j--) { var kk = kind(rows[j]), pc = rows[j][ci]; if (kk === "tot" || (k === "sub" && kk === "sub")) break; if (val(pc) === null) continue; if (kk === "sub") subs.push(pc); else parts.push(pc); }
            if (subs.length > 1 && near(tot(subs), val(c))) mark(c, subs.reverse());
            else if (parts.length > 1 && near(tot(parts), val(c))) mark(c, parts.reverse());
          });
        });
        var hc = heads.lastIndexOf("합계");
        if (hc > 0) rows.forEach(function (r) {
          var c = r[hc]; if (!c || val(c) === null || c.hasAttribute("data-sum")) return;
          var parts = r.slice(1, hc).filter(function (x) { return val(x) !== null; });
          if (parts.length > 1 && near(tot(parts), val(c))) mark(c, parts);
        });
      });
    });
  })();
  Array.prototype.forEach.call(document.querySelectorAll("[data-sum]"), function (el) {
    var k = el.getAttribute("data-sum"), pg = el.closest("#app > section"), n = pg ? Array.prototype.filter.call(pg.querySelectorAll('[data-sp~="' + k + '"]'), function (p) { return p !== el; }).length : 0;
    if (n < 2) el.removeAttribute("data-sum");
  });
  var sumEl = null;
  function drawSum() {
    var el = sumEl, svg = $("sumfx"), f = $("sumfx-f"); if (!el) return;
    var key = el.getAttribute("data-sum"), pg = pages[cur];
    var parts = Array.prototype.filter.call(pg.querySelectorAll('[data-sp~="' + key + '"]'), function (p) { return p !== el && p.getClientRects().length; });
    var R = function (x, pad) { var r = x.getBoundingClientRect(); return { x: r.left - pad, y: r.top - pad, w: r.width + pad * 2, h: r.height + pad * 2, cx: r.left + r.width / 2, cy: r.top + r.height / 2 }; };
    var pr = pg.getBoundingClientRect(), tr = R(el, 3), W = window.innerWidth, H = window.innerHeight, ps = parts.map(function (p) { return R(p, 1); });
    var hole = function (r) { return '<rect x="' + r.x + '" y="' + r.y + '" width="' + r.w + '" height="' + r.h + '" rx="5" fill="#000"/>'; };
    var h = '<defs><mask id="sumMask" maskUnits="userSpaceOnUse" x="0" y="0" width="' + W + '" height="' + H + '"><rect x="0" y="0" width="' + W + '" height="' + H + '" fill="#fff"/>' + ps.map(hole).join("") + hole(tr) + '</mask></defs>';
    h += '<rect x="' + pr.left + '" y="' + pr.top + '" width="' + pr.width + '" height="' + pr.height + '" fill="rgba(246,244,248,.84)" mask="url(#sumMask)"/>';
    // a column of addends: lines run down the right side; a row of addends: lines arc over the top
    var col = ps.every(function (r) { return Math.abs(r.cx - tr.cx) < Math.max(r.w, tr.w) / 2; }), row = !col && ps.every(function (r) { return Math.abs(r.cy - tr.cy) < Math.max(r.h, tr.h) / 2; });
    var edge = Math.max.apply(null, ps.map(function (r) { return r.x + r.w; }).concat([tr.x + tr.w])), roof = Math.min.apply(null, ps.map(function (r) { return r.y; }).concat([tr.y]));
    ps.forEach(function (r, i) {
      var x1, y1, x2, y2, cx, cy;
      if (col) { x1 = r.x + r.w + 3; y1 = r.cy; x2 = tr.x + tr.w + 3; y2 = tr.cy; cx = edge + 14 + Math.abs(y2 - y1) * .12; cy = (y1 + y2) / 2; }
      else if (row) { x1 = r.cx; y1 = r.y - 3; x2 = tr.cx; y2 = tr.y - 3; cx = (x1 + x2) / 2; cy = roof - 10 - Math.abs(x2 - x1) * .1; }
      else {
        // start and end on the box edges, never over the numbers
        var edgeP = function (b, tx, ty) { var ex = tx - b.cx, ey = ty - b.cy, hw = b.w / 2 + 3, hh = b.h / 2 + 3, k = Math.min(Math.abs(ex) > 0.01 ? hw / Math.abs(ex) : 1e9, Math.abs(ey) > 0.01 ? hh / Math.abs(ey) : 1e9); return [b.cx + ex * k, b.cy + ey * k]; };
        var p1 = edgeP(r, tr.cx, tr.cy), p2 = edgeP(tr, r.cx, r.cy); x1 = p1[0]; y1 = p1[1]; x2 = p2[0]; y2 = p2[1];
        var dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy) || 1, bend = Math.min(60, len * .18); cx = (x1 + x2) / 2 - dy / len * bend; cy = (y1 + y2) / 2 + dx / len * bend;
      }
      h += '<path d="M' + x1 + ' ' + y1 + ' Q' + cx + ' ' + cy + ' ' + x2 + ' ' + y2 + '" fill="none" stroke="#a3005a" stroke-width="1.8" stroke-dasharray="5 4" opacity=".85"/>';
      h += '<rect x="' + r.x + '" y="' + r.y + '" width="' + r.w + '" height="' + r.h + '" rx="4" fill="none" stroke="#a3005a" stroke-width="2"/><circle cx="' + x1 + '" cy="' + y1 + '" r="2.5" fill="#a3005a"/><circle cx="' + x2 + '" cy="' + y2 + '" r="2.5" fill="#17141a"/>';
    });
    h += '<rect x="' + tr.x + '" y="' + tr.y + '" width="' + tr.w + '" height="' + tr.h + '" rx="6" fill="none" stroke="#17141a" stroke-width="2.5"/>';
    svg.setAttribute("width", W); svg.setAttribute("height", H); svg.setAttribute("viewBox", "0 0 " + W + " " + H); svg.innerHTML = h;
    var clean = function (t) { return String(t).replace(/\s*(MM|MD)$/, "").trim(); };
    var terms = parts.map(function (p, i) { var t = clean(txtOf(p)), v = numOf(t); if (i === 0) return t; return v !== null && v < 0 ? " − " + t.replace(/^[-−]/, "") : " + " + t.replace(/^\+/, ""); }).join("");
    f.innerHTML = esc(terms + " = " + clean(txtOf(el))) + '<small>아무 곳이나 누르면 닫힘</small>';
    // put the formula where it covers none of the highlighted numbers
    var fw = f.offsetWidth, fh = f.offsetHeight, all = ps.concat([tr]);
    var hits = function (x, y) { return all.some(function (r) { return x < r.x + r.w && x + fw > r.x && y < r.y + r.h && y + fh > r.y; }); };
    var spots = [[tr.cx - fw / 2, tr.y + tr.h + 8], [tr.cx - fw / 2, tr.y - fh - 8], [tr.x + tr.w + (col ? 60 : 12), tr.cy - fh / 2], [tr.x - fw - 12, tr.cy - fh / 2]];
    var pick = spots[0];
    for (var si = 0; si < spots.length; si++) { var sx = Math.min(Math.max(8, spots[si][0]), W - fw - 8), sy = Math.min(Math.max(60, spots[si][1]), H - fh - 8); if (!hits(sx, sy)) { pick = [sx, sy]; break; } if (si === 0) pick = [sx, sy]; }
    f.style.left = pick[0] + "px"; f.style.top = pick[1] + "px";
  }
  function showSum(el) { sumEl = el; document.body.classList.add("sumon"); drawSum(); }
  function clearSum() { sumEl = null; document.body.classList.remove("sumon"); $("sumfx").innerHTML = ""; }
  pages.forEach(function (p) { p.addEventListener("scroll", function () { if (sumEl) drawSum(); }, { passive: true }); });
  window.addEventListener("resize", function () { if (sumEl) setTimeout(drawSum, 160); });

  /* ── mouse wheel: scroll the page, then turn it at either end ── */
  var wAcc = 0, wLock = 0, wLast = 0, wInner = 0;
  window.addEventListener("wheel", function (ev) {
    if (!document.body.classList.contains("staged") || document.body.classList.contains("open") || ev.ctrlKey) return;
    var dy = ev.deltaMode === 1 ? ev.deltaY * 16 : ev.deltaY;
    if (Math.abs(ev.deltaX) > Math.abs(dy)) return;
    var now = Date.now(), gap = now - wLast; wLast = now;
    if (now < wLock) { ev.preventDefault(); if (gap < 220) wLock = Math.max(wLock, now + 220); return; }
    var sc = pages[cur], atEnd = sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 2, atTop = sc.scrollTop <= 1;
    if ((dy > 0 && !atEnd) || (dy < 0 && !atTop)) { wInner = now; wAcc = 0; return; }
    ev.preventDefault();
    if (now - wInner < 350) { wInner = now; return; }
    if (gap > 300) wAcc = 0;
    wAcc += dy;
    if (Math.abs(wAcc) >= 40) { var t = cur + (wAcc > 0 ? 1 : -1); wAcc = 0; if (t >= 0 && t < pages.length) { go(t); wLock = now + 650; } }
  }, { passive: false });

  /* ── full screen: F key or the button ── */
  function fsOn() { return !!(document.fullscreenElement || document.webkitFullscreenElement); }
  function toggleFs() {
    var el = document.documentElement;
    try {
      var r = fsOn() ? (document.exitFullscreen || document.webkitExitFullscreen).call(document) : (el.requestFullscreen || el.webkitRequestFullscreen).call(el);
      if (r && r.catch) r.catch(function () { $("fs").title = "이 화면에서는 전체 화면을 쓸 수 없습니다. 브라우저의 F11을 사용하세요"; });
    } catch (e) { $("fs").title = "이 화면에서는 전체 화면을 쓸 수 없습니다. 브라우저의 F11을 사용하세요"; }
  }
  $("fs").addEventListener("click", toggleFs);
  ["fullscreenchange", "webkitfullscreenchange"].forEach(function (n) { document.addEventListener(n, function () { $("fs").setAttribute("aria-pressed", String(fsOn())); setTimeout(fit, 80); }); });
  try { window.focus(); } catch (e) { /* focus is a convenience */ }

