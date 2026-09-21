import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Hero } from "@/components/hero";
import { IndexList } from "@/components/index-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { WorkGrid } from "@/components/work-grid";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <IndexList />
        <WorkGrid />
        <About />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
