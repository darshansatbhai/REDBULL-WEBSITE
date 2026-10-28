import * as THREE from 'three';
import { gsap } from 'gsap';

// The label is drawn on a real cylindrical mesh rather than rotating a flat image.
function makeLabel() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d');
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  const bullMark = new Image();
  let markReady = false;

  function draw() {
    const w = canvas.width;
    const h = canvas.height;
    ctx.fillStyle = '#b7c8db';
    ctx.fillRect(0, 0, w, h);
    // The quartered silver and blue treatment wraps all the way around the can.
    ctx.fillStyle = '#163d79';
    ctx.fillRect(0, 0, w / 2, h / 2);
    ctx.fillRect(w / 2, h / 2, w / 2, h / 2);
    const sheen = ctx.createLinearGradient(0, 0, w, 0);
    sheen.addColorStop(0, 'rgba(255,255,255,.02)');
    sheen.addColorStop(.21, 'rgba(255,255,255,.20)');
    sheen.addColorStop(.43, 'rgba(0,12,48,.08)');
    sheen.addColorStop(.65, 'rgba(255,255,255,.25)');
    sheen.addColorStop(.83, 'rgba(0,12,48,.10)');
    sheen.addColorStop(1, 'rgba(255,255,255,.02)');
    ctx.fillStyle = sheen;
    ctx.fillRect(0, 0, w, h);

    // Front-facing lockup and a secondary lockup on the reverse side.
    [0, 1024, 2048].forEach(center => {
      ctx.textAlign = 'center';
      ctx.fillStyle = '#d4083e';
      ctx.font = 'bold 215px Arial, sans-serif';
      ctx.fillText('Red Bull', center, 670);
      if (markReady) ctx.drawImage(bullMark, center - 365, 725, 730, 278);
      ctx.fillStyle = '#d4083e';
      ctx.font = 'bold 76px Arial, sans-serif';
      ctx.letterSpacing = '11px';
      ctx.fillText('ENERGY DRINK', center, 1170);
      ctx.letterSpacing = '0px';
      ctx.fillStyle = '#f6f7fa';
      ctx.font = 'bold 39px Arial, sans-serif';
      ctx.fillText('VITALIZES BODY AND MIND', center, 1295);
      ctx.fillStyle = '#183d74';
      ctx.font = 'bold 30px Arial, sans-serif';
      ctx.fillText('250 ml  •  8.4 FL OZ', center, 1855);
    });
    texture.needsUpdate = true;
  }
  draw();
  bullMark.onload = () => { markReady = true; draw(); };
  bullMark.src = '/assets/bulls.png';
  return texture;
}

export function initCanScene({ reduceMotion }) {
  const canvas = document.querySelector('#can-canvas');
  const container = document.querySelector('.can-render');
  const stage = document.querySelector('.can-stage');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  } catch (error) {
    container.classList.add('no-webgl');
    console.warn('3D rendering is unavailable; showing the product image instead.', error);
    return;
  }
  container.classList.add('has-webgl');
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0.2, 8.6);
  camera.lookAt(0, 0, 0);
  scene.add(new THREE.HemisphereLight(0xe4efff, 0x304366, 2.3));
  const key = new THREE.DirectionalLight(0xffffff, 3.2);
  key.position.set(-4, 6, 8);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x9ecbff, 2.7);
  rim.position.set(5, 1, -3);
  scene.add(rim);

  const can = new THREE.Group();
  scene.add(can);
  const metal = new THREE.MeshStandardMaterial({ color: 0xc3ced8, metalness: 0.68, roughness: 0.28 });
  const darkMetal = new THREE.MeshStandardMaterial({ color: 0x7d8b98, metalness: 0.65, roughness: 0.34 });
  const bodyMaterial = new THREE.MeshStandardMaterial({ map: makeLabel(), metalness: 0.35, roughness: 0.38 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(.73, .73, 3.55, 128, 1, true), bodyMaterial);
  can.add(body);
  function cylinder(top, bottom, height, y, material = metal) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(top, bottom, height, 96), material);
    mesh.position.y = y;
    can.add(mesh);
    return mesh;
  }
  function ring(radius, tube, y, material = metal) {
    const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 12, 96), material);
    mesh.rotation.x = Math.PI / 2;
    mesh.position.y = y;
    can.add(mesh);
    return mesh;
  }
  cylinder(.62, .73, .20, 1.875);
  cylinder(.62, .62, .055, 1.99, darkMetal);
  ring(.62, .045, 2.02);
  cylinder(.605, .605, .025, 2.015);
  ring(.48, .012, 2.035, darkMetal);
  cylinder(.73, .65, .13, -1.84);
  ring(.65, .035, -1.91);
  const tab = new THREE.Mesh(new THREE.TorusGeometry(.14, .035, 12, 48), darkMetal);
  tab.rotation.x = Math.PI / 2;
  tab.scale.set(.7, 1.35, 1);
  tab.position.set(0, 2.045, .05);
  can.add(tab);
  const rivet = new THREE.Mesh(new THREE.SphereGeometry(.045, 20, 12), metal);
  rivet.position.set(0, 2.06, -.06);
  rivet.scale.y = .3;
  can.add(rivet);
  can.rotation.set(.05, Math.PI, -.10);

  function resize() {
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = width < 500 ? 9.3 : 8.6;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  }
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  resize();

  // GSAP's ScrollTrigger scrubs an actual 3D rotation, with no autoplay.
  if (!reduceMotion) {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: stage,
        start: 'top top',
        end: '+=220%',
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: self => {
          document.querySelector('.can-progress i').style.transform = `scaleX(${self.progress})`;
          document.querySelector('.can-stage-number').textContent = `${String(Math.min(3, Math.floor(self.progress * 3) + 1)).padStart(2, '0')} / 03`;
        }
      }
    });
    timeline.to(can.rotation, { y: Math.PI * 3.9, ease: 'none', duration: 1 }, 0)
      .to(can.rotation, { z: .12, x: .20, duration: .45, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 0)
      .to(can.position, { y: .16, duration: .5, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 0)
      .to('.can-giant-type', { xPercent: -14, ease: 'none', duration: 1 }, 0)
      .to('.can-halo', { rotation: 150, scale: 1.06, ease: 'none', duration: 1 }, 0)
      .fromTo('.can-stage-copy', { x: 0 }, { x: -35, opacity: .35, ease: 'none', duration: .45 }, 0)
      .fromTo('.can-stage-aside', { x: 35, opacity: .45 }, { x: 0, opacity: 1, ease: 'none', duration: .45 }, .2);
  }

  let visible = true;
  const visibility = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }, { rootMargin: '100px' });
  visibility.observe(stage);
  gsap.ticker.add(() => { if (visible) renderer.render(scene, camera); });
}
