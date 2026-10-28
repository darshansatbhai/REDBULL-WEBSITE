import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { initCanScene } from './can-scene.js';
import { initScrollFeedback } from './scroll-feedback.js';

gsap.registerPlugin(ScrollTrigger);

const slides = [
  { category: 'MOUNTAIN BIKE', title: ['THE EDGE IS', 'JUST THE', 'BEGINNING'], copy: 'Some see the impossible. Others see a starting line.', location: 'VIRGIN, UTAH', caption: 'RED BULL RAMPAGE', image: 'https://img.redbull.com/images/c_fill,g_auto,w_2000,h_1200/q_auto,f_auto/redbullcom/2026/9/22/ecnj4btcxwfvydcac2ra/luke-whitlock-red-bull-rampage-virgin-utah-2025', link: 'https://www.redbull.com/us-en/events/red-bull-rampage' },
  { category: 'SURFING', title: ['CHASE THE', 'FEELING OF', 'FREEDOM'], copy: 'The best stories begin where the shore ends.', location: 'OUT IN THE BLUE', caption: 'THE WORLD OF SURFING', image: 'https://img.redbull.com/images/c_crop,x_0,y_0,h_5461,w_8192/c_fill,w_2000,h_1200/q_auto,f_auto/redbullcom/2026/10/27/r47kiij5yhybgramp7qm/carissa-moores-comeback-adds-another-chapter-to-her-legacy', link: 'https://www.redbull.com/us-en/surfing' },
  { category: 'DANCE', title: ['MOVE TO', 'YOUR OWN', 'BEAT'], copy: 'The world moves differently when you make your own rules.', location: 'ZURICH, SWITZERLAND', caption: 'RED BULL DANCE YOUR STYLE', image: 'https://img.redbull.com/images/c_crop,x_0,y_961,h_1835,w_2752/c_fill,w_2000,h_1200/q_auto,f_auto/redbullcom/2026/10/24/odnf1tw2axbpa5qxanlz/red-bull-dance-your-style-world-final-2026-winner-willis', link: 'https://www.redbull.com/us-en/dance' }
];

const heroImage = document.querySelector('#hero-image');
const title = document.querySelector('#hero-title');
const deviceReducesMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let motionOverride = false;
try { motionOverride = localStorage.getItem('redbull-motion-enabled') === 'true'; } catch { /* Storage is optional. */ }
const reduceMotion = deviceReducesMotion && !motionOverride;
if (deviceReducesMotion) {
  const choice = document.querySelector('.motion-choice');
  const toggle = document.querySelector('#motion-toggle');
  choice.classList.add('is-visible');
  document.documentElement.classList.toggle('motion-forced', motionOverride);
  document.querySelector('#motion-status').textContent = motionOverride ? '3D motion is enabled.' : 'Reduced motion is enabled on this device.';
  toggle.textContent = motionOverride ? 'USE REDUCED MOTION' : 'ENABLE 3D MOTION';
  toggle.addEventListener('click', () => {
    try { localStorage.setItem('redbull-motion-enabled', String(!motionOverride)); } catch { /* Storage is optional. */ }
    location.reload();
  });
}
// Let GSAP and Lenis share one clock so pinned scenes track the smoothed scroll.
const lenis = reduceMotion ? null : new Lenis({ duration: 1.25, smoothWheel: true, anchors: true });
if (lenis) {
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}
initCanScene({ reduceMotion });
initScrollFeedback();
let current = 0;
let transitioning = false;
heroImage.style.backgroundImage = `url("${slides[0].image}")`;

function renderSlide(index) {
  const slide = slides[index];
  heroImage.style.backgroundImage = `url("${slide.image}")`;
  document.querySelector('#hero-category').textContent = slide.category;
  title.innerHTML = slide.title.map((line, i) => `<span>${line}${i === 2 ? '<span class="period">.</span>' : ''}</span>`).join('');
  document.querySelector('#hero-copy').textContent = slide.copy;
  document.querySelector('#hero-location').textContent = slide.location;
  document.querySelector('#hero-caption').textContent = slide.caption;
  document.querySelector('#hero-link').href = slide.link;
  document.querySelector('.current-slide').textContent = String(index + 1).padStart(2, '0');
  document.querySelector('#slide-progress').style.width = `${((index + 1) / slides.length) * 100}%`;
  document.querySelector('.hero-index').innerHTML = `${String(index + 1).padStart(2, '0')} — 03 <span> / </span> ALWAYS FORWARD`;
}

function changeSlide(direction) {
  if (transitioning) return;
  current = (current + direction + slides.length) % slides.length;
  if (reduceMotion) return renderSlide(current);
  transitioning = true;
  gsap.timeline({ onComplete: () => { transitioning = false; } })
    .to([heroImage, '.hero-content'], { opacity: 0, duration: 0.28, ease: 'power2.in' })
    .add(() => renderSlide(current))
    .fromTo(heroImage, { scale: 1.06, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'power2.out' })
    .fromTo('.hero-content', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'power2.out' }, '-=0.55');
}
document.querySelector('#prev-slide').addEventListener('click', () => changeSlide(-1));
document.querySelector('#next-slide').addEventListener('click', () => changeSlide(1));

const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
function setMenu(open) {
  menuButton.classList.toggle('is-open', open);
  mobileMenu.classList.toggle('is-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  mobileMenu.setAttribute('aria-hidden', String(!open));
  document.body.classList.toggle('menu-open', open);
  if (lenis) open ? lenis.stop() : lenis.start();
}

window.addEventListener('load', () => {
  ScrollTrigger.refresh();
  // Pinning changes the document height, so restore deep links after layout settles.
  const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (target && lenis) lenis.scrollTo(target, { immediate: true, force: true });
});
menuButton.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('is-open')));
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });

if (!reduceMotion) {
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('.header', { y: -30, opacity: 0, duration: 0.7 })
    .from('.hero-title > span', { yPercent: 70, opacity: 0, stagger: 0.1, duration: 0.9 }, '-=0.35')
    .from('.hero-reveal', { y: 18, opacity: 0, stagger: 0.09, duration: 0.65 }, '-=0.7')
    .from('.hero-bottom, .hero-side, .hero-index', { opacity: 0, duration: 0.7 }, '-=0.3');

  gsap.utils.toArray('.reveal').forEach(element => {
    gsap.from(element, { y: 45, opacity: 0, duration: 0.85, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 88%', once: true } });
  });
  gsap.to('.hero-image', { yPercent: 17, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.manifesto-image', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.manifesto', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.can', { y: 90, rotation: -12, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.energy', start: 'top 70%', once: true } });
}
