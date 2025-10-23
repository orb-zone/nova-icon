// Basic web-component for @orb-zone/nova-icon
// This is a placeholder for Phase 1 setup. Full implementation in Phase 2.

class NovaIcon extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <svg class="icon" viewBox="0 0 24 24" style="width: 240px; height: 240px;">
        <!-- Placeholder SVG content -->
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" />
      </svg>
    `;
  }
}

customElements.define('nova-icon', NovaIcon);