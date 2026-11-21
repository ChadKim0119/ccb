/* 화면 편집 저장소 (Vercel 서버 함수)
   - GET  /api/edits            → 최신 edits.json (GitHub main) 내용
   - POST /api/edits {pw, check} → 편집 비밀번호 확인
   - POST /api/edits {pw, base, mine, name} → 그사이 다른 저장과 항목 단위로 합쳐 edits.json 을 main 에 커밋
   필요한 환경 변수: GITHUB_TOKEN (ccb 저장소 Contents 읽기/쓰기), EDIT_PASSWORD (편집 비밀번호) */
const crypto = require("crypto");
const REPO = process.env.EDITS_REPO || "ChadKim0119/ccb", BRANCH = "main", FILE = "edits.json";
const API = "https://api.github.com/repos/" + REPO + "/contents/" + FILE;
const gh = () => ({ Authorization: "Bearer " + process.env.GITHUB_TOKEN, Accept: "application/vnd.github+json", "User-Agent": "ccb-edits", "X-GitHub-Api-Version": "2022-11-28" });

async function remoteGet() {
  const r = await fetch(API + "?ref=" + BRANCH, { headers: gh(), cache: "no-store" });
  if (r.status === 404) return { sha: undefined, text: "" };
  if (!r.ok) throw Object.assign(new Error("GitHub 조회 실패 (" + r.status + ")"), { code: r.status === 401 || r.status === 403 ? 502 : 502 });
  const j = await r.json();
  return { sha: j.sha, text: Buffer.from(j.content, "base64").toString("utf8") };
}
function parse(t) { try { return t ? JSON.parse(t) : {}; } catch (e) { return {}; } }
function merge3(base, mine, theirs) {
  const out = { v: 1 }; let conflicts = 0;
  const kp = (x) => x.p + "|" + x.path;
  [["texts", kp], ["styles", kp], ["moves", kp], ["shapes", (x) => "id" + x.id]].forEach(([f, kf]) => {
    const mp = (o) => { const m = {}; (Array.isArray(o[f]) ? o[f] : []).forEach((x) => { if (x && typeof x === "object") m[kf(x)] = JSON.stringify(x); }); return m; };
    const B = mp(base), M = mp(mine), T = mp(theirs), keys = new Set([...Object.keys(B), ...Object.keys(M), ...Object.keys(T)]), res = [];
    [...keys].sort().forEach((k) => {
      const v = M[k] === B[k] ? T[k] : M[k];
      if (M[k] !== B[k] && T[k] !== B[k] && T[k] !== M[k]) conflicts++;
      if (v) res.push(JSON.parse(v));
    });
    out[f] = res;
  });
  return { obj: out, conflicts };
}
function pwOk(pw) {
  const a = Buffer.from(String(pw || "")), b = Buffer.from(String(process.env.EDIT_PASSWORD || ""));
  return b.length > 0 && a.length === b.length && crypto.timingSafeEqual(a, b);
}
async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return parse(req.body);
  const chunks = []; for await (const c of req) chunks.push(c);
  return parse(Buffer.concat(chunks).toString("utf8"));
}
function send(res, code, obj) { res.statusCode = code; res.setHeader("Content-Type", "application/json; charset=utf-8"); res.setHeader("Cache-Control", "no-store"); res.end(JSON.stringify(obj)); }

module.exports = async function handler(req, res) {
  if (!process.env.GITHUB_TOKEN || !process.env.EDIT_PASSWORD) return send(res, 501, { error: "편집 저장소가 아직 설정되지 않았습니다 (GITHUB_TOKEN · EDIT_PASSWORD)" });
  try {
    if (req.method === "GET") { const r = await remoteGet(); return send(res, 200, { sha: r.sha || null, text: r.text }); }
    if (req.method !== "POST") return send(res, 405, { error: "허용되지 않는 요청" });
    const b = await readBody(req);
    if (!pwOk(b.pw)) { await new Promise((r) => setTimeout(r, 800)); return send(res, 401, { error: "편집 비밀번호가 맞지 않습니다" }); }
    if (b.check) return send(res, 200, { ok: true });
    if (typeof b.mine !== "string" || b.mine.length > 2e6) return send(res, 400, { error: "저장할 내용이 없습니다" });
    const who = String(b.name || "").replace(/[\r\n]/g, " ").slice(0, 30);
    for (let tries = 0; tries < 4; tries++) {
      const r0 = await remoteGet();
      const m = merge3(parse(b.base), parse(b.mine), parse(r0.text));
      const txt = JSON.stringify(m.obj, null, 1) + "\n", n = m.obj;
      const p = await fetch(API, { method: "PUT", headers: gh(), body: JSON.stringify({ message: "화면 편집" + (who ? "(" + who + ")" : "") + ": 글자 " + n.texts.length + " · 서식 " + n.styles.length + " · 도형 " + n.shapes.length + " · 이동 " + n.moves.length, content: Buffer.from(txt, "utf8").toString("base64"), branch: BRANCH, sha: r0.sha }) });
      if (p.status === 409 || p.status === 422) continue;
      if (!p.ok) return send(res, 502, { error: "GitHub 저장 실패 (" + p.status + ")" });
      const j = await p.json();
      return send(res, 200, { text: txt, sha: j.content && j.content.sha, commit: j.commit && j.commit.sha, merged: !!r0.text && r0.text !== b.base, conflicts: m.conflicts });
    }
    return send(res, 409, { error: "다른 저장과 계속 충돌했습니다. 잠시 후 다시 저장하세요" });
  } catch (e) { return send(res, 502, { error: String(e.message || e) }); }
};
