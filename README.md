<div align="center">
  <img src="public/images/gestual_intimacy.png" alt="Bruno Realities Hero" width="100%" />
</div>

# Bruno Realities - Digital Corporeality Portfolio

An immersive 3D interactive portfolio exploring digital corporeality, biomorphic aesthetics, and artificial intimacy. This project blends advanced 3D rendering with atmospheric post-processing to create a unique digital experience.

## 🌟 Key Features

### 🔮 Organic 3D Core (`Scene.tsx`)
The heart of the experience is a biomorphic sphere that floats and evolves. It features a custom shader mimicking translucent, liquid-like material ("liquid glass") that reacts dynamically to user interaction and scroll position, changing scale, position, and distortion levels.

### 🖥️ Immersive Overlay (`Overlay.tsx`)
A sophisticated UI layer that floats above the 3D world, managing:
- **Digital Bodies**: The hero section.
- **Manifesto**: A statement on artificial intimacy.
- **Archive**: An interactive list of works.
- **Contact**: Connection points.

### 📺 Atmospheric Effects (`Effects.tsx`)
The site evokes a retro-futuristic vibe through a custom post-processing pipeline:
- **CRT Effect**: Scanlines and analog noise.
- **Chromatic Aberration**: RGB shifts.
- **Vignette**: Focusing attention on the center.

## 🖼️ Gallery

<div align="center">
  <img src="public/images/Escapismo.png" width="45%" alt="Escapismo" />
  <img src="public/images/absentia.png" width="45%" alt="Absentia" />
</div>
<div align="center">
  <img src="public/images/orgasm_enhancer.png" width="45%" alt="Orgasm Enhancer" />
  <img src="public/images/render_smiley.png" width="45%" alt="Smiley Render" />
</div>

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **3D Engine**: Three.js
- **React 3D**: React Three Fiber (@react-three/fiber)
- **Abstractions**: Drei (@react-three/drei)
- **Post-Processing**: React Postprocessing
- **Animation**: GSAP

## 🚀 Run Locally

This project contains everything you need to run the app locally.

**Prerequisites:** Node.js

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  (Optional) Set the `GEMINI_API_KEY` in `.env.local` if you are using AI features.

3.  Run the development server:
    ```bash
    npm run dev
    ```

## 📖 Documentation

For a detailed guide on project structure, component behavior, and maintenance, please refer to [GUIA_DO_PROJETO.md](GUIA_DO_PROJETO.md).
