// src/Components/Header.js

export function Header() {
  const el = document.createElement("header");
  el.className = "app-header";

  el.innerHTML = `
    <div class="header-left">
      <svg class="header-logo" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2"  y="14" width="4" height="12" rx="1" fill="#7C6FE0"/>
        <rect x="8"  y="9"  width="4" height="17" rx="1" fill="#7C6FE0"/>
        <rect x="14" y="4"  width="4" height="22" rx="1" fill="#7C6FE0"/>
        <rect x="20" y="10" width="4" height="16" rx="1" fill="#7C6FE0"/>
      </svg>
      <span class="header-title">AlgoVisualizer</span>
    </div>
    <div class="team"> 
        Team Graphics Crew
    </div>
    <button class="header-settings" id="themeToggle" title="Toggle Dark Mode">
      <svg id="moonIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
      <svg id="sunIcon" style="display:none;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    </button>
  `;

  const themeToggle = el.querySelector("#themeToggle");
  const moonIcon = el.querySelector("#moonIcon");
  const sunIcon = el.querySelector("#sunIcon");

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    moonIcon.style.display = isDark ? "none" : "block";
    sunIcon.style.display = isDark ? "block" : "none";
  });

  return el;
}