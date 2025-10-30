# MeghOS-Portfolio — Developer Handbook

[Live site — meghvyas.netlify.app](https://meghvyas.netlify.app)  
[![repo size](https://img.shields.io/github/repo-size/MeghVyas3132/MeghOS-Portfolio?color=blue)](https://github.com/MeghVyas3132/MeghOS-Portfolio)

Purpose: provide a compact, professional, developer-focused reference that explains architecture, conventions, local workflow, CI/CD, troubleshooting, and contribution guidelines. This document is intended for maintainers and contributors who need to understand how the project works and how to extend it safely.

---

## Quick overview
MeghOS-Portfolio is a personal portfolio site designed to be lightweight, responsive, and easily deployable as static assets. The project is authored for maintainability and clarity rather than heavy feature complexity. Production is hosted on Netlify at the link above.

Primary goals for contributors:
- Keep builds reproducible and small.
- Follow linting/formatting rules for consistent reviews.
- Ensure accessibility and performant asset delivery.

---

## Repository layout

(Adjust to reflect exact structure if different in repo)

- /.github/                 — workflows, issue/PR templates
- /public/                  — static assets served verbatim (images, icons, favicon)
- /src/                     — source: components, pages, styles, utils
  - /components/
  - /pages/ or /views/
  - /styles/ or /css/
  - /utils/
- /scripts/                 — ad-hoc helpers (deploy, codegen)
- package.json
- pnpm-lock.yaml / yarn.lock / package-lock.json
- .eslintrc.js, .prettierrc, tsconfig.json (if TypeScript)
- README.md

Principles:
- Prefer small single-purpose components.
- Keep assets under `/public` and keep them optimized (webp/AVIF where appropriate).
- Use feature folders if a feature grows beyond a few files.

---

## Local development setup

Prerequisites
- Node.js LTS (18+ recommended)
- npm (>=9) or pnpm/yarn (use the same package manager used by the repo)
- git

Quick start
1. Clone
   - git clone https://github.com/MeghVyas3132/MeghOS-Portfolio.git
   - cd MeghOS-Portfolio

2. Install
   - npm ci
   - or pnpm install / yarn install (choose based on project's lockfile)

3. Environment
   - cp .env.example .env.local
   - Populate required values in `.env.local`.

4. Start dev server
   - npm run dev
   - Default dev URL typically http://localhost:3000 (check console for exact port).

5. Build locally
   - npm run build
   - Preview production build (if supported): npm run preview

---

## Coding standards & testing

- Use ESLint + Prettier — configure pre-commit hooks (husky) to run lint and formatting.
- Prefer TypeScript for maintainability; if TS is used, keep `strict` mode on.
- Tests:
  - Unit: Jest + Testing Library (React)
  - E2E: Playwright / Cypress (optional)
- Strive for deterministic tests; mock network calls in unit tests.

Accessibility:
- Use semantic HTML and ARIA where needed.
- Automate a11y checks (axe) in CI for PRs.

---

## Contact

Maintainer: Megh Vyas — @MeghVyas3132  
Site: https://meghvyas.netlify.app

---
