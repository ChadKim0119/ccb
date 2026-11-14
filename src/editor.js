  /* ── 화면 편집 (글자 · 도형 · 색상) ──
     수정분은 원본(content.js)을 건드리지 않고 edits.json 에 따로 쌓여 로드 때 덮어써짐.
     저장 = 편집자의 GitHub 토큰으로 edits.json 을 dvt-board 에 커밋 (토큰이 없으면 저장 불가). */
  (function () {
    var REPO = "ChadKim0119/ccb", BRANCH = "dvt-board", FILE = "edits.json", TK = "ccb_gh_token";
    var S = { texts: {}, styles: {}, shapes: [] }, hist = [], savedSig = "", loadedText = "", snapped = false;
    var on = false, tool = "sel", sel = null, selShape = 0, editing = null, pre = "", drag = null, hov = null, stale = 0, nid = 1;
    var oH = new Map(), oT = new Map(), oS = new Map();
    var COLOR = /^(#[0-9a-fA-F]{3,8}|none|transparent)$/, KINDS = { rect: 1, ellipse: 1, line: 1, arrow: 1, text: 1 };
    var Q = function (s, r) { return (r || document).querySelector(s); };
    var kids = function (el) { return Array.prototype.filter.call(el.children, function (c) { return !c.classList.contains("ed-layer"); }); };
    var norm = function (el) { return el.textContent.replace(/\s+/g, " ").trim(); };
    var r1 = function (v) { return Math.round(v * 10) / 10; };
    var num = function (v) { return typeof v === "number" && isFinite(v) ? r1(v) : null; };
    var sig = function () { return JSON.stringify(serialize()); };
    var byId = function (id) { return S.shapes.filter(function (s) { return s.id === id; })[0]; };

    /* ── 요소 ↔ 경로 ── */
    function key(el) { var pg = el.closest("#app > section"), a = []; while (el !== pg) { a.unshift(kids(el.parentNode).indexOf(el)); el = el.parentNode; } return pg.id + "|" + a.join("."); }
    function find(k, o) {
      var i = k.indexOf("|"), el = document.getElementById(k.slice(0, i)), path = k.slice(i + 1);
      if (path) path.split(".").forEach(function (n) { el = el && kids(el)[+n]; });
      if (el && norm(el) === o) return el;
      stale++; return null;
    }
    function clean(html) { /* 허용 태그·속성만 남김 (edits.json 은 신뢰하지 않음) */
      var t = document.createElement("template"); t.innerHTML = html;
      (function walk(n) {
        Array.prototype.slice.call(n.childNodes).forEach(function (c) {
          if (c.nodeType === 3) return;
          if (c.nodeType !== 1 || !/^(B|I|U|STRONG|EM|SMALL|SPAN|BR|SUP|SUB|A)$/.test(c.tagName)) { c.replaceWith(document.createTextNode(c.textContent || "")); return; }
          Array.prototype.slice.call(c.attributes).forEach(function (a) {
            var v = a.value, ok = a.name === "class" || a.name === "style" || a.name === "title" || (/^data-/.test(a.name) && a.name !== "data-sum" && a.name !== "data-sp") || (a.name === "href" && /^(https?:|#)/.test(v));
            if (!ok || /url\(|expression|javascript:/i.test(v)) c.removeAttribute(a.name);
            else if (a.name === "class") { v = v.replace(/\bed-(hov|sel|ing)\b/g, "").trim(); v ? c.setAttribute("class", v) : c.removeAttribute("class"); }
          });
          walk(c);
        });
      })(t.content);
      return t.innerHTML;
    }

    /* ── 전체 적용 (원본 복원 후 S 를 다시 입힘) ── */
    function remember(el) { if (!oH.has(el)) { oH.set(el, el.innerHTML); oT.set(el, norm(el)); } }
    function applyAll() {
      oH.forEach(function (h, el) { el.innerHTML = h; });
      oS.forEach(function (v, el) { el.style.background = v.bg; el.style.color = v.fg; });
      oH.clear(); oT.clear(); oS.clear(); stale = 0;
      Object.keys(S.styles).forEach(function (k) { var v = S.styles[k], e = find(k, v.o); if (e) { oS.set(e, { bg: e.style.background, fg: e.style.color }); if (v.bg) e.style.background = v.bg; if (v.fg) e.style.color = v.fg; } });
      Object.keys(S.texts).forEach(function (k) { var v = S.texts[k], e = find(k, v.o); if (e) { remember(e); e.innerHTML = clean(v.h); } });
      if (sel && !document.contains(sel)) sel = null;
      renderShapes(); fit(); refresh();
    }

    /* ── 도형 ── */
    function layer(pg) {
      var l = Q(".ed-layer", pg);
      if (!l) { l = document.createElement("div"); l.className = "ed-layer"; l.innerHTML = '<i class="ed-probe"></i>'; pg.insertBefore(l, pg.firstChild); }
      return l;
    }
    function mkShape(s) {
      var d = document.createElement("div"), P = function (x, y) { return r1(x) + "," + r1(y); };
      if (s.k === "line" || s.k === "arrow") {
        var x0 = Math.min(s.x, s.x2) - 16, y0 = Math.min(s.y, s.y2) - 16, w = Math.abs(s.x2 - s.x) + 32, h = Math.abs(s.y2 - s.y) + 32;
        var a = Math.atan2(s.y2 - s.y, s.x2 - s.x), L = 9 + s.sw * 2.5, head = s.k !== "arrow" ? "" :
          '<polygon points="' + [P(s.x2, s.y2), P(s.x2 - L * Math.cos(a - .42), s.y2 - L * Math.sin(a - .42)), P(s.x2 - L * Math.cos(a + .42), s.y2 - L * Math.sin(a + .42))].join(" ") + '" fill="' + s.st + '"/>';
        var ln = function (extra) { return '<line x1="' + s.x + '" y1="' + s.y + '" x2="' + s.x2 + '" y2="' + s.y2 + '" ' + extra + '/>'; };
        d.innerHTML = '<svg class="ed-l" data-id="' + s.id + '" style="left:' + x0 + 'px;top:' + y0 + 'px;width:' + w + 'px;height:' + h + 'px" viewBox="' + [x0, y0, w, h].join(" ") + '">' +
          ln('stroke="' + s.st + '" stroke-width="' + s.sw + '" stroke-linecap="round"') + head + ln('class="ed-hit" stroke="transparent" stroke-width="18"') + '</svg>';
        return d.firstChild;
      }
      d.className = "ed-s"; d.setAttribute("data-id", s.id);
      d.style.cssText = "left:" + s.x + "px;top:" + s.y + "px;width:" + s.w + "px;height:" + s.h + "px;background:" + s.fill + ";border:" + (s.st === "none" ? 0 : s.sw) + "px solid " + (s.st === "none" ? "transparent" : s.st) + ";border-radius:" + (s.k === "ellipse" ? "50%" : "6px") + ";color:" + s.tc;
      d.textContent = s.t || "";
      return d;
    }
    function renderShapes() {
      pages.forEach(function (pg) {
        var l = layer(pg);
        Array.prototype.slice.call(l.children, 1).forEach(function (c) { c.remove(); });
        S.shapes.forEach(function (s) {
          if (s.p !== pg.id) return;
          var e = mkShape(s); if (s.id === selShape) e.classList.add("ed-sel"); l.appendChild(e);
        });
        var s = byId(selShape);
        if (s && s.p === pg.id) (s.k === "line" || s.k === "arrow" ? [["a", s.x, s.y], ["b", s.x2, s.y2]] : [["se", s.x + s.w, s.y + s.h]]).forEach(function (h) {
          var e = document.createElement("i"); e.className = "ed-h"; e.setAttribute("data-h", h[0]); e.style.left = (h[1] - 6) + "px"; e.style.top = (h[2] - 6) + "px"; l.appendChild(e);
        });
      });
    }
    function loc(pg, ev) { var l = layer(pg), r = l.getBoundingClientRect(), k = l.firstChild.getBoundingClientRect().width / 1000; return { x: (ev.clientX - r.left) / k, y: (ev.clientY - r.top) / k }; }

    /* ── 선택 · 색 ── */
    function deselect() { if (sel) sel.classList.remove("ed-sel"); sel = null; selShape = 0; renderShapes(); syncPal(); }
    function selectEl(el) { deselect(); sel = el; el.classList.add("ed-sel"); syncPal(); }
    function selectShape(id) { if (sel) sel.classList.remove("ed-sel"); sel = null; selShape = id; renderShapes(); syncPal(); }
    function toHex(c) { var m = String(c).match(/[\d.]+/g); if (!m || (m.length > 3 && +m[3] === 0)) return "#ffffff"; return "#" + m.slice(0, 3).map(function (x) { return ("0" + Math.round(+x).toString(16)).slice(-2); }).join(""); }
    function syncPal() {
      var s = byId(selShape), v = { bg: "#ffffff", fg: "#17141a", st: "#e6007e" };
      if (s) { v.bg = s.fill === "none" ? "#ffffff" : s.fill; v.fg = s.tc; v.st = s.st === "none" ? "#e6007e" : s.st; }
      else if (sel) { var c = getComputedStyle(sel); v.bg = toHex(c.backgroundColor); v.fg = toHex(c.color); }
      ["bg", "fg", "st"].forEach(function (n) { var i = $("ed-" + n); if (i) i.value = v[n]; });
      var u = $("ed-ui"); if (u) { u.setAttribute("data-sel", s ? "shape" : sel ? "el" : ""); u.setAttribute("data-line", s && (s.k === "line" || s.k === "arrow") ? "1" : ""); }
    }
    function snap() { if (!snapped) { hist.push(JSON.stringify(S)); snapped = true; } }
    function paint(n, val) {
      var s = byId(selShape);
      if (s) { snap(); if (n === "bg") s.fill = val; else if (n === "fg") s.tc = val; else s.st = val; renderShapes(); }
      else if (sel) {
        snap(); var k = key(sel), v = S.styles[k] || (S.styles[k] = { o: oT.has(sel) ? oT.get(sel) : norm(sel) });
        if (!oS.has(sel)) oS.set(sel, { bg: sel.style.background, fg: sel.style.color });
        if (n === "bg") { v.bg = val; sel.style.background = val; } else if (n === "fg") { v.fg = val; sel.style.color = val; }
      } else return;
      refresh();
    }

    /* ── 글자 편집 ── */
    function startEdit(el) {
      var isShape = !!el.getAttribute("data-id");
      stopEdit(); if (!isShape) deselect(); /* 도형은 deselect 가 DOM 을 다시 그려 대상이 끊김 */
      editing = el; pre = JSON.stringify(S);
      if (!isShape) remember(el);
      el.classList.add("ed-ing"); el.setAttribute("contenteditable", "plaintext-only");
      if (el.contentEditable !== "plaintext-only") el.setAttribute("contenteditable", "true");
      el.focus();
      var sl = getSelection(); if (!sl.anchorNode || !el.contains(sl.anchorNode)) { var r = document.createRange(); r.selectNodeContents(el); r.collapse(false); sl.removeAllRanges(); sl.addRange(r); }
    }
    function stopEdit() {
      var el = editing; if (!el) return; editing = null;
      el.removeAttribute("contenteditable"); el.classList.remove("ed-ing");
      var id = +el.getAttribute("data-id"), s = id && byId(id);
      if (s) s.t = el.textContent;
      else { var k = key(el), h = clean(el.innerHTML); if (h === clean(oH.get(el))) delete S.texts[k]; else S.texts[k] = { o: oT.get(el), h: h }; }
      if (JSON.stringify(S) !== pre) hist.push(pre);
      fit(); refresh();
    }

    /* ── 되돌리기 · 삭제 ── */
    function commit(fn) { hist.push(JSON.stringify(S)); fn(); snapped = false; refresh(); }
    function undo() { if (!hist.length) return; stopEdit(); S = JSON.parse(hist.pop()); selShape = 0; if (sel) sel.classList.remove("ed-sel"); sel = null; applyAll(); syncPal(); }
    function delShape() { commit(function () { S.shapes = S.shapes.filter(function (s) { return s.id !== selShape; }); selShape = 0; renderShapes(); syncPal(); }); }

    /* ── 포인터 ── */
    document.addEventListener("pointerdown", function (ev) {
      if (!on || ev.button !== 0) return;
      var t = ev.target, pg = t.closest && t.closest("#app > section");
      if (!pg || t.closest(".ed-ui") || (editing && editing.contains(t))) return;
      var p = loc(pg, ev), h = t.closest(".ed-h"), sh = t.closest("[data-id]"), s;
      ev.preventDefault(); stopEdit();
      if (h && (s = byId(selShape))) { drag = { m: "h", h: h.getAttribute("data-h"), s: s, o: JSON.parse(JSON.stringify(s)), p: p, pg: pg, pre: JSON.stringify(S) }; }
      else if (tool !== "sel") {
        var line = tool === "line" || tool === "arrow";
        s = { id: nid++, p: pg.id, k: tool, x: r1(p.x), y: r1(p.y), sw: line ? 3 : 2, st: tool === "text" ? "none" : "#e6007e", fill: tool === "rect" || tool === "ellipse" ? "#fde9f3" : "none", tc: "#17141a", t: "" };
        if (line) { s.x2 = s.x; s.y2 = s.y; } else { s.w = 0; s.h = 0; }
        drag = { m: "new", s: s, p: p, pg: pg, pre: JSON.stringify(S) }; S.shapes.push(s); selShape = s.id; renderShapes();
      }
      else if (sh) { s = byId(+sh.getAttribute("data-id")); selectShape(s.id); drag = { m: "mv", s: s, o: JSON.parse(JSON.stringify(s)), p: p, pg: pg, pre: JSON.stringify(S) }; }
      else if (!t.closest(".ed-layer")) selectEl(t);
      else deselect();
    }, true);
    document.addEventListener("pointermove", function (ev) {
      if (!drag) return;
      var q = loc(drag.pg, ev), dx = q.x - drag.p.x, dy = q.y - drag.p.y, s = drag.s, o = drag.o, line = s.k === "line" || s.k === "arrow";
      if (drag.m === "mv") { s.x = r1(o.x + dx); s.y = r1(o.y + dy); if (line) { s.x2 = r1(o.x2 + dx); s.y2 = r1(o.y2 + dy); } }
      else if (drag.m === "new") { if (line) { s.x2 = r1(q.x); s.y2 = r1(q.y); } else { s.x = r1(Math.min(drag.p.x, q.x)); s.y = r1(Math.min(drag.p.y, q.y)); s.w = r1(Math.abs(dx)); s.h = r1(Math.abs(dy)); } }
      else if (line) { if (drag.h === "a") { s.x = r1(o.x + dx); s.y = r1(o.y + dy); } else { s.x2 = r1(o.x2 + dx); s.y2 = r1(o.y2 + dy); } }
      else { s.w = Math.max(12, r1(o.w + dx)); s.h = Math.max(12, r1(o.h + dy)); }
      renderShapes();
    });
    document.addEventListener("pointerup", function () {
      if (!drag) return; var d = drag, s = d.s, line = s.k === "line" || s.k === "arrow"; drag = null;
      if (d.m === "new") {
        if (line && Math.hypot(s.x2 - s.x, s.y2 - s.y) < 8) { S.shapes.pop(); selShape = 0; }
        else if (!line && (s.w < 8 || s.h < 8)) { s.w = tool === "text" ? 160 : 120; s.h = tool === "text" ? 36 : 70; }
        hist.push(d.pre); setTool("sel"); renderShapes(); syncPal();
        if (selShape && s.k === "text") startEdit(Q('[data-id="' + s.id + '"]'));
      } else if (JSON.stringify(S) !== d.pre) hist.push(d.pre);
      refresh();
    });
    document.addEventListener("dblclick", function (ev) {
      if (!on) return; var t = ev.target, pg = t.closest && t.closest("#app > section");
      if (!pg || t.closest(".ed-ui") || t.closest(".ed-h")) return;
      var sh = t.closest(".ed-s");
      if (sh) { startEdit(sh); return; }
      if (t.closest(".ed-layer")) return;
      var r = document.caretRangeFromPoint && document.caretRangeFromPoint(ev.clientX, ev.clientY), n = r && r.startContainer, el = n && (n.nodeType === 3 ? n.parentElement : n);
      startEdit(el && pg.contains(el) && !el.closest(".ed-layer") ? el : t);
    }, true);
    document.addEventListener("click", function (ev) { if (on && ev.target.closest && ev.target.closest("#app")) { ev.preventDefault(); ev.stopPropagation(); } }, true);
    document.addEventListener("mouseover", function (ev) {
      if (!on) return; if (hov) hov.classList.remove("ed-hov"); hov = null;
      var t = ev.target; if (!editing && t.closest && t.closest("#app") && !t.closest(".ed-layer")) { hov = t; t.classList.add("ed-hov"); }
    });
    document.addEventListener("focusout", function (ev) { if (editing && ev.target === editing) setTimeout(stopEdit, 0); });
    document.addEventListener("keydown", function (ev) {
      if (!on) return;
      var typing = ev.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(ev.target.tagName);
      if (typing) {
        ev.stopPropagation();
        if (editing && ev.key === "Enter" && !ev.shiftKey) { ev.preventDefault(); stopEdit(); }
        else if (ev.key === "Escape") { ev.preventDefault(); if (editing) stopEdit(); else ev.target.blur(); }
        return;
      }
      if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === "z") { ev.preventDefault(); ev.stopPropagation(); undo(); }
      else if ((ev.key === "Delete" || ev.key === "Backspace") && selShape) { ev.preventDefault(); ev.stopPropagation(); delShape(); }
      else if (ev.key === "Escape" && (sel || selShape)) { ev.stopPropagation(); deselect(); }
    }, true);

    /* ── 저장 · 불러오기 ── */
    function serialize() {
      var sp = function (k) { var i = k.indexOf("|"); return { p: k.slice(0, i), path: k.slice(i + 1) }; };
      return {
        v: 1,
        texts: Object.keys(S.texts).sort().map(function (k) { var a = sp(k), v = S.texts[k]; a.o = v.o; a.h = v.h; return a; }),
        styles: Object.keys(S.styles).sort().map(function (k) { var a = sp(k), v = S.styles[k]; a.o = v.o; if (v.bg) a.bg = v.bg; if (v.fg) a.fg = v.fg; return a; }),
        shapes: S.shapes
      };
    }
    function load(t) {
      var j; try { j = JSON.parse(t); } catch (e) { return; }
      (j.texts || []).forEach(function (x) { if (x && typeof x.p === "string" && typeof x.path === "string") S.texts[x.p + "|" + x.path] = { o: String(x.o || ""), h: String(x.h || "") }; });
      (j.styles || []).forEach(function (x) {
        if (!x || typeof x.p !== "string" || typeof x.path !== "string") return;
        var v = { o: String(x.o || "") }; if (COLOR.test(x.bg)) v.bg = x.bg; if (COLOR.test(x.fg)) v.fg = x.fg; S.styles[x.p + "|" + x.path] = v;
      });
      (j.shapes || []).forEach(function (x) {
        if (!x || !KINDS[x.k] || typeof x.p !== "string" || !COLOR.test(x.st) || !COLOR.test(x.fill) || !COLOR.test(x.tc)) return;
        var s = { id: num(x.id), p: x.p, k: x.k, x: num(x.x), y: num(x.y), sw: num(x.sw), st: x.st, fill: x.fill, tc: x.tc, t: String(x.t || "").slice(0, 500) };
        if (x.k === "line" || x.k === "arrow") { s.x2 = num(x.x2); s.y2 = num(x.y2); } else { s.w = num(x.w); s.h = num(x.h); }
        if (Object.keys(s).every(function (n) { return s[n] !== null; })) S.shapes.push(s);
      });
      nid = S.shapes.reduce(function (m, s) { return Math.max(m, s.id + 1); }, 1);
    }
    var token = function () { try { return localStorage.getItem(TK) || ""; } catch (e) { return ""; } };
    function askToken() {
      var v = prompt("GitHub 토큰을 입력하세요.\n· " + REPO + " 저장소의 Contents: Read and write 권한만 있는 fine-grained 토큰을 권장합니다.\n· 이 브라우저에만 저장됩니다. 비우면 삭제됩니다.", token());
      if (v === null) return ""; try { v ? localStorage.setItem(TK, v.trim()) : localStorage.removeItem(TK); } catch (e) {} return v.trim();
    }
    async function save() {
      stopEdit();
      var tk = token() || askToken(); if (!tk) return msg("토큰이 없어 저장하지 않았습니다.", 1);
      var txt = JSON.stringify(serialize(), null, 1) + "\n", url = "https://api.github.com/repos/" + REPO + "/contents/" + FILE;
      var H = { Authorization: "Bearer " + tk, Accept: "application/vnd.github+json" };
      msg("저장 중…");
      try {
        var g = await fetch(url + "?ref=" + BRANCH, { headers: H, cache: "no-store" }), sha, remote = "";
        if (g.status === 200) { var j = await g.json(); sha = j.sha; remote = new TextDecoder().decode(Uint8Array.from(atob(j.content.replace(/\s/g, "")), function (c) { return c.charCodeAt(0); })); }
        else if (g.status !== 404) throw new Error(g.status === 401 || g.status === 403 ? "토큰 권한 오류(" + g.status + ")" : "조회 실패(" + g.status + ")");
        if (remote && remote !== loadedText && !confirm("이 화면을 연 뒤 다른 저장이 있었습니다. 내 수정으로 덮어쓸까요?")) return msg("저장을 취소했습니다.", 1);
        var bin = ""; new TextEncoder().encode(txt).forEach(function (c) { bin += String.fromCharCode(c); });
        var n = serialize(), p = await fetch(url, { method: "PUT", headers: H, body: JSON.stringify({ message: "화면 편집: 글자 " + n.texts.length + " · 서식 " + n.styles.length + " · 도형 " + n.shapes.length, content: btoa(bin), branch: BRANCH, sha: sha }) });
        if (!p.ok) throw new Error(p.status === 401 || p.status === 403 ? "토큰 권한 오류(" + p.status + ")" : p.status === 409 || p.status === 422 ? "다른 저장과 충돌했습니다. 다시 시도하세요(" + p.status + ")" : "저장 실패(" + p.status + ")");
        var r = await p.json(); loadedText = txt; savedSig = sig(); msg("저장됨 · 커밋 " + String(r.commit.sha).slice(0, 7) + " (배포는 별도)"); refresh(true);
      } catch (e) { msg(String(e.message || e), 1); }
    }

    /* ── 툴바 ── */
    function msg(t, bad) { var m = $("ed-msg"); m.textContent = t; m.classList.toggle("bad", !!bad); }
    function refresh(keep) {
      if (!$("ed-msg")) return; if (keep) return;
      var n = serialize(); msg("글자 " + n.texts.length + " · 서식 " + n.styles.length + " · 도형 " + n.shapes.length + (sig() !== savedSig ? " · 저장 안 됨" : "") + (stale ? " · 적용 안 된 수정 " + stale + "건" : ""));
    }
    function setTool(t) { tool = t; document.body.classList.toggle("ed-draw", t !== "sel"); Array.prototype.forEach.call(document.querySelectorAll("#ed-ui [data-t]"), function (b) { b.classList.toggle("on", b.getAttribute("data-t") === t); }); }
    function setOn(v) {
      if (v && !document.body.classList.contains("staged")) return;
      if (!v) { stopEdit(); deselect(); setTool("sel"); if (hov) hov.classList.remove("ed-hov"); }
      on = v; document.body.classList.toggle("editing", v); $("ed-ui").hidden = !v; $("ed-toggle").setAttribute("aria-pressed", String(v)); if (v) refresh();
    }
    var ui = document.createElement("div");
    ui.id = "ed-ui"; ui.className = "ed-ui"; ui.hidden = true;
    ui.innerHTML = '<div class="ed-row"><button type="button" data-t="sel" class="on" title="선택 · 더블클릭으로 글자 수정">선택</button><button type="button" data-t="rect">▭ 사각형</button><button type="button" data-t="ellipse">◯ 원</button><button type="button" data-t="line">╱ 선</button><button type="button" data-t="arrow">→ 화살표</button><button type="button" data-t="text">T 글상자</button>' +
      '<span class="sp"></span><label class="c-bg">배경 <input type="color" id="ed-bg"></label><button type="button" id="ed-nobg" class="c-bg" title="배경 없음(투명)">없음</button><label class="c-fg">글자 <input type="color" id="ed-fg"></label><label class="c-st">선 <input type="color" id="ed-st"></label>' +
      '<span class="sp"></span><button type="button" id="ed-up" class="c-el" title="바로 위 요소(블록)를 선택">↑ 상위</button><button type="button" id="ed-rs" class="c-el" title="이 요소의 색 수정을 취소">색 초기화</button><button type="button" id="ed-del" class="c-sh">삭제</button><button type="button" id="ed-undo">↶ 되돌리기</button>' +
      '<span class="sp"></span><button type="button" id="ed-save" class="pri">저장 (git)</button><button type="button" id="ed-tok" title="GitHub 토큰 입력/삭제">토큰</button></div><div class="ed-msg" id="ed-msg" role="status"></div>';
    document.body.appendChild(ui);
    var tg = document.createElement("button");
    tg.type = "button"; tg.id = "ed-toggle"; tg.className = "pg-back"; tg.setAttribute("aria-pressed", "false"); tg.title = "화면 편집 (글자 · 도형 · 색상)"; tg.textContent = "✎ 편집";
    $("fs").parentNode.insertBefore(tg, $("fs"));
    tg.addEventListener("click", function () { setOn(!on); });
    ui.addEventListener("click", function (ev) {
      var b = ev.target.closest("button"); if (!b) return;
      if (b.hasAttribute("data-t")) { stopEdit(); deselect(); setTool(b.getAttribute("data-t")); }
      else if (b.id === "ed-save") save();
      else if (b.id === "ed-tok") { askToken(); msg(token() ? "토큰을 저장했습니다." : "토큰을 삭제했습니다."); }
      else if (b.id === "ed-undo") undo();
      else if (b.id === "ed-del") { if (selShape) delShape(); }
      else if (b.id === "ed-up") { if (sel && sel.parentElement && sel.parentElement.closest("#app > section")) { var u = sel.parentElement; selectEl(u); } }
      else if (b.id === "ed-rs") { if (sel && S.styles[key(sel)]) commit(function () { delete S.styles[key(sel)]; var e = sel; applyAll(); selectEl(e); }); }
      else if (b.id === "ed-nobg") { var s = byId(selShape); if (s) { snap(); s.fill = "none"; renderShapes(); snapped = false; refresh(); } else if (sel) { paint("bg", "transparent"); snapped = false; } }
    });
    ["bg", "fg", "st"].forEach(function (n) {
      var i = $("ed-" + n);
      i.addEventListener("input", function () { paint(n, i.value); });
      i.addEventListener("change", function () { snapped = false; });
    });
    window.addEventListener("beforeunload", function (ev) { if (on && sig() !== savedSig) { ev.preventDefault(); ev.returnValue = ""; } });
    window.addEventListener("resize", function () { setTimeout(function () { if (on && !document.body.classList.contains("staged")) setOn(false); }, 250); });

    pages.forEach(layer);
    fetch(FILE, { cache: "no-store" }).then(function (r) { return r.ok ? r.text() : ""; }).then(function (t) {
      loadedText = t; if (t) { load(t); applyAll(); }
      savedSig = sig();
    }).catch(function () { savedSig = sig(); });
    savedSig = sig();
  })();
