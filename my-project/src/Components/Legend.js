// src/Components/Legend.js

const ITEMS = [
  { color: "#A89FD8", label: "Unsorted"  },
  { color: "#F0A500", label: "Comparing" },
  { color: "#3DBFA8", label: "Swapping"  },
  { color: "#6DBF67", label: "Sorted"    },
  { color: "#E07B4F", label: "Pivot"     },
];

export function Legend() {
  const el = document.createElement("div");
  el.className = "legend";

  el.innerHTML = ITEMS.map(
    ({ color, label }) => `
      <span class="legend-item">
        <span class="legend-dot" style="background:${color}"></span>
        ${label}
      </span>`
  ).join("");

  return el;
}