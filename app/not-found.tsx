import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-[1400px] flex-col justify-center px-4 py-24 sm:px-6 lg:px-10">
      <p className="type-label text-muted">404</p>
      <h1 className="type-display mt-4 max-w-[14ch] text-3xl md:text-5xl">
        That page is not in the index.
      </h1>
      <Link
        href="/"
        className="mt-8 inline-flex h-12 w-fit items-center gap-2 rounded-full border border-line-strong px-6 text-sm font-medium text-text transition-colors duration-200 hover:bg-surface active:scale-[0.98]"
      >
        <ArrowLeft size={16} weight="bold" aria-hidden />
        Back to the work
      </Link>
    </main>
  );
}
