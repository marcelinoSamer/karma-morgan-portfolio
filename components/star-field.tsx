"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

export type Star = {
  /** Sprite exported from the portfolio, matted on black. */
  src: string;
  /** Tailwind placement + width for this sprite. */
  className: string;
  /** Pixels of vertical travel across the section. Larger reads as nearer. */
  depth: number;
  rotate?: number;
};

/**
 * The airbrushed chrome stars from the printed portfolio, scattered behind the
 * content. Motivation: depth. They drift at different rates as the section
 * passes, which is what makes a flat black page read as layered collage.
 *
 * The sprites are JPEGs with a black matte, so they are composited with
 * `mix-blend-screen`: the black drops out and only the chrome remains.
 */
export function StarField({ stars }: { stars: Star[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {stars.map((star, i) => (
        <Sprite
          key={`${star.src}-${i}`}
          star={star}
          progress={scrollYProgress}
          still={Boolean(reduce)}
        />
      ))}
    </div>
  );
}

function Sprite({
  star,
  progress,
  still,
}: {
  star: Star;
  progress: MotionValue<number>;
  still: boolean;
}) {
  const y = useTransform(progress, [0, 1], [star.depth, -star.depth]);

  return (
    <motion.div
      style={{
        y: still ? 0 : y,
        rotate: star.rotate ?? 0,
      }}
      className={`absolute mix-blend-screen ${star.className}`}
    >
      <Image
        src={star.src}
        alt=""
        width={532}
        height={441}
        sizes="(max-width: 768px) 30vw, 20vw"
        className="matte h-auto w-full select-none"
      />
    </motion.div>
  );
}
