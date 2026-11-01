/** Scroll crossing helpers and per-glyph random typeface assignment. */
export type ScrollSide = -1 | 0 | 1;

export const GLYPH_FONTS = [
  { id: 'google-sans', family: 'Google Sans Flex', weight: 900, style: 'normal' },
  { id: 'jacquard', family: 'Jacquard 12', weight: 400, style: 'normal' },
  { id: 'anton', family: 'Anton', weight: 400, style: 'normal' },
  { id: 'bebas', family: 'Bebas Neue', weight: 400, style: 'normal' },
  { id: 'cormorant', family: 'Cormorant Garamond', weight: 700, style: 'normal' },
  { id: 'dm-mono', family: 'DM Mono', weight: 500, style: 'normal' },
  { id: 'fraunces', family: 'Fraunces', weight: 800, style: 'normal' },
  { id: 'instrument-serif', family: 'Instrument Serif', weight: 400, style: 'normal' },
  { id: 'playfair', family: 'Playfair Display', weight: 800, style: 'normal' },
  { id: 'space-grotesk', family: 'Space Grotesk', weight: 700, style: 'normal' },
  { id: 'syne', family: 'Syne', weight: 800, style: 'normal' },
  { id: 'unbounded', family: 'Unbounded', weight: 800, style: 'normal' },
] as const;

export type GlyphFontId = (typeof GLYPH_FONTS)[number]['id'];
const FONT_IDS = GLYPH_FONTS.map(({ id }) => id) as GlyphFontId[];
const FONT_BY_ID = new Map(GLYPH_FONTS.map((font) => [font.id, font]));

/** Keep a dead zone around the switch line so wheel jitter cannot cause flicker. */
export function getScrollSide(distanceFromLine: number, deadZone = 42): ScrollSide {
  if (!Number.isFinite(distanceFromLine)) return 0;
  if (distanceFromLine > deadZone) return 1;
  if (distanceFromLine < -deadZone) return -1;
  return 0;
}

/** A title changes only after crossing the reading line, in either direction. */
export function crossedScrollBand(previous: ScrollSide, next: ScrollSide): boolean {
  return previous !== 0 && next !== 0 && previous !== next;
}

/**
 * Pick a typeface independently for every glyph. A glyph avoids its previous face,
 * so a scroll crossing always creates a visible new composition without synchronizing
 * the entire heading to one font. `random` is injectable to keep the helper testable.
 */
export function createRandomGlyphFontSequence(
  count: number,
  random: () => number = Math.random,
  previous: readonly (GlyphFontId | undefined)[] = [],
): GlyphFontId[] {
  return Array.from({ length: Math.max(0, Math.floor(count)) }, (_, index) => {
    const previousFont = previous[index];
    const choices = FONT_IDS.length > 1
      ? FONT_IDS.filter((font) => font !== previousFont)
      : FONT_IDS;
    const sample = random();
    const normalized = Number.isFinite(sample) ? Math.min(0.999999, Math.max(0, sample)) : 0;
    return choices[Math.floor(normalized * choices.length)] ?? FONT_IDS[0];
  });
}

/** Read the current per-character font assignment from a split heading. */
export function getGlyphFontSequence(root: HTMLElement): GlyphFontId[] {
  return Array.from(root.querySelectorAll<HTMLElement>('.c'), (glyph) => {
    const id = glyph.dataset.glyphFont as GlyphFontId | undefined;
    return id && FONT_BY_ID.has(id) ? id : FONT_IDS[0];
  });
}

/** Apply a previously selected sequence, used to keep the hero and its morph twins aligned. */
export function applyGlyphFontSequence(root: HTMLElement, sequence: readonly GlyphFontId[]): void {
  const glyphs = root.querySelectorAll<HTMLElement>('.c');
  glyphs.forEach((glyph, index) => {
    const font = FONT_BY_ID.get(sequence[index] ?? FONT_IDS[index % FONT_IDS.length]) ?? GLYPH_FONTS[0];
    glyph.dataset.glyphFont = font.id;
    glyph.style.fontFamily = `\"${font.family}\", sans-serif`;
    glyph.style.fontWeight = String(font.weight);
    glyph.style.fontStyle = font.style;
  });
}
