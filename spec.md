# Specification

## Summary
**Goal:** Add an interactive plant/tree garden visualization as the primary view of the Gratitude Grove app, where each gratitude category grows as its own animated plant based on the number of entries.

**Planned changes:**
- Create a plant garden view that groups gratitude entries by category, rendering each category as a separate animated plant/tree using SVG-based 2D rendering
- Plant growth stages: seed (1 entry), sprout (2–3 entries), sapling (4–6 entries), full tree (7+ entries)
- Each individual gratitude entry is represented as a branch or leaf on its plant; hovering/tapping reveals the entry text in a tooltip or popover
- Entries without a category are grouped under a default "General" plant
- Plants are arranged in a horizontal scrollable or grid layout
- Add gentle idle sway animation to all plants; trigger a grow/"watering" animation when a new entry is added
- Apply a nature-inspired earthy warm background (sky and soil gradient) with organic plant colors (greens, ambers, browns)
- Make the garden view the default on load, with a toggle to switch to the existing flat list view
- Keep GratitudeForm and GratitudeStats visible above the garden view

**User-visible outcome:** On opening the app, users see their gratitude entries visualized as a living garden of animated plants. Each subject/category is its own growing plant, with branches and leaves representing individual entries. Users can hover or tap leaves to read the entry text, switch to the classic list view via a toggle, and watch plants animate and grow when new entries are added.
