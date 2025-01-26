/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	important: true,
	theme: {
		extend: {
			typography: ({ theme }) => ({
				catpuccin: {
				  css: {
					'--tw-prose-h1': theme('colors.pink[300]'),
					'--tw-prose-headings': theme('colors.pink[300]'),
					'--tw-prose-links': theme('colors.cyan[300]'),
					'--tw-prose-bold': theme('colors.blue[400]'),
					'--tw-prose-bullets': theme('colors.green[300]'),
					'--tw-prose-hr': theme('colors.pink[300]'),
					'--tw-prose-code': theme('colors.red[300]'),
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
