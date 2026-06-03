// src/Components/Complexity.js
// Renders Time Complexity and Space Complexity cards from algoMeta

export class Complexity {
  constructor() {
    this.el = document.createElement("div");
    this.el.className = "complexity-wrapper";
    this._render(null);
  }

  update(meta) {
    this._render(meta);
  }

  _render(meta) {
    if (!meta) {
      this.el.innerHTML = `
        <div class="info-card"><h3>Time Complexity</h3><p class="info-empty">Select an algorithm</p></div>
        <div class="info-card"><h3>Space Complexity</h3><p class="info-empty">Select an algorithm</p></div>
      `;
      return;
    }

    const { timeComplexity: tc, spaceComplexity: sc } = meta;

    this.el.innerHTML = `
      <div class="info-card">
        <h3>Time Complexity</h3>
        ${tc.best ? `<div class="info-row"><span>Best Case</span><span class="info-val">${tc.best}</span></div>` : ""}
        ${tc.average ? `<div class="info-row"><span>Average Case</span><span class="info-val">${tc.average}</span></div>` : ""}
        <div class="info-row"><span>Worst Case</span><span class="info-val">${tc.worst}</span></div>
      </div>
      <div class="info-card">
        <h3>Space Complexity</h3>
        <div class="info-row"><span>Auxiliary Space</span><span class="info-val">${sc.auxiliary}</span></div>
        <div class="info-row"><span>In-Place</span><span class="info-val">${meta.inPlace ? "Yes" : "No"}</span></div>
        <div class="info-row"><span>Stable</span><span class="info-val">${meta.stable ? "Yes" : "No"}</span></div>
      </div>
    `;
  }
}