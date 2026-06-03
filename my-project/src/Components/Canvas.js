// src/Components/Canvas.js
// Renders the sorting bars on a <canvas> with smooth swap animation.

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
const ANIM_DURATION = 220; // ms per swap animation
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
    this.colorMap  = new Array(array.length).fill("unsorted");
    this._resize();
    this._draw();
  }

  play()  { if (!this.playing) this._tick(); }
  pause() { this.playing = false; cancelAnimationFrame(this._raf); }

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
    // Swap animation state
    this._anim       = null;
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

  // ─── Rendering ──────────────────────────────────────────────────────────────

  _draw(animOffset = null) {
    const { ctx, _cw: W, _ch: H, values, colorMap } = this;
    const n = values.length;
    if (!n) return;

    ctx.clearRect(0, 0, W, H);

    const padding    = 40;
    const gap        = 8;
    const totalGap   = gap * (n - 1);
    const barW       = Math.max(28, Math.min(72, (W - padding * 2 - totalGap) / n));
    const maxVal     = Math.max(...values);
    const maxBarH    = H - padding * 2 - 30; // leave room for labels
    const startX     = (W - (barW * n + gap * (n - 1))) / 2;

    for (let i = 0; i < n; i++) {
      const barH = (values[i] / maxVal) * maxBarH;
      let x      = startX + i * (barW + gap);
      const y    = H - padding - barH;

      // Apply animation offset if this bar is mid-swap
      if (animOffset && (i === animOffset.i || i === animOffset.j)) {
        x += (i === animOffset.i) ? animOffset.dx : -animOffset.dx;
      }

      const color = COLORS[colorMap[i]] || COLORS.unsorted;
      this._roundRect(ctx, x, y, barW, barH, BAR_RADIUS, color);

      // Value label inside bar
      ctx.fillStyle = COLORS.text;
      ctx.font      = LABEL_FONT;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(values[i], x + barW / 2, y + Math.min(barH / 2, 18));
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

  _applyStep(step) {
    const cm = this.colorMap;

    if (step.type === "compare") {
      const [i, j] = step.indices;
      // Clear previous compare highlight (but not sorted)
      cm.forEach((c, idx) => { if (c === "comparing") cm[idx] = "unsorted"; });
      cm[i] = "comparing";
      cm[j] = "comparing";
      this.comparisons++;
    }

    if (step.type === "swap") {
      const [i, j] = step.indices;
      [this.values[i], this.values[j]] = [this.values[j], this.values[i]];
      cm[i] = "swapping";
      cm[j] = "swapping";
      this.swaps++;
    }

    if (step.type === "markSorted") {
      const { index } = step;
      cm[index] = "sorted";
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
    const step = this.steps[this.currentStep];

    if (step.type === "swap") {
      this._animateSwap(step.indices[0], step.indices[1], () => {
        this._applyStep(step);
        this.currentStep++;
        this._draw();
        this._notify();
        this._raf = requestAnimationFrame(() => this._tick());
      });
    } else {
      this._applyStep(step);
      this.currentStep++;
      this._draw();
      this._notify();
      // Small delay between non-swap steps so user can see comparisons
      this._raf = setTimeout(() => {
        requestAnimationFrame(() => this._tick());
      }, 80);
    }
  }

  /** Smooth horizontal swap animation */
  _animateSwap(i, j, onDone) {
    const { _cw: W, _ch: H, values } = this;
    const n        = values.length;
    const padding  = 40;
    const gap      = 8;
    const barW     = Math.max(28, Math.min(72, (W - padding * 2 - gap * (n - 1)) / n));
    const totalDx  = (barW + gap) * Math.abs(j - i);

    const start = performance.now();

    const frame = (now) => {
      const t        = Math.min((now - start) / ANIM_DURATION, 1);
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