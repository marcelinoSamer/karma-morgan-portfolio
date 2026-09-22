"use client";

import Image, { type ImageProps } from "next/image";
import { ArrowsOut } from "@phosphor-icons/react/dist/ssr";
import { galleryFor, useLightbox } from "./lightbox";

type ZoomableImageProps = Omit<ImageProps, "src" | "alt"> & {
  src: string;
  alt: string;
  /** Images sharing a group are walked with the arrows inside the preview. */
  group?: string;
  /**
   * Off where the image already sits inside a link: the image is still
   * registered in the gallery, but a separate <PreviewButton> opens it, so a
   * button is never nested in an anchor.
   */
  clickable?: boolean;
};

/**
 * An image that opens in the full-screen preview. The wrapper carries the
 * gallery data attributes, which is also what <PreviewButton> and the preview
 * arrows read the gallery order from.
 */
export function ZoomableImage({
  src,
  alt,
  group = "page",
  clickable = true,
  className,
  ...rest
}: ZoomableImageProps) {
  const open = useLightbox();

  // `fill` measures against the nearest positioned ancestor, so the wrapper has
  // to take the place of the container it was sitting in.
  const frame = rest.fill ? "absolute inset-0 block" : "block w-full";

  const picture = (
    <Image
      src={src}
      alt={alt}
      draggable={false}
      className={`select-none ${className ?? ""}`}
      {...rest}
    />
  );

  if (!clickable) {
    return (
      <span className={frame} data-lightbox={group} data-src={src} data-alt={alt}>
        {picture}
      </span>
    );
  }

  return (
    <button
      type="button"
      aria-label={`Open full-screen preview: ${alt}`}
      data-lightbox={group}
      data-src={src}
      data-alt={alt}
      onClick={() => {
        const { items, index } = galleryFor(group, src);
        open(items, index);
      }}
      className={`${frame} cursor-zoom-in text-left`}
    >
      {picture}
    </button>
  );
}

/**
 * The expand affordance for covers that are already links. The card keeps
 * navigating to the project; this opens the picture.
 */
export function PreviewButton({
  src,
  group = "page",
  label = "Open full-screen preview",
  className = "",
}: {
  src: string;
  group?: string;
  label?: string;
  className?: string;
}) {
  const open = useLightbox();

  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={() => {
        const { items, index } = galleryFor(group, src);
        open(items, index);
      }}
      className={`inline-flex size-9 items-center justify-center rounded-full border border-line-strong bg-bg/70 text-text opacity-0 backdrop-blur-sm transition duration-200 hover:bg-surface focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100 ${className}`}
    >
      <ArrowsOut size={16} weight="bold" aria-hidden />
    </button>
  );
}
