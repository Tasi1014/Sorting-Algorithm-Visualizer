// src/Components/Logic.js
// Renders the Algorithm Logic card (right-most info panel)

export class Logic {
  constructor() {
    this.el = document.createElement("div");
    this.el.className = "info-card logic-card";
    this._render(null);
  }

  update(meta) {
    this._render(meta);
  }

  _render(meta) {
    if (!meta) {
      this.el.innerHTML = `
        <h3>Algorithm Logic</h3>
        <p class="info-empty">Select an algorithm to see its logic.</p>
      `;
      return;
    }

    this.el.innerHTML = `
      <h3>Algorithm Logic</h3>
      <p class="logic-text">${meta.logic}</p>
      <button class="logic-info-btn" title="More info">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
      </button>
    `;
  }
}