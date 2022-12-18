export function appendPath(path, pages) {
  return pages.map((page) => ({ ...page, path: path + page.path }));
}

export function flattenPages(pages) {
  return pages.reduce((flattened, { children, ...page }) => {
    let buffer = [...flattened, page];

    return children ? buffer.concat(...flattenPages(appendPath(page.path, children))) : buffer;
  }, []);
}

export function getLinkProps(pages) {
  const flattenedPages = flattenPages(pages);
  const navLinks = flattenedPages.filter(({ navLink }) => navLink);
  const formatted = navLinks.map(({ path, label = null, icon = null }) => ({
    to: path,
    label,
    Icon: icon,
  }));

  return Object.freeze(formatted);
}

export function getRouteProps(pages) {
  return pages.map(({ label, icon, navLink, children, ...route }) =>
    children ? { ...route, children: getRouteProps(children) } : route
  );
}
