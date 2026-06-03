/**
 * HEAP SORT
 * ---------
 * Two phase algorithm:
 *   Phase 1 — Build a max-heap from the array (largest element at root/index 0)
 *   Phase 2 — Repeatedly extract the max (root), place it at the end,
 *             shrink heap size, restore heap property
 *
 * The array itself IS the heap — no extra data structure needed.
 * Index relationships:
 *   parent of i      → Math.floor((i - 1) / 2)
 *   left child of i  → 2i + 1
 *   right child of i → 2i + 2
 *
 * @param {number[]} arr - A COPY of the original array (never pass original)
 * @returns {Object[]} steps - Array of step objects for the canvas to animate
 *
 * Step types used:
 *   { type: "compare",    indices: [i, j] }  → highlight parent vs child comparison
 *   { type: "swap",       indices: [i, j] }  → exchange two bars
 *   { type: "markSorted", index: i }         → paint bar green (final position confirmed)
 *
 * NOTE: uses swap like quick/bubble, not overwrite like merge/insertion
 */

export function heapSort(arr) {
    const steps = [];
    const n = arr.length;
  
    // -------- PHASE 1: Build max-heap --------
    // Start from last non-leaf node and heapify downward
    // Last non-leaf is always at Math.floor(n/2) - 1
    // Leaves don't need heapifying — they have no children
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(arr, n, i, steps);
    }
  
    // -------- PHASE 2: Extract max repeatedly --------
    for (let i = n - 1; i > 0; i--) {
  
      // Root (index 0) is always the current maximum
      // Swap it to its final sorted position at end of unsorted portion
      [arr[0], arr[i]] = [arr[i], arr[0]];
  
      steps.push({
        type: "swap",
        indices: [0, i]
      });
  
      // This element is now in its final position — paint it green
      steps.push({
        type: "markSorted",
        index: i
      });
  
      // Restore heap property for the reduced heap (size is now i)
      heapify(arr, i, 0, steps);
    }
  
    // Last remaining element at index 0 is also sorted
    steps.push({
      type: "markSorted",
      index: 0
    });
  
    return steps;
  }
  
  
  /**
   * HELPER — heapify subtree rooted at index i
   * Ensures the subtree satisfies max-heap property (parent > children)
   * Pushes largest value up to the root of this subtree
   *
   * @param {number[]} arr   - working copy of array
   * @param {number}   n     - current heap size (shrinks during phase 2)
   * @param {number}   i     - root index of subtree to heapify
   * @param {Object[]} steps - shared steps array
   */
  function heapify(arr, n, i, steps) {
  
    let largest = i;              // assume root is largest
    const left  = 2 * i + 1;     // left child index
    const right = 2 * i + 2;     // right child index
  
    // --- Check if left child exists and is larger than current largest ---
    if (left < n) {
  
      steps.push({
        type: "compare",
        indices: [left, largest]
      });
  
      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }
  
    // --- Check if right child exists and is larger than current largest ---
    if (right < n) {
  
      steps.push({
        type: "compare",
        indices: [right, largest]
      });
  
      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }
  
    // --- If largest is not the root, swap and continue heapifying down ---
    if (largest !== i) {
  
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
  
      // Tell canvas to exchange these two bars
      steps.push({
        type: "swap",
        indices: [i, largest]
      });
  
      // Recursively heapify the affected subtree
      // Because swapping might have broken heap property further down
      heapify(arr, n, largest, steps);
    }
  }