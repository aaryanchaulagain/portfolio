import {
  About,
  Awards,
  Contact,
  Hero,
  Projects,
  Services,
  Skills,
  Trust,
} from "@/components/sections";
import {
  createPageMetadata,
  personJsonLd,
  professionalServiceJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

export const metadata = createPageMetadata({
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            personJsonLd(),
            professionalServiceJsonLd(),
            websiteJsonLd(),
          ]),
        }}
      />
      <Hero />
      <About />
      <Skills />
      <Services limit={6} />
      <Awards />
      <Projects />
      <Trust />
      <Contact />

    </>
  );
}
