// Web browsers expose duration patterns, not vibration intensity or motor detection.
export function initScrollFeedback() {
  const control = document.querySelector('.scroll-feedback');
  const label = control.querySelector('.feedback-label');
  const flash = document.querySelector('.scroll-feedback-flash');
  const canVibrate = typeof navigator.vibrate === 'function';
  let enabled = true;
  let unlocked = !navigator.userActivation || navigator.userActivation.hasBeenActive;
  let lastPulse = -Infinity;
  let flashTimer;

  function updateControl() {
    control.setAttribute('aria-pressed', String(enabled));
    control.setAttribute('aria-label', enabled ? 'Turn scroll feedback off' : 'Turn scroll feedback on');
    if (!enabled) label.textContent = 'SCROLL FEEDBACK OFF';
    else if (canVibrate && !unlocked) {
      label.textContent = 'TAP TO ENABLE HAPTICS';
      control.setAttribute('aria-label', 'Enable haptics');
    } else label.textContent = canVibrate ? 'HAPTICS ON' : 'VISUAL FEEDBACK ON';
  }

  function pulse() {
    if (!enabled || document.body.classList.contains('menu-open')) return;
    const now = performance.now();
    // Avoid repeatedly interrupting the vibration or running a motor continuously.
    if (now - lastPulse < 280) return;
    lastPulse = now;
    if (navigator.userActivation?.hasBeenActive) unlocked = true;
    if (canVibrate && unlocked) {
      try { navigator.vibrate([100, 25, 100]); } catch { /* Unsupported or blocked by the browser. */ }
    }
    // A visible cue also provides feedback where there is no usable vibration API.
    flash.classList.remove('is-pulsing');
    void flash.offsetWidth;
    flash.classList.add('is-pulsing');
    control.classList.add('is-pulsing');
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => control.classList.remove('is-pulsing'), 230);
    updateControl();
  }

  control.addEventListener('click', () => {
    if (enabled && canVibrate && !unlocked) {
      unlocked = true;
      pulse();
    } else {
      enabled = !enabled;
      if (!enabled && canVibrate) navigator.vibrate(0);
    }
    updateControl();
  });
  window.addEventListener('wheel', pulse, { passive: true });
  window.addEventListener('touchmove', pulse, { passive: true });
  window.addEventListener('keydown', event => {
    const tag = event.target?.tagName;
    if (event.altKey || event.ctrlKey || event.metaKey || event.target?.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(tag)) return;
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) pulse();
  });
  updateControl();
}
