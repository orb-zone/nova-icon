// Shared icon definitions for all examples
// This file registers common icons used across examples

export function registerExampleIcons(NovaIconRegistry) {
  // X / Close icon
  NovaIconRegistry.register('x-icon', 
    '<path d="M10 10 L90 90 M90 10 L10 90" stroke="currentColor" fill="none" stroke-width="4" stroke-linecap="round" />', 
    { viewBox: '0 0 100 100' }
  );
  
  // Checkmark icon
  NovaIconRegistry.register('check-icon',
    '<path d="M20 50 L40 70 L80 20" stroke="currentColor" fill="none" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />',
    { viewBox: '0 0 100 100' }
  );
  
  // Star icon
  NovaIconRegistry.register('star-icon',
    '<path d="M50 10 L65 40 L95 45 L72 65 L78 95 L50 80 L22 95 L28 65 L5 45 L35 40 Z" stroke="currentColor" fill="none" stroke-width="3" />',
    { viewBox: '0 0 100 100' }
  );

  // Heart icon
  NovaIconRegistry.register('heart-icon',
    '<path d="M50 85 C50 85 15 60 15 35 C15 20 25 10 35 10 C42 10 47 15 50 20 C53 15 58 10 65 10 C75 10 85 20 85 35 C85 60 50 85 50 85 Z" stroke="currentColor" fill="none" stroke-width="3" />',
    { viewBox: '0 0 100 100' }
  );

  // Menu / Hamburger icon
  NovaIconRegistry.register('menu-icon',
    '<path d="M10 25 L90 25 M10 50 L90 50 M10 75 L90 75" stroke="currentColor" fill="none" stroke-width="6" stroke-linecap="round" />',
    { viewBox: '0 0 100 100' }
  );

  // Search icon
  NovaIconRegistry.register('search-icon',
    '<circle cx="40" cy="40" r="25" stroke="currentColor" fill="none" stroke-width="5" /><path d="M60 60 L85 85" stroke="currentColor" stroke-width="5" stroke-linecap="round" />',
    { viewBox: '0 0 100 100' }
  );

  // Arrow right icon
  NovaIconRegistry.register('arrow-right',
    '<path d="M20 50 L80 50 M60 30 L80 50 L60 70" stroke="currentColor" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />',
    { viewBox: '0 0 100 100' }
  );

  // Settings / Gear icon
  NovaIconRegistry.register('settings-icon',
    '<circle cx="50" cy="50" r="15" stroke="currentColor" fill="none" stroke-width="4" /><path d="M50 10 L50 25 M50 75 L50 90 M85 35 L75 40 M25 60 L15 65 M85 65 L75 60 M25 40 L15 35 M75 25 L65 35 M35 65 L25 75 M75 75 L65 65 M35 35 L25 25" stroke="currentColor" stroke-width="4" stroke-linecap="round" />',
    { viewBox: '0 0 100 100' }
  );

  // Bell / Notification icon
  NovaIconRegistry.register('bell-icon',
    '<path d="M50 15 L50 20 M30 70 L70 70 M35 70 C35 75 40 85 50 85 C60 85 65 75 65 70 M50 20 C35 20 25 30 25 45 L25 60 C25 65 22 68 20 70 L80 70 C78 68 75 65 75 60 L75 45 C75 30 65 20 50 20 Z" stroke="currentColor" fill="none" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />',
    { viewBox: '0 0 100 100' }
  );

  // Sun icon (for theme toggle)
  NovaIconRegistry.register('sun-icon',
    '<circle cx="50" cy="50" r="20" stroke="currentColor" fill="none" stroke-width="4" /><path d="M50 10 L50 20 M50 80 L50 90 M10 50 L20 50 M80 50 L90 50 M18 18 L25 25 M75 75 L82 82 M82 18 L75 25 M25 75 L18 82" stroke="currentColor" stroke-width="4" stroke-linecap="round" />',
    { viewBox: '0 0 100 100' }
  );

  // Moon icon (for theme toggle)
  NovaIconRegistry.register('moon-icon',
    '<path d="M30 20 C30 45 45 60 70 60 C60 60 50 70 40 70 C25 70 15 60 15 45 C15 30 25 20 40 20 C35 20 30 20 30 20 M30 20 C40 20 50 25 55 35 C60 45 60 55 55 65" stroke="currentColor" fill="none" stroke-width="4" stroke-linecap="round" />',
    { viewBox: '0 0 100 100' }
  );
}

// Shared example page template
export const exampleTemplate = `
  <style>
    body { 
      font-family: system-ui, -apple-system, sans-serif; 
      margin: 0;
      padding: 0;
    }
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      color: #2563eb;
      text-decoration: none;
      font-size: 0.875rem;
    }
    .back-link:hover {
      text-decoration: underline;
    }
    .example-section {
      margin-bottom: 3rem;
    }
    .example-section h2 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: #1f2937;
    }
    .example-section p {
      color: #6b7280;
      margin-bottom: 1rem;
    }
    .code-preview {
      background: #1e293b;
      color: #e2e8f0;
      padding: 1rem;
      border-radius: 0.5rem;
      overflow-x: auto;
      font-family: 'Courier New', monospace;
      font-size: 0.875rem;
      margin-top: 1rem;
    }
    .demo-area {
      background: white;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 2rem;
      margin-bottom: 1rem;
    }
  </style>
`;
