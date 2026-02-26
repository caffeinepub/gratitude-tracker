# Gratitude Garden

## Current State
- PlantGarden has audio elements for piano-melody.mp3 and birdsong.mp3
- Both audio files are toggled via a single mute/unmute button
- Piano plays at volume 0.55, birdsong at 0.25
- Audio is muted by default (isMuted: true)
- There is a sound toggle button in the bottom-right controls
- The app has a rich watercolor aesthetic with seasonal/time-of-day sky, birds, plants, falling particles

## Requested Changes (Diff)

### Add
- Layer a third ambient audio track: rustling leaves (nature ambience — wind through leaves)
- Make the ambient sound experience richer: slightly increase birdsong presence during daytime/spring/summer, fade it at night
- Add a subtle audio fade-in when sound is enabled so it doesn't snap on abruptly
- Show a small animated sound-wave indicator (3 bars pulsing) on the sound button when audio is unmuted, to signal the ambient atmosphere is alive

### Modify
- Volume levels: piano 0.45 (slightly softer), birdsong 0.30 (slightly more present), leaves 0.20 (subtle background rustle)
- The sound toggle button should visually indicate "ambient sounds playing" state with the animated bars icon
- Birdsong volume dynamically adjusts: louder during day (morning/midday), softer at dusk/dawn, very faint at night

### Remove
- Nothing removed

## Implementation Plan
1. Add a third audio ref for leaves/wind ambience audio (`/assets/audio/nature-ambience.mp3` — reuse the birdsong file or create a leaves rustle layer)
2. Actually: use the existing birdsong.mp3 as the ambient birds layer and add a second nature sound layer using a Web Audio API oscillator or a second audio element pointing to a freely available ambient sound URL
3. Simplest approach: add a second HTMLAudioElement for rustling leaves pointed at `/assets/audio/leaves-rustle.mp3` (same directory as existing audio)
4. Add fade-in logic: when unmuting, ramp volume from 0 to target over ~2 seconds using a small interval
5. Add animated sound-wave SVG indicator in the mute toggle button when !isMuted
6. Adjust birdsong volume dynamically based on timeOfDay.period

## UX Notes
- The sound toggle already exists — just enhance the visual feedback and add the third layer
- Fade-in prevents jarring audio onset
- The pulsing bars on the button give a live visual cue that the garden is "breathing"
- Keep the button compact — just replace the static icon with the animated bars when sound is on
