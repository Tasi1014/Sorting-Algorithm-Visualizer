// src/Components/Controls.js
import { toggleMute } from '../utils/audio.js';

export function Controls({ onVisualize, onSpeedChange }) {
  const el = document.createElement("div");
  el.className = "controls-bar";

  el.innerHTML = `
    <div class="input-group">
      <input
        class="controls-input"
        id="numbersInput"
        type="text"
        placeholder="Enter numbers, comma-separated (e.g. 45, 12, 89, 3, 55)..."
        autocomplete="off"
        spellcheck="false"
      />
      <button class="icon-btn" id="randomizeBtn" title="Randomize Array">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
          <polyline points="16 3 21 3 21 8"></polyline>
          <line x1="4" y1="20" x2="21" y2="3"></line>
          <polyline points="21 16 21 21 16 21"></polyline>
          <line x1="15" y1="15" x2="21" y2="21"></line>
          <line x1="4" y1="4" x2="9" y2="9"></line>
        </svg>
      </button>
      <button class="icon-btn" id="soundBtn" title="Toggle Sound">
        <svg id="soundIconOff" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="23" y1="9" x2="17" y2="15"></line>
          <line x1="17" y1="9" x2="23" y2="15"></line>
        </svg>
        <svg id="soundIconOn" style="display:none;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
      </button>
    </div>
    <div class="controls-right">
      <div class="speed-control">
        <label for="sizeSlider" id="sizeLabel" class="speed-label">Size: 15</label>
        <input type="range" id="sizeSlider" class="speed-slider" min="5" max="100" step="1" value="15" />
      </div>
      <div class="speed-control">
        <label for="speedSlider" id="speedLabel" class="speed-label">1.5x</label>
        <input type="range" id="speedSlider" class="speed-slider" min="0.5" max="20" step="0.5" value="1.5" />
      </div>
      <div class="select-wrapper">
        <select class="controls-select" id="algoSelect">
          <option value="bubble">Bubble Sort</option>
          <option value="insertion">Insertion Sort</option>
          <option value="selection">Selection Sort</option>
        </select>
        <svg class="select-arrow" viewBox="0 0 10 6" fill="none">
          <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>
      <button class="controls-btn" id="visualizeBtn">
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <polygon points="5,3 19,12 5,21"/>
        </svg>
        Visualize
      </button>
    </div>
  `;

  const speedSlider = el.querySelector("#speedSlider");
  const speedLabel = el.querySelector("#speedLabel");
  const sizeSlider = el.querySelector("#sizeSlider");
  const sizeLabel = el.querySelector("#sizeLabel");
  const randomizeBtn = el.querySelector("#randomizeBtn");
  const soundBtn = el.querySelector("#soundBtn");
  const soundIconOn = el.querySelector("#soundIconOn");
  const soundIconOff = el.querySelector("#soundIconOff");
  const numbersInput = el.querySelector("#numbersInput");
  const btn = el.querySelector("#visualizeBtn");
  
  soundBtn.addEventListener("click", () => {
    const isMuted = toggleMute();
    if (isMuted) {
      soundIconOff.style.display = "block";
      soundIconOn.style.display = "none";
      soundBtn.style.color = "var(--text-muted)";
    } else {
      soundIconOff.style.display = "none";
      soundIconOn.style.display = "block";
      soundBtn.style.color = "var(--accent)";
    }
  });

  speedSlider.addEventListener("input", (e) => {
    const val = parseFloat(e.target.value).toFixed(1);
    speedLabel.textContent = val + "x";
    if (onSpeedChange) onSpeedChange(parseFloat(val));
  });

  const generateRandomArray = (size) => {
    const arr = [];
    for (let i = 0; i < size; i++) {
      arr.push(Math.floor(Math.random() * 90) + 10); // Random numbers from 10 to 99
    }
    numbersInput.value = arr.join(", ");
    btn.click();
  };

  sizeSlider.addEventListener("input", (e) => {
    const val = e.target.value;
    sizeLabel.textContent = "Size: " + val;
  });

  sizeSlider.addEventListener("change", (e) => {
    generateRandomArray(parseInt(e.target.value));
  });

  randomizeBtn.addEventListener("click", () => {
    generateRandomArray(parseInt(sizeSlider.value));
  });

  btn.addEventListener("click", () => {
    const raw = el.querySelector("#numbersInput").value.trim();
    const algo = el.querySelector("#algoSelect").value;

    if (!raw) return;

    const arr = raw
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((n) => !isNaN(n) && n !== "");

    if (arr.length < 2) {
      alert("Please enter at least 2 valid numbers.");
      return;
    }

    onVisualize(arr, algo);
  });

  return el;
}