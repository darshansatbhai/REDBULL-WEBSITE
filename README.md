<div align="center">

# RED BULL — BEYOND THE ORDINARY

**An immersive, unofficial Red Bull-inspired web experience.**

Scroll through a world of action sports, bold storytelling, and a 3D can that moves with you.

[![Live Demo](https://img.shields.io/badge/LIVE_DEMO-Visit_the_website-D2003C?style=for-the-badge)](https://red-bull-inspired-experience.vercel.app/)
[![Vite](https://img.shields.io/badge/Vite-Frontend-001E3C?style=for-the-badge&logo=vite)](https://vite.dev/)
[![GSAP](https://img.shields.io/badge/GSAP-Animation-001E3C?style=for-the-badge)](https://gsap.com/)
[![Three.js](https://img.shields.io/badge/Three.js-3D-001E3C?style=for-the-badge&logo=threedotjs)](https://threejs.org/)

**[Explore the live experience ↗](https://red-bull-inspired-experience.vercel.app/)**

</div>

---

## The experience

- **Scroll-driven 3D can** — a Three.js model rotates and moves as you scroll through a pinned GSAP scene.
- **Smooth scrolling** — Lenis and GSAP share a clock for synchronized scrolling and animation.
- **Cinematic storytelling** — a featured-story carousel, editorial cards, and action-sports imagery.
- **Scroll feedback** — vibration patterns on supported browsers, alongside a visual cue and an on/off control.
- **Responsive design** — layouts for desktop, tablet, and mobile, including a mobile navigation menu.
- **Accessibility considerations** — reduced-motion preferences are respected, with an option to enable motion; a product image is shown when WebGL is unavailable.

## Built with

- [Vite](https://vite.dev/) — development server and build tool
- [GSAP & ScrollTrigger](https://gsap.com/) — animation and scroll choreography
- [Three.js](https://threejs.org/) — 3D can rendering
- [Lenis](https://lenis.darkroom.engineering/) — smooth scrolling
- HTML, CSS, and JavaScript

## Run locally

Make sure you have Node.js and npm installed, then run:

```bash
git clone https://github.com/darshansatbhai/REDBULL-WEBSITE.git
cd REDBULL-WEBSITE
npm install
npm run dev
```

Open the local URL printed in your terminal. To create and preview a production build:

```bash
npm run build
npm run preview
```

## Project structure

```text
├── public/                 # Favicon and 3D label artwork
├── src/
│   ├── can-scene.js        # Three.js model and scroll-driven scene
│   ├── main.js             # Page interactions and GSAP setup
│   ├── scroll-feedback.js  # Vibration and visual scroll feedback
│   └── style.css           # Responsive styles
├── index.html              # Page content and layout
└── package.json
```

## Notes

- Haptic feedback depends on browser and device support. Browsers cannot control vibration strength or detect whether a device has a vibration motor; some require a tap before vibration is allowed.
- Images, branding, and fonts are externally hosted or used as part of this concept, so an internet connection is needed for the full experience.
- This is a **fan-made creative concept**, not an official Red Bull website. Red Bull trademarks and imagery belong to their respective owners; obtain the appropriate permissions before commercial use.

---

<div align="center">Made to explore what gives you wiiings.</div>
