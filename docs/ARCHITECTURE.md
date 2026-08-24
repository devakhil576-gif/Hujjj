# MotionWeave architecture

## Hypothesis

A useful video generator does not necessarily need to synthesize every frame independently from random noise. A scene can be represented as a compact state and a time-varying motion program. The renderer can then spend expensive computation only where visual information changes.

## Proposed representation

```text
Scene
 ├── background layer
 ├── subject layers
 ├── object layers
 ├── depth estimates
 ├── camera state
 └── appearance/style state

Motion graph
 ├── action nodes
 ├── duration
 ├── transforms
 ├── pose/expression controls
 └── transition constraints
```

## Generation path

1. Parse a prompt into a scene specification. A conventional LLM is optional; a small grammar/parser can be used for the first prototype.
2. Build a motion graph from deterministic primitives and learned motion embeddings.
3. Produce sparse keyframes or latent anchors.
4. Predict intermediate frames with temporal reconstruction rather than full independent generation.
5. Run local consistency correction on regions with high temporal error.
6. Encode the result with Android hardware codecs.

## Candidate lightweight learning methods

- Knowledge distillation from a larger teacher model into a small student.
- Low-rank adapters for motion-specific learning.
- Quantization-aware training and integer inference.
- Pruning and structured sparsity.
- Latent-space prediction instead of RGB-space prediction.
- Frame interpolation networks for cheap intermediate frames.
- Motion-vector/depth/segmentation conditioning.
- Patch-wise temporal refinement so only changed regions receive expensive inference.
- Mixture of small specialist modules rather than one monolithic model.

## Training without a giant text model

The training corpus can be represented as sequences rather than captions. For each clip, extract optical flow, keypoints/pose where applicable, depth estimates, segmentation masks, camera motion estimates, and sparse keyframes. A small motion model can learn transformations and temporal relationships from those signals without learning a general-purpose language model.

A practical first dataset can be synthetic and procedurally generated. That allows unlimited variation in camera transforms, object motion, lighting changes, occlusion and scene composition without redistributing copyrighted video.

## Mobile constraints

The runtime should measure available memory and hardware acceleration, then select a profile:

- Low memory: low resolution, fewer keyframes, CPU-friendly interpolation.
- GPU: tiled latent reconstruction and half precision where supported.
- NPU/accelerator: quantized motion/refinement networks where a compatible runtime is available.

The prototype intentionally separates the motion graph from the renderer so that different model runtimes can be tested later without redesigning the application.
