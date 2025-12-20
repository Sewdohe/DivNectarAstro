/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	important: true,
	darkMode: 'class',
	theme: {
		extend: {
			fontFamily: {
				sans: [
					'ui-sans-serif',
					'system-ui',
					'-apple-system',
					'BlinkMacSystemFont',
					'"Segoe UI"',
					'Roboto',
					'"Helvetica Neue"',
					'Arial',
					'sans-serif',
				],
				serif: [
					'ui-serif',
					'Georgia',
					'Cambria',
					'"Times New Roman"',
					'Times',
					'serif',
				],
				mono: [
					'ui-monospace',
					'SFMono-Regular',
					'"SF Mono"',
					'Menlo',
					'Monaco',
					'Consolas',
					'"Liberation Mono"',
					'"Courier New"',
					'monospace',
				],
			},
			fontSize: {
				'blog-base': ['18px', { lineHeight: '1.75', letterSpacing: '-0.011em' }],
				'blog-lg': ['20px', { lineHeight: '1.7', letterSpacing: '-0.014em' }],
			},
			maxWidth: {
				'prose': '68ch', // Optimal line length for reading
			},
			colors: {
				'ctp-rosewater': 'var(--ctp-rosewater)',
				'ctp-flamingo': 'var(--ctp-flamingo)',
				'ctp-pink': 'var(--ctp-pink)',
				'ctp-mauve': 'var(--ctp-mauve)',
				'ctp-red': 'var(--ctp-red)',
				'ctp-maroon': 'var(--ctp-maroon)',
				'ctp-peach': 'var(--ctp-peach)',
				'ctp-yellow': 'var(--ctp-yellow)',
				'ctp-green': 'var(--ctp-green)',
				'ctp-teal': 'var(--ctp-teal)',
				'ctp-sky': 'var(--ctp-sky)',
				'ctp-sapphire': 'var(--ctp-sapphire)',
				'ctp-blue': 'var(--ctp-blue)',
				'ctp-lavender': 'var(--ctp-lavender)',
				'ctp-text': 'var(--ctp-text)',
				'ctp-subtext1': 'var(--ctp-subtext1)',
				'ctp-subtext0': 'var(--ctp-subtext0)',
				'ctp-overlay2': 'var(--ctp-overlay2)',
				'ctp-overlay1': 'var(--ctp-overlay1)',
				'ctp-overlay0': 'var(--ctp-overlay0)',
				'ctp-surface2': 'var(--ctp-surface2)',
				'ctp-surface1': 'var(--ctp-surface1)',
				'ctp-surface0': 'var(--ctp-surface0)',
				'ctp-base': 'var(--ctp-base)',
				'ctp-mantle': 'var(--ctp-mantle)',
				'ctp-crust': 'var(--ctp-crust)',
			},
			typography: ({ theme }) => ({
				catpuccin: {
				  css: {
					// Optimized base font settings
					fontSize: '18px',
					lineHeight: '1.75',
					letterSpacing: '-0.011em',

					// Paragraph spacing
					p: {
					  marginTop: '1.5em',
					  marginBottom: '1.5em',
					  fontSize: '18px',
					  lineHeight: '1.75',
					},

					// First paragraph tighter to heading
					'h1 + p, h2 + p, h3 + p, h4 + p': {
					  marginTop: '0.75em',
					},

					// Heading scale with proper spacing
					h1: {
					  fontSize: '2.25em',
					  lineHeight: '1.15',
					  fontWeight: '800',
					  marginTop: '0',
					  marginBottom: '0.75em',
					  letterSpacing: '-0.025em',
					},
					h2: {
					  fontSize: '1.875em',
					  lineHeight: '1.25',
					  fontWeight: '700',
					  marginTop: '2em',
					  marginBottom: '0.75em',
					  letterSpacing: '-0.022em',
					},
					h3: {
					  fontSize: '1.5em',
					  lineHeight: '1.35',
					  fontWeight: '600',
					  marginTop: '1.75em',
					  marginBottom: '0.5em',
					  letterSpacing: '-0.019em',
					},
					h4: {
					  fontSize: '1.25em',
					  lineHeight: '1.45',
					  fontWeight: '600',
					  marginTop: '1.5em',
					  marginBottom: '0.5em',
					},

					// Links
					a: {
					  fontWeight: '500',
					  textDecoration: 'underline',
					  textDecorationColor: 'var(--ctp-sky)',
					  textDecorationThickness: '2px',
					  textUnderlineOffset: '3px',
					  transition: 'all 0.2s ease',
					  '&:hover': {
						textDecorationColor: 'var(--ctp-pink)',
						color: 'var(--ctp-pink)',
					  },
					},

					// Lists
					ul: {
					  marginTop: '1.25em',
					  marginBottom: '1.25em',
					  paddingLeft: '1.5em',
					},
					ol: {
					  marginTop: '1.25em',
					  marginBottom: '1.25em',
					  paddingLeft: '1.5em',
					},
					li: {
					  marginTop: '0.5em',
					  marginBottom: '0.5em',
					  paddingLeft: '0.375em',
					},

					// Blockquotes
					blockquote: {
					  fontStyle: 'italic',
					  fontSize: '1.1em',
					  lineHeight: '1.65',
					  paddingLeft: '1.5em',
					  borderLeftWidth: '4px',
					  marginTop: '1.75em',
					  marginBottom: '1.75em',
					  fontWeight: '400',
					},

					// Inline code
					'code:not(pre code)': {
					  fontSize: '0.9em',
					  fontWeight: '600',
					  padding: '0.2em 0.4em',
					  borderRadius: '0.25em',
					  backgroundColor: 'var(--ctp-surface0)',
					},

					// Keyboard keys
					kbd: {
					  fontSize: '0.875em',
					  fontWeight: '600',
					  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
					  color: 'var(--ctp-text)',
					  backgroundColor: 'var(--ctp-surface0)',
					  padding: '0.125em 0.375em',
					  borderRadius: '0.375em',
					  border: '1px solid var(--ctp-surface2)',
					  boxShadow: '0 2px 0 var(--ctp-surface2), 0 3px 1px rgba(0, 0, 0, 0.15)',
					  whiteSpace: 'nowrap',
					  display: 'inline-block',
					  lineHeight: '1.5',
					},

					// Code blocks
					pre: {
					  maxWidth: '100%',
					  overflowX: 'auto',
					  borderRadius: '0.5rem',
					  padding: '1em',
					  marginTop: '1.75em',
					  marginBottom: '1.75em',
                      whiteSpace: 'pre-wrap', // Allow wrapping for long lines
                      wordBreak: 'break-word', // Break long words if necessary
					},
					'pre code': {
					  fontSize: '0.875em',
					  lineHeight: '1.7',
                      display: 'block', // Ensure code takes full width of pre
                      maxWidth: '100%', // Explicitly limit width
					},

					// Images
					img: {
					  marginTop: '2em',
					  marginBottom: '2em',
					  borderRadius: '0.5rem',
					},

					// Horizontal rules
					hr: {
					  marginTop: '3em',
					  marginBottom: '3em',
					  borderColor: 'var(--ctp-surface2)',
					  borderTopWidth: '1px',
					},

					// Strong/bold
					strong: {
					  fontWeight: '700',
					},

					// Color variables
					'--tw-prose-body': 'var(--ctp-text)',
					'--tw-prose-headings': 'var(--ctp-pink)',
					'--tw-prose-lead': 'var(--ctp-subtext0)',
					'--tw-prose-links': 'var(--ctp-sky)',
					'--tw-prose-bold': 'var(--ctp-mauve)',
					'--tw-prose-counters': 'var(--ctp-subtext1)',
					'--tw-prose-bullets': 'var(--ctp-green)',
					'--tw-prose-hr': 'var(--ctp-surface2)',
					'--tw-prose-quotes': 'var(--ctp-text)',
					'--tw-prose-quote-borders': 'var(--ctp-pink)',
					'--tw-prose-captions': 'var(--ctp-subtext0)',
					'--tw-prose-code': 'var(--ctp-red)',
					'--tw-prose-pre-code': 'var(--ctp-text)',
					'--tw-prose-pre-bg': 'var(--ctp-mantle)',
					'--tw-prose-th-borders': 'var(--ctp-surface2)',
					'--tw-prose-td-borders': 'var(--ctp-surface1)',
				  },
				},
			  }),
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
	  ],
}
