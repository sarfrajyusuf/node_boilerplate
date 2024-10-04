import fs from "node:fs";
import path from "node:path";

// Path to the package.json file
const packageJsonPath = path.join(__dirname, "../../../package.json");

// Read and parse package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

const memory = {
  MEMORY_HEAP_USAGE_THRESHOLD: 0.8,
  MEMORY_USAGE_THRESHOLD: 0.9,
};
// Get name and version
const appInfo = {
  name: packageJson.name,
  version: packageJson.version,
};

export { appInfo, memory };
