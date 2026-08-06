# Repository Guidelines

## Project Structure & Module Organization

This is a Vite + React frontend. Application startup is in `src/main.jsx`, with route definitions in `src/routes/Router.jsx`. Page features live in `src/pages/<pageName>/`; keep page components, page-specific helpers, and CSS together. Shared UI belongs in `src/components/`, API clients in `src/api/`, and reusable logic in `src/utils/`. Static files are in `public/`; fonts and other imported assets are in `src/assets/`. Root deployment/configuration files include `vite.config.js`, `eslint.config.js`, `Dockerfile`, and `nginx.conf`. Unit tests are colocated with the code they exercise (for example, `src/utils/validation/validators.test.js`).

## Build, Test, and Development Commands

Use Node.js 22, matching GitHub Actions.

- `npm ci` installs the lockfile-pinned dependencies.
- `npm run dev` starts the Vite development server with hot reload.
- `npm run build` creates the production bundle in `dist/`.
- `npm run preview` serves the built bundle locally for production-like checks.
- `npm run lint` runs ESLint across the repository.
- `npm run test` runs Vitest in watch mode; use `npm run test:run` for a one-shot/CI run.

API requests use `VITE_API_BASE_URL`, falling back to `http://localhost:8080`; production uses `/api`, which Nginx proxies to the backend. Keep secrets out of client-exposed `VITE_` variables.

## Coding Style & Naming Conventions

Use two-space indentation, semicolons, and double-quoted JavaScript strings, consistent with the existing code and ESLint configuration. Use PascalCase for React components, camelCase for functions/variables, and descriptive `index.jsx`/`index.css` files within feature directories. Prefer the `@/` alias for imports from `src` (for example, `@/api/authApi.js`). Existing CSS uses BEM-like names such as `.auth-form__submit`.

## Testing Guidelines

Write Vitest tests beside the implementation with a `.test.js` suffix. Group behavior with `describe` and individual cases with `it`; cover valid, invalid, boundary, and non-mutating behavior for utilities and validation logic. Follow the detailed [test conventions](docs/TEST_CONVENTION.md), especially F.I.R.S.T., Given-When-Then, public-interface assertions, and descriptive test names. Run `npm run test:run` and `npm run lint` before opening a PR. No coverage threshold is currently configured.

## Commit & Pull Request Guidelines

Use the established lowercase Conventional Commit-style prefixes: `feat:`, `fix:`, `refactor:`, and `ci:` (for example, `fix: handle expired session`). Keep each commit focused. PRs should explain the user-visible or technical change, list verification commands, link the related issue when applicable, and include screenshots or a short recording for UI changes. Call out API, environment, or deployment changes explicitly.
