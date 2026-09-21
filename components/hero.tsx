"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { cta, person } from "@/content/site";
import { StarField } from "./star-field";

export function Hero() {
  const reduce = useReducedMotion();

  // Motivation: hierarchy. Headline, then the line that qualifies it, then the
  // two actions, read in that order once on arrival.
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section
      id="top"
      className="relative mx-auto flex min-h-[calc(100dvh-4rem)] max-w-[1400px] items-center px-4 pt-10 pb-16 sm:px-6 lg:px-10 lg:pt-16"
    >
      <StarField
        stars={[
          {
            src: "/brand/star-2.jpg",
            className: "left-[-4%] top-[14%] w-[26%] sm:w-[18%] lg:w-[13%]",
            depth: 70,
            rotate: -8,
          },
          {
            src: "/brand/star-1.jpg",
            className: "right-[2%] bottom-[6%] w-[28%] sm:w-[20%] lg:w-[14%]",
            depth: 120,
            rotate: 12,
          },
          {
            src: "/brand/sparkle.jpg",
            className: "left-[46%] top-[6%] hidden w-[4%] lg:block",
            depth: 40,
          },
        ]}
      />

      <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6">
          <motion.h1
            {...rise(0)}
            className="type-display max-w-[15ch] text-[2.75rem] leading-[0.94] text-balance sm:text-6xl lg:text-[4.25rem]"
          >
            Graphic design, drawn by hand.
          </motion.h1>

          <motion.p
            {...rise(0.1)}
            className="mt-7 max-w-[42ch] text-lg leading-relaxed font-light text-muted md:text-xl"
          >
            {person.intro}
          </motion.p>

          <motion.div {...rise(0.2)} className="mt-9 flex flex-wrap gap-3">
            <a
              href="#work"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-text px-6 text-sm font-medium whitespace-nowrap text-bg transition-transform duration-200 hover:-translate-y-px active:translate-y-0 active:scale-[0.98]"
            >
              {cta.work}
              <ArrowDown size={16} weight="bold" aria-hidden />
            </a>
            <a
              href="#contact"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-line-strong px-6 text-sm font-medium whitespace-nowrap text-text transition-colors duration-200 hover:bg-surface active:scale-[0.98]"
            >
              {cta.contact}
              <ArrowUpRight size={16} weight="bold" aria-hidden />
            </a>
          </motion.div>
        </div>

        {/* Her own cover lettering. The black matte is the page, so the drawing
            sits on the background with no visible frame. */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6"
        >
          <Image
            src={person.lettering.src}
            alt={person.lettering.alt}
            width={person.lettering.width}
            height={person.lettering.height}
            priority
            sizes="(max-width: 1024px) 92vw, 46vw"
            className="matte h-auto w-full"
          />
        </motion.div>
      </div>
    </section>
  );
}
