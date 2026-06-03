console.log("RUN FILE LOADED");
import { bubbleSort } from "./my-project/src/Components/algorithms/bubble.js";
import { selectionSort } from "./my-project/src/Components/algorithms/selection.js";
import { insertionSort } from "./my-project/src/Components/algorithms/insertion.js";
import { mergeSort } from "./my-project/src/Components/algorithms/merge.js";
import { quickSort } from "./my-project/src/Components/algorithms/quick.js";

/**
 * Sample test array
 * IMPORTANT: we pass copies so original is never mutated
 */
const sample = [5, 3, 8, 1, 2];

function printTest(name, steps) {
  console.log("\n====================");
  console.log(name);
  console.log("Total steps:", steps.length);
  console.log("First 10 steps preview:");
  console.log(steps.slice(0, 10));
  console.log("====================\n");
}

// Run all algorithms
function runAll() {
  printTest("BUBBLE SORT", bubbleSort([...sample]));
  printTest("SELECTION SORT", selectionSort([...sample]));
  printTest("INSERTION SORT", insertionSort([...sample]));
  printTest("MERGE SORT", mergeSort([...sample]));
  printTest("QUICK SORT", quickSort([...sample]));
}

runAll();