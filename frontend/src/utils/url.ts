import { FRONTEND_URL } from '../config';

/** Absolute app URL for OG tags, external links, and callbacks. */
export function absoluteUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const base = (FRONTEND_URL || '').replace(/\/$/, '');
  if (!base) {
    return normalizedPath;
  }
  return `${base}${normalizedPath}`;
}

/** Client origin: env in SSR, current host in the browser. */
export function getAppOrigin(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return (FRONTEND_URL || '').replace(/\/$/, '');
}
