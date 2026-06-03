/**
 * QUICK SORT
 * ----------
 * Divide and conquer algorithm.
 * Picks a pivot, partitions array so everything smaller is left of pivot
 * and everything larger is right. Pivot lands in its exact final position.
 * Recursively sorts left and right portions.
 *
 * @param {number[]} arr - A COPY of the original array (never pass original)
 * @returns {Object[]} steps - Array of step objects for the canvas to animate
 *
 * Step types used:
 *   { type: "compare",    indices: [i, j] }  → highlight element being compared to pivot
 *   { type: "swap",       indices: [i, j] }  → exchange two bars
 *   { type: "markSorted", index: i }         → paint pivot bar green (final position confirmed)
 *
 * Pivot strategy: always pick last element of current segment.
 * NOTE: unlike merge sort, quick sort uses swap not overwrite.
 */

export function quickSort(arr) {
    const steps = [];
  
    // Kick off recursive sort on the full array
    quickSortHelper(arr, 0, arr.length - 1, steps);
  
    return steps;
  }
  
  
  /**
   * HELPER — recursively partitions and sorts
   * @param {number[]} arr   - working copy of array
   * @param {number}   left  - start index of current segment
   * @param {number}   right - end index of current segment
   * @param {Object[]} steps - shared steps array, passed through all recursive calls
   */
  function quickSortHelper(arr, left, right, steps) {
  
    // Base case: single element or empty segment, already sorted
    if (left >= right) {
  
      // Still mark it sorted so canvas paints it green
      if (left === right) {
        steps.push({
          type: "markSorted",
          index: left
        });
      }
  
      return;
    }
  
    // Partition the segment and get pivot's final index
    const pivotIndex = partition(arr, left, right, steps);
  
    // Recursively sort everything left of pivot
    quickSortHelper(arr, left, pivotIndex - 1, steps);
  
    // Recursively sort everything right of pivot
    quickSortHelper(arr, pivotIndex + 1, right, steps);
  }
  
  
  /**
   * HELPER — partitions segment around pivot
   * Pivot is always the last element of the segment.
   * After partition, pivot is in its exact final sorted position.
   *
   * @param {number[]} arr   - working copy of array
   * @param {number}   left  - start of segment
   * @param {number}   right - end of segment (pivot is here)
   * @param {Object[]} steps - shared steps array
   * @returns {number} pivotIndex - final position of pivot after partition
   */
  function partition(arr, left, right, steps) {
  
    const pivot = arr[right]; // pivot value — always last element
    let i = left - 1;         // boundary — arr[left..i] are all smaller than pivot
  
    // --- Scan every element except pivot itself ---
    for (let j = left; j < right; j++) {
  
      // Compare current element against pivot
      // Canvas highlights this bar vs pivot bar
      steps.push({
        type: "compare",
        indices: [j, right]
      });
  
      if (arr[j] < pivot) {
  
        // This element belongs on the left side
        // Move boundary forward and bring element across
        i++;
  
        // Swap only if i and j are different positions
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
  
          // Tell canvas to exchange these two bars
          steps.push({
            type: "swap",
            indices: [i, j]
          });
        }
      }
    }
  
    // --- Place pivot in its final correct position ---
    const pivotIndex = i + 1;
  
    if (pivotIndex !== right) {
      [arr[pivotIndex], arr[right]] = [arr[right], arr[pivotIndex]];
  
      // Tell canvas to place pivot bar into its final slot
      steps.push({
        type: "swap",
        indices: [pivotIndex, right]
      });
    }
  
    // Pivot is now confirmed in its exact final position — paint it green
    steps.push({
      type: "markSorted",
      index: pivotIndex
    });
  
    return pivotIndex;
  }