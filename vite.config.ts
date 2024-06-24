import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit'
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			includeAssets: ['logo.jpg', 'apple-touch-icon.png', 'images/ball.png'],
			manifest: {
        name: 'Poke Match',
        short_name: 'PokeMatch',
        description: 'Memory Match Game with Pokemons',
        theme_color: '#ffffff',
        icons: []
      }
		})
	]
});
