"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowsIn,
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
  X,
} from "@phosphor-icons/react/dist/ssr";

export type LightboxItem = { src: string; alt: string };

type OpenGallery = (items: LightboxItem[], index: number) => void;

const LightboxContext = createContext<OpenGallery | null>(null);

/** How long the overlay takes to fade out before it is torn down. */
const EXIT_MS = 200;

const MIN_SCALE = 1;
const MAX_SCALE = 5;
/** What a double-click or double-tap jumps to. */
const STEP_SCALE = 2.5;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function useLightbox() {
  const open = useContext(LightboxContext);
  if (!open) {
    throw new Error("useLightbox must be used inside <LightboxProvider>.");
  }
  return open;
}

/**
 * Collects a gallery out of the DOM rather than a registry, so the preview
 * arrows walk the images in the order they are actually rendered on the page.
 * Every previewable image carries `data-lightbox="<group>"` plus its source.
 */
export function galleryFor(group: string, src: string) {
  const items = Array.from(
    document.querySelectorAll<HTMLElement>("[data-lightbox]"),
  )
    .filter((node) => node.dataset.lightbox === group && node.dataset.src)
    .map((node) => ({ src: node.dataset.src!, alt: node.dataset.alt ?? "" }));

  const index = items.findIndex((item) => item.src === src);
  return { items, index: index === -1 ? 0 : index };
}

/**
 * Holds the full-screen preview for the whole site, and installs the
 * save-blocking listeners.
 *
 * Note on "blocking downloads": right-click, drag-to-desktop, long-press save
 * and ⌘S are all turned off, which covers every way a visitor saves an image
 * by hand. Nothing client-side can stop devtools, the network tab or a
 * screenshot — the files are still served over HTTP. This raises the effort,
 * it is not DRM.
 */
export function LightboxProvider({ children }: { children: React.ReactNode }) {
  const [gallery, setGallery] = useState<{
    items: LightboxItem[];
    index: number;
  } | null>(null);
  const [closing, setClosing] = useState(false);
  const exitTimer = useRef<number | null>(null);

  /** False on the server, true once hydrated: the portal needs a document. */
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const open = useCallback<OpenGallery>((items, index) => {
    if (exitTimer.current !== null) {
      clearTimeout(exitTimer.current);
      exitTimer.current = null;
    }
    setClosing(false);
    if (items.length > 0) {
      setGallery({ items, index: clamp(index, 0, items.length - 1) });
    }
  }, []);

  /**
   * The overlay fades out and is then torn down on a timer, rather than on an
   * animation callback: a fade that never reports completion would leave an
   * invisible full-screen layer swallowing every click on the page.
   */
  const close = useCallback(() => {
    setClosing(true);
    exitTimer.current = window.setTimeout(() => {
      setGallery(null);
      setClosing(false);
      exitTimer.current = null;
    }, EXIT_MS);
  }, []);

  useEffect(
    () => () => {
      if (exitTimer.current !== null) clearTimeout(exitTimer.current);
    },
    [],
  );

  useEffect(() => {
    const onImage = (event: Event) => {
      const target = event.target;
      if (
        target instanceof Element &&
        target.closest("img, picture, [data-lightbox], [data-no-save]")
      ) {
        event.preventDefault();
      }
    };

    const onSave = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
      }
    };

    document.addEventListener("contextmenu", onImage);
    document.addEventListener("dragstart", onImage);
    document.addEventListener("keydown", onSave);
    return () => {
      document.removeEventListener("contextmenu", onImage);
      document.removeEventListener("dragstart", onImage);
      document.removeEventListener("keydown", onSave);
    };
  }, []);

  return (
    <LightboxContext.Provider value={open}>
      {children}
      {mounted && gallery
        ? createPortal(
            <Lightbox
              items={gallery.items}
              index={gallery.index}
              closing={closing}
              onIndex={(index) =>
                setGallery((current) =>
                  current ? { ...current, index } : current,
                )
              }
              onClose={close}
            />,
            document.body,
          )
        : null}
    </LightboxContext.Provider>
  );
}

type View = { scale: number; x: number; y: number; smooth: boolean };

const RESET: View = { scale: MIN_SCALE, x: 0, y: 0, smooth: true };

