const fs = require("fs");
const d = require("./content.js");
const tpl = fs.readFileSync("page.html", "utf8");
const json = JSON.stringify(d).replace(/</g, "\\u003c");
const out = tpl.replace("/*__DATA__*/", () => json);
fs.mkdirSync("out", { recursive: true });
fs.writeFileSync("out/index.html", out);
console.log("bytes", out.length);
