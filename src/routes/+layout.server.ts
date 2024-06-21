import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => {
  return { colorScheme: locals.colorScheme };
};

// This can be false if you're using a fallback (i.e. SPA mode)
export const prerender = true;