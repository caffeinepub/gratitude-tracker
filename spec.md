# Gratitude Garden

## Current State
A fully-featured gratitude tracking app with:
- A living watercolor garden where each plant/tree represents a gratitude subject, with branches and leaves for each entry
- Seasonal and time-of-day awareness (sun, moon, stars, sky gradients)
- Animated birds, falling petals/leaves, watercolor SVG trees on the horizon
- Ambient audio (piano, birdsong, rustling leaves) with smooth fade-in
- Goals page with reminders and suggested goals
- Share/snapshot functionality
- The design token colors are flat neutral (grey/white), lacking the rich warm nature palette the app deserves

## Requested Changes (Diff)

### Add
- Rich OKLCH warm-green/earth design tokens (primary = forest green, accent = warm amber, background = soft cream) to match the garden theme
- Subtle animated entrance for the garden scene
- Better typography hierarchy using serif for headings, clean sans-serif for body

### Modify
- `index.css` (in `/src/frontend/`): Replace neutral grey design tokens with warm botanical palette (cream backgrounds, forest green primary, amber accents, soft earth tones)
- `App.tsx`: Improve header with a warmer color background that feels more nature-inspired
- Overall visual polish: tighten spacing, improve card aesthetics, make goals page feel more cohesive with garden theme

### Remove
- Nothing removed

## Implementation Plan
1. Update `index.css` design tokens to warm botanical OKLCH palette
2. Update `App.tsx` header to use the richer palette
3. Run UI Craft audit pass for top visual improvements
4. Validate build

## UX Notes
- The garden is the star — keep it full-width and atmospheric
- Headers should feel calm and natural, not corporate
- Warm cream/parchment backgrounds evoke journaling and mindfulness
