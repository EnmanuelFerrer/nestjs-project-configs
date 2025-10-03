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
writeFileIfNotExists(".eslintrc.js", `module.exports = require("../../eslint.config.js");`);
writeFileIfNotExists(".prettierrc.js", `module.exports = require("../../prettier.config.js");`);
writeFileIfNotExists(".stylelintrc.js", `module.exports = require("../../stylelint.config.js");`);
writeFileIfNotExists("lint-staged.config.js", `module.exports = require("../../lint-staged.config.js");`);

// Inicializar Husky y hooks
try {
  console.log("Setting up Husky...");
  
  // 1. Instala e inicializa Husky en el proyecto del usuario.
  // El comando `npx husky` es el correcto para la inicialización.
  execSync("npx husky", { stdio: "inherit" });

  // 2. Usa 'husky add' para crear el hook pre-commit (antes 'set')
  execSync('npx husky add .husky/pre-commit "npx lint-staged"', { stdio: "inherit" });
  
  // 3. Usa 'husky add' para crear el hook pre-push (antes 'set')
  execSync('npx husky add .husky/pre-push "npm run test"', { stdio: "inherit" });

  console.log("✅ Husky hooks installed successfully!");
} catch (e) {
  // El mensaje de error sigue siendo válido
  console.error("⚠️ Could not setup Husky automatically. Please run 'npx husky' and configure hooks manually.", e);
}