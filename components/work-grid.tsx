import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { projects } from "@/content/site";
import { Reveal } from "./reveal";
import { StarField } from "./star-field";
import { PreviewButton, ZoomableImage } from "./zoomable-image";

const span = {
  wide: "lg:col-span-7",
  narrow: "lg:col-span-5",
  full: "lg:col-span-12",
} as const;

export function WorkGrid() {
  return (
    <section
      id="work"
      className="relative mx-auto max-w-[1400px] px-4 pb-24 sm:px-6 lg:px-10 lg:pb-32"
    >
      <StarField
        stars={[
          {
            src: "/brand/star-1.jpg",
            className: "right-[-6%] top-[26%] w-[24%] lg:w-[12%]",
            depth: 180,
            rotate: -14,
          },
          {
            src: "/brand/star-2.jpg",
            className: "left-[-5%] top-[62%] hidden w-[11%] lg:block",
            depth: 240,
            rotate: 20,
          },
        ]}
      />

      <div className="grid grid-cols-1 gap-x-8 gap-y-14 lg:grid-cols-12 lg:gap-y-20">
        {projects.map((project, i) => (
          <Reveal
            key={project.slug}
            delay={(i % 2) * 0.08}
            className={span[project.span]}
          >
            {/* The card navigates to the project, so the cover cannot also be
                the preview trigger. The corner button opens the picture. */}
            <div className="group relative">
              <Link href={`/work/${project.slug}`} className="block">
                <div className="relative aspect-16/9 w-full overflow-hidden rounded-card bg-surface">
                  <ZoomableImage
                    clickable={false}
                    group="work"
                    src={project.cover.src}
                    alt={project.cover.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, (max-width: 1400px) 58vw, 800px"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                  />
                </div>

                <div className="mt-5 flex items-start justify-between gap-6">
                  <div>
                    <h3 className="type-display flex items-center gap-2 text-xl sm:text-2xl">
                      {project.title}
                      {project.titleAlt ? (
                        <span
                          lang="ar"
                          dir="rtl"
                          className="font-sans text-lg font-light text-muted"
                        >
                          {project.titleAlt}
                        </span>
                      ) : null}
                      <ArrowUpRight
                        size={20}
                        weight="bold"
                        aria-hidden
                        className="text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-text"
                      />
                    </h3>
                    <p className="mt-2 max-w-[54ch] text-base leading-relaxed font-light text-muted">
                      {project.blurb}
                    </p>
                  </div>
                  <p className="type-label shrink-0 pt-1.5 text-muted">
                    {project.year}
                  </p>
                </div>
              </Link>

              <PreviewButton
                src={project.cover.src}
                group="work"
                label={`Preview ${project.title} full screen`}
                className="absolute top-3 right-3"
              />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
