// src/Components/Controls.js

export function Controls({ onVisualize }) {
  const el = document.createElement("div");
  el.className = "controls-bar";

  el.innerHTML = `
    <input
      class="controls-input"
      id="numbersInput"
      type="text"
      placeholder="Enter numbers, comma-separated (e.g. 45, 12, 89, 3, 55)..."
      autocomplete="off"
      spellcheck="false"
    />
    <div class="controls-right">
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

  const btn = el.querySelector("#visualizeBtn");
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