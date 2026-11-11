import test from "node:test";
import assert from "node:assert/strict";
import { publicRedirect } from "../src/lib/crawl.js";
import { pageMetadata } from "../src/lib/seo.js";
import {
  publicPath,
  publicRouteNames,
  publicContentHref,
} from "../src/lib/public-routes.js";
for (const [old, current] of Object.entries(publicRouteNames))
  for (const locale of ["az", "en", "ru", "ky"])
    test(`${locale}: ${old} migrates without losing detail or query`, () => {
      const path = `/${locale}/${old}/sample`;
      assert.equal(
        publicRedirect({
          host: "localhost:3000",
          protocol: "http",
          pathname: path,
          search: "?p=2",
        }),
        `/${locale}/${current}/sample?p=2`
      );
      assert.equal(
        publicRedirect({
          host: "localhost:3000",
          protocol: "http",
          pathname: `/${locale}/${current}/sample`,
        }),
        null
      );
      const meta = pageMetadata({
        host: locale === "ky" ? "www.geototal.kg" : "www.geototal.az",
        locale,
        page: old,
        path: `${old}/sample`,
      });
      assert.ok(
        meta.alternates.canonical.endsWith(`/${locale}/${current}/sample`)
      );
      for (const url of Object.values(meta.alternates.languages))
        assert.ok(url.endsWith(`/${current}/sample`));
    });
test("Nested references migrate; unrelated and API paths stay intact", () => {
  assert.equal(publicPath("aboutus/references"), "haqqimizda/references");
  assert.equal(publicPath("/az/blog/services"), "/az/blog/services");
  assert.equal(publicPath("/api/products"), "/api/products");
});
test("Historical service slugs redirect straight to the current live slugs", () => {
  const aliases = {
    lidar: "dron-xidmetleri",
    calibration: "kalibrasiya",
    photogrammetry: "Fotoqrammetriya-ortofoto-dron-pua",
    "geodesy-and-topography": "geodeziya-topoqrafiya-xidmetleri",
    "control-and-outsourcing": "geodeziya-nezareti-xidmetleri",
  };
  for (const locale of ["az", "en", "ru", "ky"])
    for (const [old, current] of Object.entries(aliases))
      for (const section of ["services", "xidmetler"]) {
        assert.equal(
          publicRedirect({
            host: "localhost:3000",
            protocol: "http",
            pathname: `/${locale}/${section}/${old}`,
          }),
          `/${locale}/xidmetler/${current}`
        );
      }
});

test("CMS links bypass legacy redirects while retaining query and fragment", () => {
  assert.equal(
    publicContentHref("/az/services/lidar?source=blog#details"),
    "/az/xidmetler/dron-xidmetleri?source=blog#details"
  );
  assert.equal(
    publicContentHref("/az/projects/crescent"),
    "/az/layiheler/crescent"
  );
  assert.equal(
    publicContentHref(
      "https://www.geototal.az/en/services/geodesy-and-topography#survey"
    ),
    "https://www.geototal.az/en/xidmetler/geodeziya-topoqrafiya-xidmetleri#survey"
  );
  for (const href of [
    "https://example.com/az/services/lidar",
    "https://geototal.az.example.com/az/services/lidar",
    "mailto:office@geototal.az",
    "tel:+994552053403",
    "#service-inquiry",
    "//example.com/services/lidar",
    "/az/blog/services",
    "/az#service-inquiry",
  ])
    assert.equal(publicContentHref(href), href);
});
