import type { MetadataRoute } from "next";
import { serviceSlugs } from "@/lib/services-content";
import { industrySlugs } from "@/lib/industries-content";
import { guideSlugs } from "@/lib/resources-content";
import { getSlugs } from "@/lib/get-blog";
import { absoluteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes = [
    "",
    "/nosotros",
    "/servicios",
    "/industrias",
    "/casos-de-exito",
    "/resultados",
    "/colombia",
    "/bogota",
    "/cundinamarca",
    "/laboratorio-ia",
    "/recursos",
    "/blog",
    "/contacto",
    "/agenda-consultoria",
    "/terminos",
    "/privacidad",
  ].map((path) => ({
    url: absoluteUrl(path || "/"),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const serviceRoutes = serviceSlugs.map((slug) => ({
    url: absoluteUrl(`/${slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const industryRoutes = industrySlugs.map((slug) => ({
    url: absoluteUrl(`/industrias/${slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const guideRoutes = guideSlugs.map((slug) => ({
    url: absoluteUrl(`/recursos/${slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const blogSlugs = await getSlugs();
  const blogRoutes = blogSlugs.map((slug) => ({
    url: absoluteUrl(`/blog/${slug}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...industryRoutes,
    ...guideRoutes,
    ...blogRoutes,
  ];
}
