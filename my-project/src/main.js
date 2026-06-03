// src/main.js
// Entry point — mounts all components and wires interactivity

import { Header }     from "./Components/Header.js";
import { Controls }   from "./Components/Controls.js";
import { Canvas }     from "./Components/Canvas.js";
import { Legend }     from "./Components/Legend.js";
import { Stats }      from "./Components/Stats.js";
import { Complexity } from "./Components/Complexity.js";
import { Logic }      from "./Components/Logic.js";

import { bubbleSort }    from "./algorithms/bubble.js";
import { insertionSort } from "./algorithms/insertion.js";
import { selectionSort } from "./algorithms/selection.js";
import { ALGO_META }     from "./utils/algoMeta.js";
import "./style.css"

// ─── Algorithm registry ─────────────────────────────────────────────────────

const ALGOS = {
  bubble:    bubbleSort,
  insertion: insertionSort,
  selection: selectionSort,
};

// ─── App state ───────────────────────────────────────────────────────────────

let canvas = null;   // Canvas instance
let isPlaying = false;

// ─── Mount shell ─────────────────────────────────────────────────────────────

const app = document.getElementById("app");

// 1. Header
app.appendChild(Header());

// 2. Controls bar
const controls = Controls({
  onVisualize(arr, algoKey) {
    loadVisualization(arr, algoKey);
  },
});
app.appendChild(controls);

// 3. Canvas wrapper
const canvasWrapper = document.createElement("div");
canvasWrapper.className = "canvas-wrapper";
app.appendChild(canvasWrapper);

// 4. Legend
app.appendChild(Legend());

// 5. Stats / playback bar
const stats = new Stats({
  onPlay() {
    if (!canvas) return;
    if (isPlaying) {
      canvas.pause();
      isPlaying = false;
      stats.setPlaying(false);
    } else {
      canvas.play();
      isPlaying = true;
      stats.setPlaying(true);
    }
  },
  onStepBack() {
    isPlaying = false;
    stats.setPlaying(false);
    canvas?.stepBack();
  },
  onStepForward() {
    isPlaying = false;
    stats.setPlaying(false);
    canvas?.stepForward();
  },
});
app.appendChild(stats.el);

// 6. Bottom info row
const infoRow = document.createElement("div");
infoRow.className = "info-row-wrapper";

const complexity = new Complexity();
const logic      = new Logic();

infoRow.appendChild(complexity.el);
infoRow.appendChild(logic.el);
app.appendChild(infoRow);

// ─── Core: load a new visualization ─────────────────────────────────────────

function loadVisualization(arr, algoKey) {
  // Tear down previous canvas
  if (canvas) {
    canvas.destroy();
    canvas = null;
  }

  isPlaying = false;
  stats.setPlaying(false);

  // Build steps
  const sortFn = ALGOS[algoKey];
  if (!sortFn) { console.error("Unknown algorithm:", algoKey); return; }

  const steps = sortFn([...arr]);

  // Update info panels
  const meta = ALGO_META[algoKey];
  complexity.update(meta);
  logic.update(meta);

  // Create canvas
  canvas = new Canvas(canvasWrapper, (data) => {
    stats.update(data);
    // Auto-mark paused when animation finishes
    if (data.step >= data.total && isPlaying) {
      isPlaying = false;
      stats.setPlaying(false);
    }
  });

  canvas.load(arr, steps);
  stats.update({ step: 0, total: steps.length, swaps: 0, comparisons: 0 });
}

// ─── Seed a demo on load ─────────────────────────────────────────────────────
// Pre-fill the input with example numbers so users see something immediately
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("numbersInput");
  if (input) input.value = "45, 12, 89, 3, 55, 21, 2, 33";

  // Update info panels to default algo
  const meta = ALGO_META["bubble"];
  complexity.update(meta);
  logic.update(meta);

  // Sync info panels when dropdown changes without clicking Visualize
  const select = document.getElementById("algoSelect");
  if (select) {
    select.addEventListener("change", () => {
      const m = ALGO_META[select.value];
      if (m) { complexity.update(m); logic.update(m); }
    });
  }
});