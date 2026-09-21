import Image from "next/image";
import { person } from "@/content/site";
import { Reveal } from "./reveal";

export function About() {
  return (
    <section id="about" className="border-t border-line">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-10 lg:py-28">
        {/* Her own self-portrait doodle, matted on black like the sprites. */}
        <Reveal className="lg:col-span-3">
          <Image
            src={person.mascot.src}
            alt={person.mascot.alt}
            width={person.mascot.width}
            height={person.mascot.height}
            sizes="(max-width: 1024px) 40vw, 20vw"
            className="matte h-auto w-40 sm:w-52 lg:w-full"
          />
        </Reveal>

        <Reveal delay={0.08} className="lg:col-span-8 lg:col-start-5">
          <h2 className="type-display text-2xl md:text-3xl">About</h2>
          {person.about.map((paragraph, i) => (
            <p
              key={paragraph}
              className={`max-w-[58ch] text-lg leading-relaxed font-light md:text-xl ${
                i === 0 ? "mt-6" : "mt-5 text-muted"
              }`}
            >
              {paragraph}
            </p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
