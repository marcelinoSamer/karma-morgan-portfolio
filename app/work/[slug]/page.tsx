import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { StarField } from "@/components/star-field";
import { WavyBadge } from "@/components/wavy-badge";
import { ZoomableImage } from "@/components/zoomable-image";
import { person, projects } from "@/content/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};

  return {
    title: `${project.title} - ${person.name}`,
    description: project.blurb,
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  const next = projects[(index + 1) % projects.length];

  return (
    <>
      <SiteNav />
      <main>
        <article className="relative mx-auto max-w-[1400px] px-4 pt-10 pb-24 sm:px-6 lg:px-10 lg:pb-32">
          <StarField
            stars={[
              {
                src: "/brand/star-1.jpg",
                className: "right-[-4%] top-[4%] w-[24%] lg:w-[12%]",
                depth: 90,
                rotate: 10,
              },
              {
                src: "/brand/star-2.jpg",
                className: "left-[-5%] top-[44%] hidden w-[10%] lg:block",
                depth: 200,
                rotate: -16,
              },
            ]}
          />

          <Link
            href="/#work"
            className="inline-flex items-center gap-1.5 text-sm font-light text-muted transition-colors duration-200 hover:text-text"
          >
            <ArrowLeft size={15} weight="bold" aria-hidden />
            All work
          </Link>

          {/* Scope / Project / Year, set the way the printed portfolio sets it. */}
          <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-4">
            {[
              ["Scope", project.scope],
              ["Project", project.kind],
              ["Year", project.year],
            ].map(([label, value]) => (
              <div key={label} className="flex items-baseline gap-2">
                <dt className="type-label">{label}:</dt>
                <dd className="text-sm font-light text-muted">{value}</dd>
              </div>
            ))}
          </dl>

          <header className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <WavyBadge
              value={project.number}
              className="size-12 text-chrome sm:size-14"
            />
            <h1 className="type-display text-4xl leading-[1] md:text-6xl lg:text-7xl">
              {project.title}
            </h1>
            {project.titleAlt ? (
              <span
                lang="ar"
                dir="rtl"
                className="text-3xl font-light text-muted md:text-5xl"
              >
                {project.titleAlt}
              </span>
            ) : null}
          </header>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7">
              {project.body.map((paragraph, i) => (
                <Reveal key={paragraph} delay={i * 0.06} className={i === 0 ? "" : "mt-6"}>
                  <p className="text-lg leading-relaxed font-light text-muted md:text-xl">
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal className="mt-14">
            <div className="relative aspect-16/9 w-full overflow-hidden rounded-card bg-surface">
              <ZoomableImage
                group="plates"
                src={project.cover.src}
                alt={project.cover.alt}
                fill
                priority
                sizes="(max-width: 1400px) 100vw, 1360px"
                className="object-cover"
              />
            </div>
          </Reveal>

          {/* Plates. Widths alternate so the page does not read as a stack of
              identical blocks. */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:mt-8 lg:grid-cols-12 lg:gap-8">
            {project.plates.map((plate, i) => (
              <Reveal
                key={plate.src}
                className={
                  i % 3 === 0
                    ? "lg:col-span-7"
                    : i % 3 === 1
                      ? "lg:col-span-5"
                      : "lg:col-span-12"
                }
              >
                <div className="relative aspect-16/9 w-full overflow-hidden rounded-card bg-surface">
                  <ZoomableImage
                    group="plates"
                    src={plate.src}
                    alt={plate.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </article>

        <section className="border-t border-line">
          <Link
            href={`/work/${next.slug}`}
            className="group mx-auto flex max-w-[1400px] flex-col gap-2 px-4 py-16 sm:px-6 lg:px-10 lg:py-20"
          >
            <span className="type-label text-muted">Next project</span>
            <span className="type-display flex items-center gap-4 text-3xl md:text-5xl">
              {next.title}
              <ArrowRight
                size={30}
                weight="bold"
                aria-hidden
                className="text-muted transition-transform duration-300 group-hover:translate-x-2 group-hover:text-text"
              />
            </span>
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
