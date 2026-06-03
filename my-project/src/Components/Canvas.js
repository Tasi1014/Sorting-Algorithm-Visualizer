// src/Components/Canvas.js
// Renders the sorting bars on a <canvas> with smooth swap animation.
import { playNote } from '../utils/audio.js';

const COLORS = {
  unsorted:  "#A89FD8", // muted purple
  comparing: "#F0A500", // amber
  swapping:  "#3DBFA8", // teal-green
  sorted:    "#6DBF67", // green
  pivot:     "#E07B4F", // orange-red (reserved for future quick/merge)
  text:      "#ffffff",
  bg:        "#f5f3ee",
};

const BAR_RADIUS    = 6;   // px corner radius
const BASE_DURATION = 750; // base ms per swap animation (at 1x speed)
const LABEL_FONT    = "bold 14px 'Segoe UI', sans-serif";

export class Canvas {
  /**
   * @param {HTMLElement} container  – element to append the <canvas> into
   * @param {Function}    onStepChange – called with ({ step, total, swaps, comparisons })
   */
  constructor(container, onStepChange) {
    this.container    = container;
    this.onStepChange = onStepChange;

    this.canvas  = document.createElement("canvas");
    this.ctx     = this.canvas.getContext("2d");
    container.appendChild(this.canvas);

    this._reset();
    this._bindResize();
  }

  // ─── Public API ─────────────────────────────────────────────────────────────

  /** Load a new array + step list. Does NOT auto-play. */
  load(array, steps) {
    this._reset();
    this.array     = [...array];
    this.values    = [...array];   // live copy mutated during animation
    this.steps     = steps;
    this.total     = steps.length;
    this.maxVal    = Math.max(...array, 1); // used for pitch calculations
    this.colorMap  = new Array(array.length).fill("unsorted");
    this._resize();
    this._draw();
  }

  play()  { if (!this.playing) this._tick(); }
  pause() { 
    this.playing = false; 
    cancelAnimationFrame(this._raf); 
    clearTimeout(this._timer);
  }

  setSpeed(multiplier) {
    this.speedMultiplier = multiplier;
  }

  stepForward() {
    if (this.currentStep >= this.total) return;
    this.pause();
    this._applyStep(this.steps[this.currentStep]);
    this.currentStep++;
    this._draw();
    this._notify();
  }

  stepBack() {
    if (this.currentStep <= 0) return;
    this.pause();
    // Rebuild state from scratch up to currentStep - 1
    this._rebuildTo(this.currentStep - 1);
    this._draw();
    this._notify();
  }

  reset() {
    this.pause();
    if (this.array.length) {
      this.values   = [...this.array];
      this.colorMap = new Array(this.array.length).fill("unsorted");
      this.currentStep  = 0;
      this.swaps        = 0;
      this.comparisons  = 0;
      this._draw();
      this._notify();
    }
  }

  destroy() {
    this.pause();
    window.removeEventListener("resize", this._onResize);
    this.canvas.remove();
  }

  // ─── Private ────────────────────────────────────────────────────────────────

  _reset() {
    this.array       = [];
    this.values      = [];
    this.steps       = [];
    this.colorMap    = [];
    this.currentStep = 0;
    this.total       = 0;
    this.playing     = false;
    this.swaps       = 0;
    this.comparisons = 0;
    this._raf        = null;
    this._timer      = null;
    this.speedMultiplier = this.speedMultiplier || 1.5; // default speed
    // Swap animation state
    this._anim       = null;
  }

  _getDuration() {
    if (this.speedMultiplier > 5) return 0;
    return BASE_DURATION / this.speedMultiplier;
  }

  _getStepsPerFrame() {
    if (this.speedMultiplier <= 5) return 1;
    // Map speed 5 -> 20 to 1 -> 150 steps per frame (exponentially for dramatic speed increase)
    const t = (this.speedMultiplier - 5) / 15; // 0 to 1
    return Math.floor(1 + t * t * 149);
  }

  _bindResize() {
    this._onResize = () => { this._resize(); this._draw(); };
    window.addEventListener("resize", this._onResize);
  }

  _resize() {
    const { width, height } = this.container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width  = width  * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width  = width  + "px";
    this.canvas.style.height = height + "px";
    this.ctx.scale(dpr, dpr);
    this._cw = width;
    this._ch = height;
  }

  _getLayout() {
    const { _cw: W, _ch: H, values } = this;
    const n = values.length;
    const padding = 40;
    const maxUsableW = W - padding * 2;
    
    let gap = 8;
    if (n > 20) gap = 4;
    if (n > 50) gap = 2;
    if (n > 80) gap = 1;

    let barW = (maxUsableW - gap * (n - 1)) / n;
    if (barW < 1) barW = 1;

    const maxVal  = Math.max(...values, 1);
    const maxBarH = H - padding * 2 - 30; // leave room for labels
    const startX  = (W - (barW * n + gap * (n - 1))) / 2;

    const showText = barW >= 20;

    return { gap, barW, maxVal, maxBarH, startX, showText, padding };
  }

  // ─── Rendering ──────────────────────────────────────────────────────────────

