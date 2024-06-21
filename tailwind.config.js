/** @type {import('tailwindcss').Config} */
export default {
	// These paths are just examples, customize them to match your project structure
	content: ['./static/**/*.html', './src/**/*.{html,js,ts,svelte}'],
	theme: {
		extend: {
			keyframes: {
				'slide-up-in': {
					'0%': { opacity: 0, transform: 'translateY(100%)' },
					'100%': { opacity: 1, transform: 'translateY(0)' }
				},
				'drop-out': {
					'0%': {
						opacity: '1',
						transform: 'scale(1.2)',
						animationTimingFunction: 'cubic-bezier(0.34, 1.61, 0.7, 1)',
						'border-radius': 80
					},
					'100%': {
						opacity: '0',
						transform: 'scale(0)',
						display: 'none'
					}
				},
				'browse-in': {
					'0%': {
						transform: 'scale(0.8) translateZ(0px)',
						zIndex: '-1',
						opacity: 0
					},
					'10%': {
						transform: 'scale(0.8) translateZ(0px)',
						zIndex: '-1',
						opacity: '0.7'
					},
					'80%': {
						transform: 'scale(1.05) translateZ(0px)',
						zIndex: '1',
						opacity: '1'
					},
					'100%': {
						transform: 'scale(1) translateZ(0px)',
						zIndex: '1',
						opacity: '1'
					}
				},
				'flip-in': {
					'0%': {
						transform: 'rotateY(-180deg)'
					},
					'50%': {
						transform: 'rotateY(-90deg)'
					},
					'100%': {
						transform: 'rotateY(0deg)'
					}
				},
				'flip-out': {
					'0%': {
						transform: 'rotateY(0)'
					},
					'50%': {
						transform: 'rotateY(-90deg)'
					},
					'100%': {
						transform: 'rotateY(-180deg)'
					}
				}
			},
			animation: {
				'slide-up-in': 'slide-up-in .5s ease-in-out forwards',
				'drop-out': 'drop-out 0.5s ease-in 0.25s 1 forwards',
				'browse-in': 'browse-in 0.4s ease-in-out 0.25s 1 forwards',
				'flip-in': 'flip-in 0.5s ease-out 0.25s 1 forwards',
				'flip-out': 'flip-out 0.5s ease-in 0.25s 1 forwards',
			}
		}
	},
	plugins: [],
	darkMode: ['selector', '[data-color-scheme="dark"]']
};
