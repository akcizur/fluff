# Fluff

A motion-led portfolio built with Vite, React and TypeScript.

The first GitHub Actions run expands the uploaded source bundle into the normal source tree, commits those files to `main`, then builds and deploys the site to GitHub Pages. Subsequent runs build directly from the regular source files.

The typography system independently randomizes every title character across 12 Google Font families whenever the title crosses its scroll trigger line. The hero, travelling transition and navigation wordmark stay synchronized.

See the workflow in `.github/workflows/pages.yml`.
