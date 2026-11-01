# Fluff

A minimal, motion-led portfolio with scroll choreography and a per-character type system.

## Typography

The display title is split into independent glyph spans. Each time it crosses the scroll trigger line, every visible character receives a new random typeface from a 12-family Google Fonts pool. Consecutive states avoid repeating the same font on a glyph. The hero title, navigation wordmark and transition mirror share the same assignment so the morph remains coherent.

Fonts: Google Sans Flex, Jacquard 12, Anton, Bebas Neue, Cormorant Garamond, DM Mono, Fraunces, Instrument Serif, Playfair Display, Space Grotesk, Syne and Unbounded.

## Development

```bash
npm install
npm run dev
npm test
npm run build
```

The site is built with Vite, React and TypeScript. A GitHub Actions workflow builds and deploys `main` to GitHub Pages. The first upload expands the bundled source tree into regular files and commits that tree back to `main`; later runs build directly from the normal source tree.
