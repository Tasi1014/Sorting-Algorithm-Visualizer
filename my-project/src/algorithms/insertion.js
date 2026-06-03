/**
 * INSERTION SORT
 * --------------
 * Builds a sorted portion from left to right.
 * Each element is picked and shifted left until it reaches its correct position.
 * Think of sorting playing cards in your hand.
 *
 * @param {number[]} arr - A COPY of the original array (never pass original)
 * @returns {Object[]} steps - Array of step objects for the canvas to animate
 *
 * Step types used:
 *   { type: "compare",    indices: [i, j] }     → highlight key vs element being checked
 *   { type: "overwrite",  index: i, value: v }  → shift element right OR place key in gap
 *   { type: "markSorted", index: i }            → paint bar green (final position confirmed)
 *
 * NOTE: No "swap" steps here — insertion sort shifts elements, it doesn't exchange pairs.
 */

export function insertionSort(arr) {
    const steps = [];
    const n = arr.length;
  
    // Index 0 is trivially sorted already — start from index 1
    steps.push({
      type: "markSorted",
      index: 0
    });
  
    // --- Outer loop: pick each element as the "key" to be inserted ---
    for (let i = 1; i < n; i++) {
  
      // Save the value being inserted — it will get overwritten during shifts
      const key = arr[i];
      let j = i - 1;
  
      // --- Inner loop: shift elements right until correct gap is found ---
      while (j >= 0) {
  
        // Compare key against the element to its left
        // Canvas highlights these two bars
        steps.push({
          type: "compare",
          indices: [j, j + 1]
        });
  
        if (arr[j] > key) {
  
          // Shift this element one slot to the right to make room
          arr[j + 1] = arr[j];
  
          // Tell canvas to overwrite bar at j+1 with the value from j
          steps.push({
            type: "overwrite",
            index: j + 1,
            value: arr[j]
          });
  
          j--;
  
        } else {
          // Key is already in correct position — stop shifting
          break;
        }
      }
  
      // Place the key into the gap that was created
      arr[j + 1] = key;
  
      // Tell canvas to place the key bar into its correct slot
      steps.push({
        type: "overwrite",
        index: j + 1,
        value: key
      });
  
      // All positions up to i are now in the sorted portion
      const sortedIndices = [];
      for (let k = 0; k <= i; k++) sortedIndices.push(k);
      
      steps.push({
        type: "markSorted",
        index: sortedIndices
      });
    }
  
    return steps;
  }