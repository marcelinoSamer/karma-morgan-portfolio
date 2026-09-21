"use client";

import { useState } from "react";
import Link from "next/link";
import { List, X } from "@phosphor-icons/react/dist/ssr";
import { cta, nav, person } from "@/content/site";

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-10">
        <Link
          href="/"
          className="type-display text-base transition-opacity hover:opacity-70"
        >
          {person.name}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-light text-muted transition-colors duration-200 hover:text-text"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="/#contact"
            className="hidden h-9 items-center whitespace-nowrap rounded-full bg-text px-4 text-sm font-medium text-bg transition-transform duration-200 hover:-translate-y-px active:translate-y-0 active:scale-[0.98] md:inline-flex"
          >
            {cta.contact}
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-9 place-items-center rounded-full border border-line text-text md:hidden"
          >
            {open ? (
              <X size={18} weight="bold" aria-hidden />
            ) : (
              <List size={18} weight="bold" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {/* Below 768px the row collapses into a stacked panel. */}
      {open ? (
        <div id="mobile-nav" className="border-t border-line md:hidden">
          <nav className="mx-auto flex max-w-[1400px] flex-col px-4 py-3 sm:px-6">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-line py-3 text-base font-light text-text"
              >
                {item.label}
              </a>
            ))}
            <a
              href="/#contact"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex h-11 items-center justify-center rounded-full bg-text px-5 text-sm font-medium text-bg"
            >
              {cta.contact}
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
