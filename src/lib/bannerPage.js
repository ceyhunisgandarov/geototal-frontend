export function bannerPageKey(page) {
  return ({product: "products", service: "services", "aboutus/references": "references"})[page] || page;
}
