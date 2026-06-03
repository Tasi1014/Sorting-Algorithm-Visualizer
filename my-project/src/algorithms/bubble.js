/**
 * BUBBLE SORT
 * -----------
 * Repeatedly compares adjacent elements and swaps if out of order.
 * Each full pass moves the largest unsorted element to its correct position.
 *
 * @param {number[]} arr - A COPY of the original array (never pass original)
 * @returns {Object[]} steps - Array of step objects for the canvas to animate
 *
 * Step types used:
 *   { type: "compare",    indices: [i, j] }  → highlight two bars being compared
 *   { type: "swap",       indices: [i, j] }  → exchange two bars
 *   { type: "markSorted", index: i }         → paint bar green (final position confirmed)
 */

export function bubbleSort(arr) {
    const steps = [];
    const n = arr.length;
  
    // --- Outer loop: each pass bubbles the largest remaining element to the end ---
    for (let i = 0; i < n - 1; i++) {
  
      // --- Inner loop: compare adjacent pairs, shrinks by i each pass ---
      for (let j = 0; j < n - i - 1; j++) {
  
        // Always log compare first — canvas highlights these two bars
        steps.push({
          type: "compare",
          indices: [j, j + 1]
        });
  
        // Only swap if left bar is bigger than right bar
        if (arr[j] > arr[j + 1]) {
  
          // Swap in our working copy so future comparisons stay correct
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
  
          // Tell canvas to visually exchange these two bars
          steps.push({
            type: "swap",
            indices: [j, j + 1]
          });
        }
      }
  
      // After each pass, the last unsorted element has reached its final position
      // Tell canvas to paint it green
      steps.push({
        type: "markSorted",
        index: n - 1 - i
      });
    }
  
    // After all passes, index 0 is the only remaining element — it's also sorted
    steps.push({
      type: "markSorted",
      index: 0
    });
  
    return steps;
  }