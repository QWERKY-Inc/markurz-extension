// @ts-ignore
const fs = require("fs");
const semverInc = require("semver/functions/inc");

const FILE_PATH = "./public/manifest.json";

try {
  const jsonData = JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
  jsonData["version"] = semverInc(jsonData["version"], "patch");
  console.log(`Semver: increased current version to [${jsonData["version"]}]`);
  fs.writeFileSync(FILE_PATH, JSON.stringify(jsonData, null, 2));
} catch (e) {
  console.error(e);
}
