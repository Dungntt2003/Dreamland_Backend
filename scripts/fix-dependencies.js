const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const vnpayPath = path.join(__dirname, "../node_modules/vnpay/package.json");
if (fs.existsSync(vnpayPath)) {
  const pkg = JSON.parse(fs.readFileSync(vnpayPath, "utf8"));
  if (pkg.scripts) {
    delete pkg.scripts["format:fix"];
    delete pkg.scripts.postinstall;
    fs.writeFileSync(vnpayPath, JSON.stringify(pkg, null, 2));
    console.log("✅ Fixed vnpay package");
  }
}

try {
  require("bcrypt");
  console.log("✅ Bcrypt is working");
} catch (error) {
  console.log("🔧 Rebuilding bcrypt...");
  try {
    execSync("npm rebuild bcrypt", { stdio: "inherit" });
    console.log("✅ Bcrypt rebuilt successfully");
  } catch (rebuildError) {
    console.log("❌ Failed to rebuild bcrypt, trying alternative...");
  }
}
