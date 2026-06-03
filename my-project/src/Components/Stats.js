// src/Components/Stats.js
// Bottom bar: swap/comparison counters + playback controls + step indicator

export class Stats {
  /**
   * @param {object} opts
   * @param {Function} opts.onPlay
   * @param {Function} opts.onStepBack
   * @param {Function} opts.onStepForward
   */
  constructor({ onPlay, onStepBack, onStepForward }) {
    this.onPlay        = onPlay;
    this.onStepBack    = onStepBack;
    this.onStepForward = onStepForward;
    this._playing      = false;

    this.el = document.createElement("div");
    this.el.className = "stats-bar";
    this._render();
  }

  _render() {
    this.el.innerHTML = `
      <div class="stats-counters">
        <span class="stats-badge" id="swapsBadge">Swaps: <strong>0</strong></span>
        <span class="stats-badge" id="compsBadge">Comparisons: <strong>0</strong></span>
      </div>

      <div class="stats-controls">
        <button class="ctrl-btn" id="ctrlBack" title="Step back">
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/>
          </svg>
        </button>
        <button class="ctrl-btn ctrl-play" id="ctrlPlay" title="Play / Pause">
          <svg class="icon-play" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <polygon points="5,3 19,12 5,21"/>
          </svg>
          <svg class="icon-pause" viewBox="0 0 24 24" fill="currentColor" width="20" height="20" style="display:none">
            <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
          </svg>
        </button>
        <button class="ctrl-btn" id="ctrlFwd" title="Step forward">
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M6 18l8.5-6L6 6v12zm2.5-6 5.5 3.9V8.1L8.5 12zM16 6h2v12h-2z"/>
          </svg>
        </button>
      </div>

      <div class="stats-step" id="stepInfo">Step 0 / 0</div>
    `;

    this.el.querySelector("#ctrlBack").addEventListener("click",    () => this.onStepBack?.());
    this.el.querySelector("#ctrlFwd").addEventListener("click",     () => this.onStepForward?.());
    this.el.querySelector("#ctrlPlay").addEventListener("click",    () => this.onPlay?.());
  }

  /** Update counters and step info from canvas callback data */
  update({ step, total, swaps, comparisons }) {
    this.el.querySelector("#swapsBadge").innerHTML    = `Swaps: <strong>${swaps}</strong>`;
    this.el.querySelector("#compsBadge").innerHTML    = `Comparisons: <strong>${comparisons}</strong>`;
    this.el.querySelector("#stepInfo").textContent    = `Step ${step} / ${total}`;
  }

  setPlaying(playing) {
    this._playing = playing;
    const playBtn   = this.el.querySelector("#ctrlPlay");
    const iconPlay  = playBtn.querySelector(".icon-play");
    const iconPause = playBtn.querySelector(".icon-pause");
    iconPlay.style.display  = playing ? "none"  : "block";
    iconPause.style.display = playing ? "block" : "none";
  }
}