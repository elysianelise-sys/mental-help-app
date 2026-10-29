# Placeholder audio

Both files were generated from scratch in code on 6 October 2026, by `scripts/make_audio.py`, using only noise and sine waves. They contain no samples, recordings or third-party material, so they are free to use, change and publish.

| File | Use | Details |
|---|---|---|
| `tracks/unwind-your-thoughts.mp3` | Calm track "Unwind Your Thoughts" | 10:00 exactly. A gentle ambient pad (Fmaj9 → Cmaj7/E → Am9 → G6sus, one chord every 15 s) with sparse soft bell tones and a light room reverb. 6 s fade in, 10 s fade out. Mono, 96 kbps MP3, about -19.5 LUFS |
| `ambient/rain-loop.wav` | Rain Sounds ambient layer | 30 s, built to loop seamlessly: a steady hiss, individual droplets and a low rumble. Stereo, 22 kHz, 16-bit WAV, about -20.5 LUFS. **WAV on purpose:** MP3 adds a tiny silence at the start that makes loops click |

To replace them with real recordings later, keep the same paths, or update `src` / `ambientSrc` in `tracks.json`.
