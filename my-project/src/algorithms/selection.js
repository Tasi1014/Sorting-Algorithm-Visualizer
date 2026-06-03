/**
 * SELECTION SORT
 * --------------
 * Each pass scans the unsorted portion to find the minimum element,
 * then swaps it into its correct position at the front.
 *
 * @param {number[]} arr - A COPY of the original array (never pass original)
 * @returns {Object[]} steps - Array of step objects for the canvas to animate
 *
 * Step types used:
 *   { type: "compare",    indices: [i, j] }  → highlight current min vs candidate
 *   { type: "swap",       indices: [i, j] }  → place minimum into correct position
 *   { type: "markSorted", index: i }         → paint bar green (final position confirmed)
 */

export function selectionSort(arr) {
    const steps = [];
    const n = arr.length;
  
    // --- Outer loop: each pass finds the minimum for position i ---
    for (let i = 0; i < n - 1; i++) {
  
      // Assume the first unsorted element is the minimum
      let minIndex = i;
  
      // --- Inner loop: scan the rest to find actual minimum ---
      for (let j = i + 1; j < n; j++) {
  
        // Compare current minimum candidate against next element
        // Canvas highlights these two bars
        steps.push({
          type: "compare",
          indices: [minIndex, j]
        });
  
        // Found a smaller element — update minimum index
        if (arr[j] < arr[minIndex]) {
          minIndex = j;
        }
      }
  
      // Only swap if minimum isn't already in correct position
      if (minIndex !== i) {
  
        // Swap in our working copy so future passes stay correct
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
  
        // Tell canvas to visually exchange these two bars
        steps.push({
          type: "swap",
          indices: [i, minIndex]
        });
      }
  
      // Position i now has its final correct element — paint it green
      steps.push({
        type: "markSorted",
        index: i
      });
    }
  
    // Last remaining element is automatically in correct position
    steps.push({
      type: "markSorted",
      index: n - 1
    });
  
    return steps;
  }