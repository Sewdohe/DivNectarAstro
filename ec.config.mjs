import { defineEcConfig } from 'astro-expressive-code';

export default defineEcConfig({
  themes: ['catppuccin-latte', 'catppuccin-mocha'],
  defaultProps: {
    wrap: true,
    preserveIndent: true,
    frame: 'terminal', // Enable macOS-style frames with traffic lights
  },
  styleOverrides: {
    borderRadius: '0.5rem',
    borderWidth: '2px',
  },
  themeCssSelector: (theme) => {
    // Use .dark class for Mocha, default (no class) for Latte
    if (theme.name === 'catppuccin-mocha') {
      return '.dark';
    }
    return ':root:not(.dark)';
  },
});
