import { PUBLIC_COOKIE_COLOR_SCHEME } from '$env/static/public';
import type { Handle } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit).Handle} */
export const handle: Handle = async ({ event, resolve }) => {
  const { locals, cookies } = event;
  locals.colorScheme = (cookies.get(PUBLIC_COOKIE_COLOR_SCHEME) as App.ColorScheme) || 'system';

  const response = await resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%cookie-color-scheme%', locals.colorScheme)
  });
  return response;
}
