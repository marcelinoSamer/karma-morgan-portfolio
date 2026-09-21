import { elsewhere, person } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
        <p className="type-label text-muted">
          {person.name} / {person.years}
        </p>
        <nav className="flex flex-wrap gap-6">
          <a
            href="/#work"
            className="text-[13px] font-light text-muted transition-colors duration-200 hover:text-text"
          >
            Work
          </a>
          {elsewhere.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[13px] font-light text-muted transition-colors duration-200 hover:text-text"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
