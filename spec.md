# Gratitude Garden

## Current State
A rich gratitude tracking app with a watercolor botanical garden aesthetic. Features include:
- Animated garden with seasonal changes (spring/summer/autumn/winter), time-of-day sky shifts (dawn, morning, midday, dusk, evening, night), sun/moon, clouds, stars
- Multiple plant/tree types (oak, cypress, lollipop, citrus, shrub, willow, magnolia) with watercolor SVG overlays and branch/leaf gratitude entries
- Birds (sparrow, robin, blue tit, canary, cardinal, parakeet) with seasonal weighting
- Falling particles (spring petals, autumn leaves)
- Ambient sounds: piano, birdsong, rustling leaves with smooth fade-in
- Goals page for daily gratitude cultivation
- Save/share snapshot
- Caffeine.ai footer attribution

The app is well-built and code-complete. The user wants to polish and publish it.

## Requested Changes (Diff)

### Add
- Improved overall UI polish: stronger botanical identity, richer visual hierarchy, more personality in the garden display
- Caption/message field when sharing (the user previously requested this and it was suggested)
- Additional UI refinements to make the app feel production-ready and worth publishing

### Modify
- Share functionality: add optional personal caption/message when sharing
- Header: subtle improvements to make it feel more premium/branded
- Garden controls: slight refinement for a polished look
- Footer: ensure attribution is clean and present

### Remove
- Nothing

## Implementation Plan
1. Add caption input to the Share flow (modal or inline prompt before sharing)
2. Polish the header typography and visual weight
3. Refine garden control buttons (Save, Share, Sound) for better visual cohesion
4. Ensure all lint/type errors are clean for a production-ready build

## UX Notes
- Keep the watercolor aesthetic consistent throughout
- Share caption should be optional and quick to dismiss
- Controls should feel tactile and intentional, not generic
