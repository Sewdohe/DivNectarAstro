/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			typography: ({ theme }) => ({
				catpuccin: {
				  css: {
					'--tw-prose-body': theme('colors.pink[800]'),
					'--tw-prose-base': theme('colors.pink[800]'),
					'--tw-prose-h1': theme('colors.pink[800]'),
					'--tw-prose-headings': theme('colors.pink[900]'),
					'--tw-prose-lead': theme('colors.pink[700]'),
					'--tw-prose-links': theme('colors.pink[900]'),
					'--tw-prose-bold': theme('colors.pink[900]'),
					'--tw-prose-counters': theme('colors.pink[600]'),
					'--tw-prose-bullets': theme('colors.pink[400]'),
					'--tw-prose-hr': theme('colors.pink[300]'),
					'--tw-prose-quotes': theme('colors.pink[900]'),
					'--tw-prose-quote-borders': theme('colors.pink[300]'),
					'--tw-prose-captions': theme('colors.pink[700]'),
					'--tw-prose-code': theme('colors.pink[900]'),
					'--tw-prose-pre-code': theme('colors.pink[100]'),
					'--tw-prose-pre-bg': theme('colors.pink[900]'),
					'--tw-prose-th-borders': theme('colors.pink[300]'),
					'--tw-prose-td-borders': theme('colors.pink[200]'),
					'--tw-prose-invert-body': theme('colors.pink[200]'),
					'--tw-prose-invert-headings': theme('colors.white'),
					'--tw-prose-invert-lead': theme('colors.pink[300]'),
					'--tw-prose-invert-links': theme('colors.white'),
					'--tw-prose-invert-bold': theme('colors.white'),
					'--tw-prose-invert-counters': theme('colors.pink[400]'),
					'--tw-prose-invert-bullets': theme('colors.pink[600]'),
					'--tw-prose-invert-hr': theme('colors.pink[700]'),
					'--tw-prose-invert-quotes': theme('colors.pink[100]'),
					'--tw-prose-invert-quote-borders': theme('colors.pink[700]'),
					'--tw-prose-invert-captions': theme('colors.pink[400]'),
					'--tw-prose-invert-code': theme('colors.white'),
					'--tw-prose-invert-pre-code': theme('colors.pink[300]'),
					'--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 50%)',
					'--tw-prose-invert-th-borders': theme('colors.pink[600]'),
					'--tw-prose-invert-td-borders': theme('colors.pink[700]'),
				  },
				},
			  }),
		},
	},
	plugins: [
		require("@catppuccin/tailwindcss")({
			// prefix to use, e.g. `text-pink` becomes `text-ctp-pink`.
			// default is `false`, which means no prefix
			prefix: "ctp",
			// which flavour of colours to use by default, in the `:root`
			defaultFlavour: "mocha",
		  }),
		require('@tailwindcss/typography'),
	  ],
}
