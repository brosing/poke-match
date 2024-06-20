// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		type ColorScheme = 'light' | 'dark' | 'system';
		// interface Error {}
		interface Locals {
			colorScheme: ColorScheme
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
