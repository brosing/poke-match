import { writable } from 'svelte/store';

export function localStorageStore<T>(key: string, initialValue: T) {
	if (typeof localStorage === 'undefined') return null

	// Retrieve the current value from LocalStorage
	const storedValue = localStorage.getItem(key);

	// Parse the stored value or use the initial value
	const value = storedValue ? JSON.parse(storedValue) : initialValue;

	// Create a Svelte writable store
	const { subscribe, set, update } = writable(value);

	// Subscribe to changes in the store and update LocalStorage
	subscribe((currentValue: T) => {
		localStorage.setItem(key, JSON.stringify(currentValue));
	});

	return {
		subscribe,
		set,
		update,
		// Clear the value from both the store and LocalStorage
		clear: () => {
			localStorage.removeItem(key);
			set(initialValue);
		}
	};
}
