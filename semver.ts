const fs = require("fs");
const manifest = require("./public/manifest.json");
const packageJson = require("./package.json");

const FILE_PATH = "./public/manifest.json";

try {
  manifest["version"] = packageJson["version"];
  console.log(`Semver: increased current version to [${manifest["version"]}]`);
  fs.writeFileSync(FILE_PATH, JSON.stringify(manifest, null, 2));
} catch (e) {
  console.error(e);
}
