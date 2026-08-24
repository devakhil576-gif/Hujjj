# MotionWeave

MotionWeave is an experimental, mobile-first AI video research project. It explores a different route from conventional large text-to-video diffusion: represent a scene as a compact motion graph, generate a small number of keyframes, and reconstruct temporal frames with lightweight learned or procedural components.

## Goal

Build a video generator that can eventually run on Android-class hardware without requiring a frontier-sized model or a huge denoising loop.

## Current MVP

The Android app contains a local motion-graph editor and a lightweight canvas renderer. It does **not** claim to be a Seedance-class model yet. The MVP is deliberately model-free so the motion representation can be tested before expensive model work begins.

Current pipeline:

`Prompt → Motion Graph → Keyframe Plan → Temporal Reconstruction → Preview`

The first renderer supports camera motion, object translation, scale, rotation, opacity, easing, and keyframe interpolation. This provides a deterministic testbed for the future learned renderer.

## Research direction

1. Scene representation: background, subjects, objects, camera and depth layers.
2. Motion representation: compact time-dependent transforms instead of generating every frame from noise.
3. Keyframe synthesis: generate sparse high-quality anchors.
4. Temporal reconstruction: interpolate or predict intermediate frames.
5. Consistency correction: detect temporal drift and repair only affected regions.
6. Mobile runtime: quantized small networks, NNAPI/GPU/NPU execution where available, tiled memory and adaptive resolution.

## What we are deliberately NOT doing first

- Training a multi-billion-parameter video model from scratch.
- Depending on an LLM for every generation step.
- Requiring cloud inference for the core renderer.
- Pretending that the current prototype is already a frontier video model.

## Android build

Open GitHub Actions → **Build MotionWeave APK** → **Run workflow** → download `MotionWeave-debug-apk`.

## License and model data

The repository code is experimental. Any future model weights or datasets must be added only when their licenses permit redistribution and use. Do not scrape or redistribute copyrighted video datasets without appropriate rights.
