const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function writeFileIfNotExists(fileName, content) {
  const filePath = path.resolve(process.cwd(), fileName);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Created ${fileName}`);
  }
}

writeFileIfNotExists(
  ".eslintrc.js",
  `module.exports = require("nestjs-project-configs/eslint.config.js");`,
);
writeFileIfNotExists(
  ".prettierrc.js",
  `module.exports = require("nestjs-project-configs/prettier.config.js");`,
);
writeFileIfNotExists(
  ".stylelintrc.js",
  `module.exports = require("nestjs-project-configs/stylelint.config.js");`,
);
writeFileIfNotExists(
  "lint-staged.config.js",
  `module.exports = require("nestjs-project-configs/lint-staged.config.js");`,
);

// Husky hooks
try {
  execSync("npx husky install", { stdio: "inherit" });
  writeFileIfNotExists(
    ".husky/pre-commit",
    `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
npx lint-staged
`,
  );
  writeFileIfNotExists(
    ".husky/pre-push",
    `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
npm run test
`,
  );
  console.log("✅ Husky hooks installed");
} catch (e) {
  console.log("⚠️ Could not setup husky, run 'npx husky install' manually");
}
