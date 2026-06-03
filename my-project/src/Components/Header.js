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
  `;

  return el;
}