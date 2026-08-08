import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { Intro } from "@/components/Intro";
import { Accommodation } from "@/components/Accommodation";
import { Activities } from "@/components/Activities";
import { Gallery } from "@/components/Gallery";
import { Pricing } from "@/components/Pricing";
import { Reservation } from "@/components/Reservation";
import { Reviews } from "@/components/Reviews";
import { Contact } from "@/components/Contact";
import { SiteFooter } from "@/components/SiteFooter";
import { BackToTop } from "@/components/BackToTop";

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main id="hlavni-obsah">
        <Hero />
        <Intro />
        <Accommodation />
        <Activities />
        <Gallery />
        <Pricing />
        <Reservation />
        <Reviews />
        <Contact />
      </main>

      <SiteFooter />
      <BackToTop />
    </>
  );
}
