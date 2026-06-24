/**
 * Fuente de datos del blog. Prioridad: backend (R2) → fallback a los MDX
 * estáticos (lib/blog.ts) si no hay BACKEND_URL o el backend no responde.
 * Así el blog se administra desde el panel pero nunca queda sin contenido.
 * Se ejecuta en el servidor; las páginas revalidan cada 60s.
 */
import readingTime from "reading-time";
import {
  getAllPosts as getStaticPosts,
  getPost as getStaticPost,
  getAllPostSlugs as getStaticSlugs,
  type Post,
  type PostMeta,
} from "@/lib/blog";

type RawPost = {
  slug: string;
  title?: string;
  description?: string;
  category?: string;
  author?: string;
  date?: string;
  content?: string;
};

async function fetchRaw(): Promise<RawPost[] | null> {
  const base = process.env.BACKEND_URL;
  if (!base) return null; // sin backend → usa estático

  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/api/blog`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows: unknown = await res.json();
    if (!Array.isArray(rows)) return null;
    return rows as RawPost[];
  } catch (err) {
    console.warn("[get-blog] backend no disponible, uso MDX estático:", err);
    return null;
  }
}

function readingTimeEs(content: string): string {
  return readingTime(content || "").text.replace("min read", "min de lectura");
}

function toMeta(r: RawPost): PostMeta {
  return {
    slug: r.slug,
    title: r.title ?? r.slug,
    description: r.description ?? "",
    date: r.date ?? new Date().toISOString(),
    category: r.category ?? "Tecnología",
    author: r.author ?? "Equipo HISTECH",
    readingTime: readingTimeEs(r.content ?? ""),
  };
}

export async function getPosts(): Promise<PostMeta[]> {
  const raw = await fetchRaw();
  if (!raw) return getStaticPosts();
  return raw
    .map(toMeta)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const raw = await fetchRaw();
  if (!raw) return getStaticPost(slug);
  const r = raw.find((p) => p.slug === slug);
  if (!r) return null;
  return { ...toMeta(r), content: r.content ?? "" };
}

export async function getSlugs(): Promise<string[]> {
  const raw = await fetchRaw();
  if (!raw) return getStaticSlugs();
  return raw.map((p) => p.slug);
}
