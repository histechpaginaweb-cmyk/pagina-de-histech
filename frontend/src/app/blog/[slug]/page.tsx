import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Section, Container } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Aurora } from "@/components/visuals/aurora";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CtaBanner } from "@/components/sections/cta";
import { buildMetadata, JsonLd, articleJsonLd, webPageJsonLd } from "@/lib/seo";
import { formatDate } from "@/lib/blog";
import { getSlugs, getPostBySlug } from "@/lib/get-blog";
import { mdxComponents } from "@/components/blog/mdx-components";

export async function generateStaticParams() {
  const slugs = await getSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const path = `/blog/${post.slug}`;

  return (
    <>
      <section className="relative isolate overflow-hidden pb-8 pt-32 sm:pt-40">
        <Aurora variant="soft" />
        <Container className="max-w-3xl">
          <Breadcrumbs
            items={[
              { name: "Inicio", path: "/" },
              { name: "Blog", path: "/blog" },
              { name: post.category, path: "/blog" },
            ]}
          />
          <Reveal className="mt-8">
            <span className="eyebrow">{post.category}</span>
            <h1 className="mt-5 text-display-lg text-balance">{post.title}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span>{post.author}</span>
              <span>·</span>
              <span>{formatDate(post.date)}</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5" />
                {post.readingTime}
              </span>
            </div>
          </Reveal>
        </Container>
      </section>

      <Section className="pt-4">
        <Container className="max-w-3xl">
          <article className="prose-histech">
            <MDXRemote source={post.content} components={mdxComponents} />
          </article>

          <div className="mt-14 border-t border-[#E5E7EB] pt-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-brand-cyan"
            >
              <ArrowLeft className="size-4" />
              Volver al blog
            </Link>
          </div>
        </Container>
      </Section>

      <JsonLd
        data={articleJsonLd({
          title: post.title,
          description: post.description,
          path,
          date: post.date,
          author: post.author,
        })}
      />
      <JsonLd
        data={webPageJsonLd({ title: post.title, description: post.description, path })}
      />
      <CtaBanner />
    </>
  );
}
