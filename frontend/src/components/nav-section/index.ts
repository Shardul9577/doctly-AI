// ----------------------------------------------------------------------

export * from './type';

export { default as NavSectionVertical } from './vertical';
export { default as NavSectionHorizontal } from './horizontal';

export function isExternalLink(path: string) {
  return path?.includes?.('http') ?? false;
}

export function getActive(
  path: string | undefined,
  pathname: string,
  asPath: string
) {
  // Guard: skip if path is missing or empty
  if (!path) return false;

  const checkPath = path.startsWith('#');

  return (
    (!checkPath && pathname.includes(path)) ||
    (!checkPath && asPath.includes(path))
  );
}
