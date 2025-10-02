const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function writeFileIfNotExists(fileName, content) {
  const filePath = path.resolve(process.cwd(), fileName);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Created ${fileName}`);
  } else {
    console.log(`ℹ️ ${fileName} already exists, skipping`);
  }
}

// Generar archivos de configuración
writeFileIfNotExists(".eslintrc.js", `module.exports = require("nestjs-project-configs/eslint.config.js");`);
writeFileIfNotExists(".prettierrc.js", `module.exports = require("nestjs-project-configs/prettier.config.js");`);
writeFileIfNotExists(".stylelintrc.js", `module.exports = require("nestjs-project-configs/stylelint.config.js");`);
writeFileIfNotExists("lint-staged.config.js", `module.exports = require("nestjs-project-configs/lint-staged.config.js");`);

// Inicializar Husky y hooks
try {
  console.log("Setting up Husky...");
  
  // 1. Initialize husky in the user's project
  execSync("npx husky", { stdio: "inherit" });

  // 2. Use 'husky set' to create the pre-commit hook (it handles permissions)
  execSync('npx husky set .husky/pre-commit "npx lint-staged"', { stdio: "inherit" });
  
  // 3. Use 'husky set' to create the pre-push hook
  execSync('npx husky set .husky/pre-push "npm run test"', { stdio: "inherit" });

  console.log("✅ Husky hooks installed successfully!");
} catch (e) {
  console.error("⚠️ Could not setup Husky automatically. Please run 'npx husky' and configure hooks manually.", e);
}