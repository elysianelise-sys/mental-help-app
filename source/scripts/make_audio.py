"""Synthesize two royalty-free placeholder audio files from scratch.

rain-loop.wav             - 30 s seamless stereo rain loop
unwind-your-thoughts.wav  - 10:00 gentle ambient pad (mono)

Every sound is generated from noise and sine waves. No samples or recordings
are used, so there are no licensing restrictions.
"""
import sys
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
from scipy.io import wavfile

out = sys.argv[1]
rng = np.random.default_rng(7)


def bp(x, lo, hi, sr, order=2):
    return sosfilt(butter(order, [lo, hi], btype="band", fs=sr, output="sos"), x)


def lp(x, f, sr, order=2):
    return sosfilt(butter(order, f, btype="low", fs=sr, output="sos"), x)


def hp(x, f, sr, order=2):
    return sosfilt(butter(order, f, btype="high", fs=sr, output="sos"), x)


# ---------------------------------------------------------------- rain loop
SR = 44100
LOOP = 30.0
XF = 2.0                         # crossfade length for the seamless loop
N = int((LOOP + XF) * SR)


def rain_channel():
    white = rng.standard_normal(N).astype(np.float32)
    hiss = bp(white, 400, 7000, SR) * 0.35                 # steady downpour hiss
    hiss *= 1 + 0.15 * np.sin(2 * np.pi * np.arange(N) / SR / 7.3 + rng.uniform(0, 6))
    rumble = lp(np.cumsum(rng.standard_normal(N)) * 0.002, 180, SR)  # low rumble
    rumble -= np.mean(rumble)
    drops = np.zeros(N, np.float32)
    for _ in range(int(LOOP * 55)):                        # individual droplets
        t = rng.integers(0, N - 4000)
        L = rng.integers(400, 2500)
        env = np.exp(-np.linspace(0, rng.uniform(6, 14), L))
        drops[t:t + L] += rng.standard_normal(L) * env * rng.uniform(0.05, 0.4)
    drops = bp(drops, 1800, 6500, SR)
    return hiss + drops + rumble * 0.6


rain = np.stack([rain_channel(), rain_channel()], axis=1)
# make it loop seamlessly: fade the extra tail into the start
x = int(XF * SR)
fade = np.linspace(0, 1, x)[:, None]
loop = rain[: int(LOOP * SR)].copy()
loop[:x] = loop[:x] * fade + rain[int(LOOP * SR):] * (1 - fade)
loop = loop / np.max(np.abs(loop)) * 0.5                   # about -6 dBFS peak, a soft bed
wavfile.write(f"{out}/rain-loop.wav", SR, loop.astype(np.float32))

# ---------------------------------------------------------- 10-minute pad
SR2 = 32000
DUR = 600.0
T = int(DUR * SR2)
track = np.zeros(T, np.float32)


def note(freq, length, sr):
    t = np.arange(int(length * sr)) / sr
    vib = 1 + 0.002 * np.sin(2 * np.pi * 0.17 * t + rng.uniform(0, 6))
    w = (np.sin(2 * np.pi * freq * vib * t)
         + 0.35 * np.sin(2 * np.pi * freq * 2.003 * t)
         + 0.12 * np.sin(2 * np.pi * freq * 3.01 * t))
    a, r = 0.35, 0.35                                      # slow swell in and out
    env = np.minimum(1, np.minimum(t / (length * a), (length - t) / (length * r)))
    return (w * np.clip(env, 0, 1) ** 1.6).astype(np.float32)


def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


# gentle progression (Fmaj9 - Cmaj7/E - Am9 - G6sus), soft mid register
chords = [[53, 60, 64, 67, 69], [52, 59, 64, 67, 71], [57, 60, 64, 67, 71], [55, 60, 62, 64, 69]]
STEP = 15.0                                                # new chord every 15 s
LEN = 22.0                                                 # chords overlap
pos, i = 0.0, 0
while pos < DUR:
    for m in chords[i % 4]:
        n = note(hz(m), LEN, SR2) * 0.09
        s = int(pos * SR2)
        e = min(T, s + len(n))
        track[s:e] += n[: e - s]
    pos += STEP
    i += 1

# sparse soft bell tones from the pentatonic scale
penta = [72, 74, 76, 79, 81, 84]
t_bell = 6.0
while t_bell < DUR - 8:
    f = hz(rng.choice(penta))
    L = 5.0
    tt = np.arange(int(L * SR2)) / SR2
    b = (np.sin(2 * np.pi * f * tt) + 0.2 * np.sin(2 * np.pi * f * 2.76 * tt)) * np.exp(-tt * 1.1) * np.minimum(1, tt / 0.02)
    s = int(t_bell * SR2)
    track[s:s + len(b)] += (b * 0.05).astype(np.float32)
    t_bell += rng.uniform(7, 16)

track = lp(track, 3500, SR2).astype(np.float32)
# soft room reverb (exponentially decaying noise impulse response)
ir_t = np.arange(int(2.8 * SR2)) / SR2
ir = (rng.standard_normal(len(ir_t)) * np.exp(-ir_t * 2.2)).astype(np.float32)
ir = lp(ir, 4000, SR2)
ir /= np.sqrt(np.sum(ir ** 2))
wet = fftconvolve(track, ir)[:T].astype(np.float32)
track = 0.65 * track + 0.35 * wet
# 6 s fade in, 10 s fade out
fi, fo = int(6 * SR2), int(10 * SR2)
track[:fi] *= np.linspace(0, 1, fi)
track[-fo:] *= np.linspace(1, 0, fo)
track = track / np.max(np.abs(track)) * 0.7
wavfile.write(f"{out}/unwind-your-thoughts.wav", SR2, track.astype(np.float32))
print("done")
