import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { cta, elsewhere, person } from "@/content/site";
import { Reveal } from "./reveal";
import { StarField } from "./star-field";

export function Contact() {
  return (
    <section id="contact" className="relative border-t border-line">
      <StarField
        stars={[
          {
            src: "/brand/star-2.jpg",
            className: "right-[6%] top-[18%] w-[26%] lg:w-[14%]",
            depth: 90,
            rotate: -10,
          },
          {
            src: "/brand/sparkle.jpg",
            className: "right-[30%] bottom-[24%] hidden w-[3.5%] lg:block",
            depth: 50,
          },
        ]}
      />

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-4 py-24 sm:px-6 lg:grid-cols-12 lg:px-10 lg:py-32">
        <Reveal className="lg:col-span-8">
          <h2 className="type-display text-3xl md:text-5xl">{cta.contact}</h2>
          <p className="mt-6 max-w-[44ch] text-lg leading-relaxed font-light text-muted">
            Open to commissions, collaborations and anything that ends up
            printed. Tell me what you are making.
          </p>

          <a
            href={`mailto:${person.email}`}
            className="group mt-10 inline-flex items-center gap-3 text-2xl font-light tracking-tight md:text-4xl"
          >
            {person.email}
            <ArrowUpRight
              size={30}
              weight="bold"
              aria-hidden
              className="text-muted transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-text"
            />
          </a>
        </Reveal>

        <Reveal delay={0.08} className="lg:col-span-3 lg:col-start-10 lg:self-end">
          <ul className="flex flex-col gap-3 border-t border-line pt-5">
            {elsewhere.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="group inline-flex items-center gap-1.5 text-base font-light text-muted transition-colors duration-200 hover:text-text"
                >
                  {link.label}
                  <ArrowUpRight
                    size={14}
                    weight="bold"
                    aria-hidden
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
