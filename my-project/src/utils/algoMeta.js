// src/utils/algoMeta.js
// Central registry for algorithm metadata shown in Complexity, Logic, Stats panels

export const ALGO_META = {
  bubble: {
    label: "Bubble Sort",
    timeComplexity: {
      best: "O(n)",
      average: "O(n²)",
      worst: "O(n²)",
    },
    spaceComplexity: {
      auxiliary: "O(1)",
    },
    logic:
      "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. Each pass bubbles the largest unsorted element to its correct position.",
    stable: true,
    inPlace: true,
  },

  insertion: {
    label: "Insertion Sort",
    timeComplexity: {
      best: "O(n)",
      average: "O(n²)",
      worst: "O(n²)",
    },
    spaceComplexity: {
      auxiliary: "O(1)",
    },
    logic:
      "Builds the sorted array one element at a time. Takes each element and inserts it into its correct position among the already-sorted elements to its left.",
    stable: true,
    inPlace: true,
  },

  selection: {
    label: "Selection Sort",
    timeComplexity: {
      best: "O(n²)",
      average: "O(n²)",
      worst: "O(n²)",
    },
    spaceComplexity: {
      auxiliary: "O(1)",
    },
    logic:
      "Divides the array into sorted and unsorted regions. Repeatedly finds the minimum element from the unsorted region and moves it to the end of the sorted region.",
    stable: false,
    inPlace: true,
  },
};