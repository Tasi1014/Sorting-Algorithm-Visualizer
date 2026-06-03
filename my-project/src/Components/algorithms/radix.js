/**
 * RADIX SORT
 * ----------
 * Non-comparison sorting algorithm.
 * Sorts numbers digit by digit starting from least significant digit (LSD).
 *
 * Step types used:
 *   { type: "overwrite", index: i, value: v } → place value in new position
 */

export function radixSort(arr) {
    const steps = [];
  
    const max = Math.max(...arr);
  
    // exp = 1 → units, 10 → tens, 100 → hundreds...
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      countingSortByDigit(arr, exp, steps);
    }
  
    return steps;
  }

  function countingSortByDigit(arr, exp, steps) {
    const n = arr.length;
    const output = new Array(n);
    const count = new Array(10).fill(0);
  
    // count occurrences
    for (let i = 0; i < n; i++) {
      const digit = Math.floor(arr[i] / exp) % 10;
      count[digit]++;
    }
  
    // prefix sum
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }
  
    // build output (stable sort)
    for (let i = n - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i] / exp) % 10;
      output[--count[digit]] = arr[i];
    }
  
    // copy back + generate steps
    for (let i = 0; i < n; i++) {
      arr[i] = output[i];
  
      steps.push({
        type: "overwrite",
        index: i,
        value: output[i]
      });
    }
  }