function Lightbox({
  items,
  index,
  closing,
  onIndex,
  onClose,
}: {
  items: LightboxItem[];
  index: number;
  closing: boolean;
  onIndex: (index: number) => void;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const [view, setView] = useState<View>(RESET);
  const [loading, setLoading] = useState(true);

  const item = items[index];
  const many = items.length > 1;

  // Walking to another image starts it over: unzoomed, centred, loading.
  const [shown, setShown] = useState(item?.src);
  if (item && shown !== item.src) {
    setShown(item.src);
    setView(RESET);
    setLoading(true);
  }

  // Pointer maths runs outside render, so it reads the view from a mirror
  // rather than a stale closure.
  const viewRef = useRef(view);
  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  /** Keeps the image inside the stage: pan is only possible while zoomed in. */
  const settle = useCallback((next: View): View => {
    const image = imageRef.current;
    const stage = stageRef.current;
    const scale = clamp(next.scale, MIN_SCALE, MAX_SCALE);
    if (!image || !stage || scale === MIN_SCALE) {
      return { ...RESET, smooth: next.smooth };
    }

    const maxX = Math.max(0, (image.offsetWidth * scale - stage.clientWidth) / 2);
    const maxY = Math.max(
      0,
      (image.offsetHeight * scale - stage.clientHeight) / 2,
    );
    return {
      scale,
      x: clamp(next.x, -maxX, maxX),
      y: clamp(next.y, -maxY, maxY),
      smooth: next.smooth,
    };
  }, []);

  /**
   * Zooms towards a point, so whatever is under the cursor or between two
   * fingers stays put. Without the anchor, zooming walks off the detail you
   * were looking at.
   */
  const zoomTo = useCallback(
    (scale: number, clientX?: number, clientY?: number, smooth = false) => {
      const stage = stageRef.current;
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const anchorX = (clientX ?? centerX) - centerX;
      const anchorY = (clientY ?? centerY) - centerY;

      setView((current) => {
        const target = clamp(scale, MIN_SCALE, MAX_SCALE);
        const ratio = target / current.scale;
        return settle({
          scale: target,
          x: anchorX - (anchorX - current.x) * ratio,
          y: anchorY - (anchorY - current.y) * ratio,
          smooth,
        });
      });
    },
    [settle],
  );

  const go = useCallback(
    (delta: number) => {
      if (items.length < 2) return;
      onIndex((index + delta + items.length) % items.length);
    },
    [index, items.length, onIndex],
  );

  // The neighbours are decoded ahead of time so the arrows feel instant.
  useEffect(() => {
    if (!many) return;
    for (const delta of [1, -1]) {
      const neighbour = items[(index + delta + items.length) % items.length];
      const preload = new window.Image();
      preload.src = neighbour.src;
    }
  }, [index, items, many]);

  // Lock the page behind the overlay without the scrollbar collapsing the layout.
  useEffect(() => {
    const { body, documentElement } = document;
    const gap = window.innerWidth - documentElement.clientWidth;
    const { overflow, paddingRight } = body.style;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    return () => {
      body.style.overflow = overflow;
      body.style.paddingRight = paddingRight;
    };
  }, []);

  // Focus moves into the overlay and returns where it came from on close.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => opener?.focus?.();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Escape":
          event.preventDefault();
          onClose();
          break;
        case "ArrowRight":
          go(1);
          break;
        case "ArrowLeft":
          go(-1);
          break;
        case "+":
        case "=":
          zoomTo(viewRef.current.scale * 1.5, undefined, undefined, true);
          break;
        case "-":
        case "_":
          zoomTo(viewRef.current.scale / 1.5, undefined, undefined, true);
          break;
        case "0":
          setView(RESET);
          break;
        case "Tab": {
          // Minimal focus trap: the overlay is modal, so Tab cycles inside it.
          const focusable = overlayRef.current?.querySelectorAll<HTMLElement>(
            "button:not([disabled])",
          );
          if (!focusable || focusable.length === 0) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          const active = document.activeElement;
          if (event.shiftKey && (active === first || !overlayRef.current?.contains(active))) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && active === last) {
            event.preventDefault();
            first.focus();
          }
          break;
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [go, onClose, zoomTo]);

  // Wheel and trackpad pinch. Bound by hand because React's wheel listener is
  // passive, and a passive listener cannot stop the page from scrolling.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      zoomTo(
        viewRef.current.scale * Math.exp(-event.deltaY * 0.0015),
        event.clientX,
        event.clientY,
      );
    };
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [zoomTo]);

  // Pointer bookkeeping: one pointer pans (or swipes), two pointers pinch.
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ distance: number; scale: number } | null>(null);
  const drag = useRef<{
    x: number;
    y: number;
    originX: number;
    originY: number;
    moved: boolean;
  } | null>(null);

  const spread = () => {
    const [a, b] = Array.from(pointers.current.values());
    return {
      distance: Math.hypot(a.x - b.x, a.y - b.y),
      midX: (a.x + b.x) / 2,
      midY: (a.y + b.y) / 2,
    };
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.current.size === 2) {
      drag.current = null;
      pinch.current = { distance: spread().distance, scale: viewRef.current.scale };
      return;
    }

    drag.current = {
      x: event.clientX,
      y: event.clientY,
      originX: viewRef.current.x,
      originY: viewRef.current.y,
      moved: false,
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.current.size >= 2 && pinch.current) {
      const { distance, midX, midY } = spread();
      if (pinch.current.distance > 0) {
        zoomTo(
          (pinch.current.scale * distance) / pinch.current.distance,
          midX,
          midY,
        );
      }
      return;
    }

    const held = drag.current;
    if (!held) return;
    const dx = event.clientX - held.x;
    const dy = event.clientY - held.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) held.moved = true;
    if (viewRef.current.scale === MIN_SCALE) return;

    setView((current) =>
      settle({ ...current, x: held.originX + dx, y: held.originY + dy, smooth: false }),
    );
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId);
    if (pointers.current.size < 2) pinch.current = null;

    const held = drag.current;
    if (!held || pointers.current.size > 0) return;
    drag.current = null;

    if (held.moved) {
      // At rest, a horizontal swipe walks the gallery.
      const dx = event.clientX - held.x;
      if (viewRef.current.scale === MIN_SCALE && Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
      return;
    }

    // A tap on the matte around the image dismisses; a tap on the image does not,
    // so it cannot swallow the first half of a double-tap zoom.
    const bounds = imageRef.current?.getBoundingClientRect();
    const onImage =
      bounds &&
      event.clientX >= bounds.left &&
      event.clientX <= bounds.right &&
      event.clientY >= bounds.top &&
      event.clientY <= bounds.bottom;
    if (!onImage) onClose();
  };

  const onDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (view.scale > MIN_SCALE) setView(RESET);
    else zoomTo(STEP_SCALE, event.clientX, event.clientY, true);
  };

  if (!item) return null;

  const zoomed = view.scale > MIN_SCALE;

  return (
    <motion.div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={item.alt ? `Preview: ${item.alt}` : "Image preview"}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: closing ? 0 : 1 }}
      transition={{ duration: EXIT_MS / 1000, ease: [0.16, 1, 0.3, 1] }}
      onContextMenu={(event) => event.preventDefault()}
      className={`fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md ${
        closing ? "pointer-events-none" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <p className="type-label text-muted">
          {many ? `${index + 1} / ${items.length}` : "Preview"}
        </p>

        <div className="flex items-center gap-1">
          <Control
            label="Zoom out"
            disabled={view.scale <= MIN_SCALE}
            onClick={() => zoomTo(view.scale / 1.5, undefined, undefined, true)}
          >
            <MagnifyingGlassMinus size={18} weight="bold" aria-hidden />
          </Control>

          <span className="w-14 text-center text-sm font-light tabular-nums text-muted">
            {Math.round(view.scale * 100)}%
          </span>

          <Control
            label="Zoom in"
            disabled={view.scale >= MAX_SCALE}
            onClick={() => zoomTo(view.scale * 1.5, undefined, undefined, true)}
          >
            <MagnifyingGlassPlus size={18} weight="bold" aria-hidden />
          </Control>

          <Control
            label="Reset zoom"
            disabled={!zoomed}
            onClick={() => setView(RESET)}
          >
            <ArrowsIn size={18} weight="bold" aria-hidden />
          </Control>

          <Control ref={closeRef} label="Close preview" onClick={onClose}>
            <X size={18} weight="bold" aria-hidden />
          </Control>
        </div>
      </div>

      <div
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={onDoubleClick}
        className="relative flex flex-1 touch-none items-center justify-center overflow-hidden px-4 select-none sm:px-14"
        style={{ cursor: zoomed ? "grab" : "zoom-in" }}
      >
        {loading ? (
          <span className="type-label absolute text-muted" aria-hidden>
            Loading
          </span>
        ) : null}

        {/* eslint-disable-next-line @next/next/no-img-element -- the preview
            loads the original file so it stays sharp at 5x; the optimizer's
            resized variants soften as soon as you zoom past 100%. */}
        <img
          ref={imageRef}
          src={item.src}
          alt={item.alt}
          draggable={false}
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
          style={{
            transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})`,
            transition:
              view.smooth && !reduce ? "transform 0.22s cubic-bezier(0.16,1,0.3,1)" : "none",
            opacity: loading ? 0 : 1,
          }}
          className="pointer-events-none max-h-full max-w-full object-contain select-none"
        />
      </div>

      {many ? (
        <>
          <Arrow side="left" label="Previous image" onClick={() => go(-1)} />
          <Arrow side="right" label="Next image" onClick={() => go(1)} />
        </>
      ) : null}

      <p className="mx-auto max-w-[70ch] px-4 py-4 text-center text-sm leading-relaxed font-light text-muted sm:px-6">
        {item.alt}
      </p>
    </motion.div>
  );
}

function Control({
  ref,
  label,
  disabled,
  onClick,
  children,
}: {
  ref?: React.Ref<HTMLButtonElement>;
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      ref={ref}
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex size-10 items-center justify-center rounded-full text-text transition-colors duration-200 hover:bg-surface disabled:pointer-events-none disabled:text-muted/40"
    >
      {children}
    </button>
  );
}

function Arrow({
  side,
  label,
  onClick,
}: {
  side: "left" | "right";
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`absolute top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-bg/70 text-text backdrop-blur-sm transition-colors duration-200 hover:bg-surface sm:inline-flex ${
        side === "left" ? "left-3" : "right-3"
      }`}
    >
      {side === "left" ? (
        <ArrowLeft size={18} weight="bold" aria-hidden />
      ) : (
        <ArrowRight size={18} weight="bold" aria-hidden />
      )}
    </button>
  );
}