  _draw(animOffset = null) {
    const { ctx, _cw: W, _ch: H, values, colorMap } = this;
    const n = values.length;
    if (!n) return;

    ctx.clearRect(0, 0, W, H);

    const layout = this._getLayout();
    if (!layout) return;
    const { gap, barW, maxVal, maxBarH, startX, showText, padding } = layout;

    for (let i = 0; i < n; i++) {
      const barH = (values[i] / maxVal) * maxBarH;
      let x      = startX + i * (barW + gap);
      const y    = H - padding - barH;

      // Apply animation offset if this bar is mid-swap
      if (animOffset && (i === animOffset.i || i === animOffset.j)) {
        x += (i === animOffset.i) ? animOffset.dx : -animOffset.dx;
      }

      const color = COLORS[colorMap[i]] || COLORS.unsorted;
      const r = Math.min(BAR_RADIUS, barW / 2);
      this._roundRect(ctx, x, y, barW, barH, r, color);

      // Value label inside bar
      if (showText) {
        ctx.fillStyle = COLORS.text;
        ctx.font      = LABEL_FONT;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(values[i], x + barW / 2, y + Math.min(barH / 2, 18));
      }
    }
  }

  _roundRect(ctx, x, y, w, h, r, fill) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  }

  // ─── Step Application ───────────────────────────────────────────────────────

  _applyStep(step, playSound = true) {
    const cm = this.colorMap;

    // Clear previous compare/swap highlights
    cm.forEach((c, idx) => { 
      if (c === "comparing" || c === "swapping") cm[idx] = "unsorted"; 
    });

    if (step.type === "compare") {
      const [i, j] = step.indices;
      cm[i] = "comparing";
      cm[j] = "comparing";
      this.comparisons++;
      if (playSound) playNote(this.values[i], this.maxVal);
    }

    if (step.type === "swap") {
      const [i, j] = step.indices;
      [this.values[i], this.values[j]] = [this.values[j], this.values[i]];
      cm[i] = "swapping";
      cm[j] = "swapping";
      this.swaps++;
      if (playSound) playNote(this.values[i], this.maxVal);
    }

    if (step.type === "overwrite") {
      const { index, value } = step;
      this.values[index] = value;
      cm[index] = "swapping";
      this.swaps++; // Track it as a write/swap operation
      if (playSound) playNote(value, this.maxVal);
    }

    if (step.type === "markSorted") {
      const { index } = step;
      if (Array.isArray(index)) {
        index.forEach(idx => cm[idx] = "sorted");
      } else {
        cm[index] = "sorted";
      }
    }
  }

  _rebuildTo(targetStep) {
    this.values      = [...this.array];
    this.colorMap    = new Array(this.array.length).fill("unsorted");
    this.swaps       = 0;
    this.comparisons = 0;
    this.currentStep = 0;

    for (let s = 0; s < targetStep; s++) {
      this._applyStep(this.steps[s]);
      this.currentStep++;
    }
  }

  // ─── Animation Loop ─────────────────────────────────────────────────────────

  _tick() {
    if (this.currentStep >= this.total) {
      this.playing = false;
      this._notify();
      return;
    }

    this.playing = true;
    const stepsToProcess = this._getStepsPerFrame();

    // 1x to 5x speed: Standard smooth animated mode
    if (stepsToProcess === 1) {
      const step = this.steps[this.currentStep];
      if (step.type === "swap") {
        playNote(this.values[step.indices[0]], this.maxVal);
        this._animateSwap(step.indices[0], step.indices[1], () => {
          this._applyStep(step, false); // Audio already played
          this.currentStep++;
          this._draw();
          this._notify();
          if (this.playing) {
            this._raf = requestAnimationFrame(() => this._tick());
          }
        });
      } else {
        this._applyStep(step);
        this.currentStep++;
        this._draw();
        this._notify();
        this._timer = setTimeout(() => {
          if (this.playing) {
            this._raf = requestAnimationFrame(() => this._tick());
          }
        }, this._getDuration());
      }
      return;
    }

    // 5x to 20x speed: High-performance batching mode (no artificial delays/animations)
    let processed = 0;
    while (processed < stepsToProcess && this.currentStep < this.total && this.playing) {
      const isLastInBatch = (processed === stepsToProcess - 1) || (this.currentStep === this.total - 1);
      this._applyStep(this.steps[this.currentStep], isLastInBatch);
      this.currentStep++;
      processed++;
    }

    this._draw();
    this._notify();

    if (this.playing && this.currentStep < this.total) {
      this._raf = requestAnimationFrame(() => this._tick());
    } else if (this.currentStep >= this.total) {
      this.playing = false;
    }
  }

  /** Smooth horizontal swap animation */
  _animateSwap(i, j, onDone) {
    const layout = this._getLayout();
    if (!layout) { onDone(); return; }
    const { gap, barW } = layout;
    const totalDx  = (barW + gap) * Math.abs(j - i);

    const start = performance.now();

    const frame = (now) => {
      const t        = Math.min((now - start) / this._getDuration(), 1);
      const eased    = easeInOutCubic(t);
      const dx       = eased * totalDx;

      // Temporarily color as swapping
      const savedI = this.colorMap[i];
      const savedJ = this.colorMap[j];
      this.colorMap[i] = "swapping";
      this.colorMap[j] = "swapping";

      this._draw({ i, j, dx });

      this.colorMap[i] = savedI;
      this.colorMap[j] = savedJ;

      if (t < 1) {
        this._raf = requestAnimationFrame(frame);
      } else {
        onDone();
      }
    };

    this._raf = requestAnimationFrame(frame);
  }

  _notify() {
    this.onStepChange?.({
      step:        this.currentStep,
      total:       this.total,
      swaps:       this.swaps,
      comparisons: this.comparisons,
    });
  }
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}