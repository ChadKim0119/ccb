// Build: content.js (data) + page.html (template) -> src/out/index.html and the deployed ./index.html
// Run from anywhere: npm run build
const fs = require("fs");
const path = require("path");
const d = require("./content.js");
const tpl = fs.readFileSync(path.join(__dirname, "page.html"), "utf8");
const json = JSON.stringify(d).replace(/</g, "\\u003c");
const out = tpl.replace("/*__DATA__*/", () => json);
fs.mkdirSync(path.join(__dirname, "out"), { recursive: true });
fs.writeFileSync(path.join(__dirname, "out", "index.html"), out);
fs.writeFileSync(path.join(__dirname, "..", "index.html"), out);
console.log("bytes", out.length);
