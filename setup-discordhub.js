#!/usr/bin/env node
/**
 * DiscordHub scaffold generator.
 * Creates missing directories and placeholder files without overwriting existing files.
 * Run with: npm run setup
 */
import { mkdirSync, existsSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const directories = [
  "public",
  "private",
  "src/help",
  "src/components",
  "src/pages",
  "src/styles",
  "src/utils",
  "google",
  "discord",
  "github",
  "ai",
  "server",
  "database/migrations",
  "admin",
  "integrations",
  "tests",
  "docs",
  "scripts",
  ".github/workflows",
  ".vscode"
];

const placeholders = [
  ["public/.gitkeep", "# Static assets go here.\n"],
  ["private/.gitkeep", "# Keep private local data out of version control.\n"],
  ["src/help/README.md", "# Help\n\nAdd onboarding guides and help content here.\n"],
  ["src/components/README.md", "# Components\n\nReusable UI components belong here.\n"],
  ["src/pages/README.md", "# Pages\n\nApplication pages or route views belong here.\n"],
  ["src/styles/README.md", "# Styles\n\nGlobal styles and design tokens belong here.\n"],
  ["src/utils/README.md", "# Utilities\n\nShared utilities belong here.\n"],
  ["google/README.md", "# Google Search integration\n\nImplement a server-side adapter for a supported search API. Keep keys on the server.\n"],
  ["discord/README.md", "# Discord integration\n\nAdd Discord discovery and official API adapters here.\n"],
  ["github/README.md", "# GitHub integration\n\nAdd GitHub API discovery helpers here.\n"],
  ["ai/README.md", "# AI features\n\nOptional AI-powered features belong here.\n"],
  ["server/README.md", "# Server\n\nAdd server entry points and API routes here.\n"],
  ["database/README.md", "# Database\n\nDocument schema, migrations, and persistence here.\n"],
  ["admin/README.md", "# Admin\n\nAdd protected administrative features here.\n"],
  ["integrations/README.md", "# Integrations\n\nShared integration interfaces and adapters belong here.\n"],
  ["tests/README.md", "# Tests\n\nAdd automated tests here.\n"],
  ["docs/ARCHITECTURE.md", "# Architecture\n\n## Initial boundaries\n\n- Keep UI code under src/.\n- Keep external API adapters isolated by provider.\n- Keep credentials server-side in local environment variables.\n- Validate input and apply provider rate limits.\n- Add tests for parsing, validation, and API adapters.\n"],
  ["scripts/README.md", "# Scripts\n\nProject maintenance scripts belong here.\n"],
  [".github/workflows/README.md", "# GitHub Actions\n\nAdd CI workflows here when the test/build commands are ready.\n"],
  [".vscode/settings.json", "{\n  \"editor.formatOnSave\": true,\n  \"files.trimTrailingWhitespace\": true\n}\n"],
  [".vscode/extensions.json", "{\n  \"recommendations\": [\"dbaeumer.vscode-eslint\"]\n}\n"]
];

let createdDirectories = 0;
let createdFiles = 0;
for (const directory of directories) {
  const target = join(root, directory);
  if (!existsSync(target)) {
    mkdirSync(target, { recursive: true });
    createdDirectories++;
  }
}
for (const [path, content] of placeholders) {
  const target = join(root, path);
  mkdirSync(dirname(target), { recursive: true });
  if (!existsSync(target)) {
    writeFileSync(target, content, { encoding: "utf8", flag: "wx" });
    createdFiles++;
  }
}
console.log(`DiscordHub setup complete. Created ${createdDirectories} directories and ${createdFiles} missing starter files.`);
console.log("Existing files were left unchanged.");
