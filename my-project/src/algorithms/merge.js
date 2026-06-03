/**
 * MERGE SORT
 * ----------
 * Divide and conquer algorithm.
 * Recursively splits array in half, then merges halves back in sorted order.
 * All actual sorting happens during the merge phase, not the split phase.
 *
 * @param {number[]} arr - A COPY of the original array (never pass original)
 * @returns {Object[]} steps - Array of step objects for the canvas to animate
 *
 * Step types used:
 *   { type: "compare",    indices: [i, j] }    → highlight two bars being compared
 *   { type: "overwrite",  index: i, value: v } → place element into correct position
 *   { type: "markSorted", index: i }           → paint bar green (segment fully merged)
 *
 * NOTE: No "swap" steps — merge sort writes elements into position, never exchanges pairs.
 * NOTE: Split phase is purely mathematical — no visual steps needed for splitting.
 */

export function mergeSort(arr) {
    const steps = [];
  
    // Kick off recursive sort on the full array
    // We pass steps array through so every recursive call adds to same list
    mergeSortHelper(arr, 0, arr.length - 1, steps);
  
    return steps;
  }
  
  
  /**
   * HELPER — recursively splits and merges
   * @param {number[]} arr    - working copy of array
   * @param {number}   left   - start index of current segment
   * @param {number}   right  - end index of current segment
   * @param {Object[]} steps  - shared steps array, passed through all recursive calls
   */
  function mergeSortHelper(arr, left, right, steps) {
  
    // Base case: single element is already sorted, nothing to do
    if (left >= right) return;
  
    // Find midpoint — split segment into two halves
    const mid = Math.floor((left + right) / 2);
  
    // Recursively sort left half
    mergeSortHelper(arr, left, mid, steps);
  
    // Recursively sort right half
    mergeSortHelper(arr, mid + 1, right, steps);
  
    // Both halves are now sorted — merge them together
    merge(arr, left, mid, right, steps);
  }
  
  
  /**
   * HELPER — merges two sorted halves back into arr
   * This is where all comparisons and overwrites happen
   * @param {number[]} arr    - working copy of array
   * @param {number}   left   - start of left half
   * @param {number}   mid    - end of left half
   * @param {number}   right  - end of right half
   * @param {Object[]} steps  - shared steps array
   */
  function merge(arr, left, mid, right, steps) {
  
    // Copy both halves into temporary arrays
    // We need originals intact while we write back into arr
    const leftArr  = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
  
    let i = 0;           // pointer for leftArr
    let j = 0;           // pointer for rightArr
    let k = left;        // pointer for position in original arr
  
    // --- Compare elements from both halves, write smaller one into arr ---
    while (i < leftArr.length && j < rightArr.length) {
  
      // Tell canvas to highlight the two bars being compared
      // left + i = actual index in original arr for left element
      // mid + 1 + j = actual index in original arr for right element
      steps.push({
        type: "compare",
        indices: [left + i, mid + 1 + j]
      });
  
      if (leftArr[i] <= rightArr[j]) {
  
        // Left element is smaller — write it into position k
        arr[k] = leftArr[i];
  
        steps.push({
          type: "overwrite",
          index: k,
          value: leftArr[i]
        });
  
        i++;
  
      } else {
  
        // Right element is smaller — write it into position k
        arr[k] = rightArr[j];
  
        steps.push({
          type: "overwrite",
          index: k,
          value: rightArr[j]
        });
  
        j++;
      }
  
      k++;
    }
  
    // --- Dump remaining left elements (already in order) ---
    while (i < leftArr.length) {
      arr[k] = leftArr[i];
  
      steps.push({
        type: "overwrite",
        index: k,
        value: leftArr[i]
      });
  
      i++;
      k++;
    }
  
    // --- Dump remaining right elements (already in order) ---
    while (j < rightArr.length) {
      arr[k] = rightArr[j];
  
      steps.push({
        type: "overwrite",
        index: k,
        value: rightArr[j]
      });
  
      j++;
      k++;
    }
  
    // --- Entire merged segment is now sorted — mark all positions green ---
    for (let x = left; x <= right; x++) {
      steps.push({
        type: "markSorted",
        index: x
      });
    }
  }