import Link from "next/link";
import { projects } from "@/content/site";
import { Reveal } from "./reveal";
import { WavyBadge } from "./wavy-badge";

/**
 * The printed index, rebuilt: scalloped number, title, dotted leader, year.
 * It is the table of contents for the plates further down the page.
 */
export function IndexList() {
  return (
    <section
      aria-labelledby="index-heading"
      className="mx-auto max-w-[1400px] border-t border-line px-4 py-16 sm:px-6 lg:px-10 lg:py-20"
    >
      <Reveal>
        <h2 id="index-heading" className="type-display text-2xl md:text-3xl">
          Index
        </h2>
      </Reveal>

      <ul className="mt-8 lg:mt-10">
        {projects.map((project, i) => (
          <Reveal key={project.slug} delay={i * 0.05}>
            <li>
              <Link
                href={`/work/${project.slug}`}
                className="group flex items-center gap-4 py-3.5 sm:gap-6"
              >
                <WavyBadge
                  value={project.number}
                  className="size-10 text-chrome transition-transform duration-500 group-hover:rotate-[18deg] group-hover:text-text sm:size-11"
                />
                <span className="type-display text-lg whitespace-nowrap sm:text-2xl">
                  {project.title}
                </span>
                <span className="leader h-4 flex-1" aria-hidden />
                <span className="hidden max-w-[34ch] text-sm font-light text-muted md:block">
                  {project.scope}
                </span>
                <span className="type-label w-12 text-right text-muted transition-colors duration-200 group-hover:text-text">
                  {project.year}
                </span>
              </Link>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
