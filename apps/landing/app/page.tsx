import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Education } from "@/components/sections/education";
import { Skills } from "@/components/sections/skills";
import { Projects } from "@/components/sections/projects";
import { Experience } from "@/components/sections/experience";
import { BlogPreview } from "@/components/sections/blog-preview";
import { Services } from "@/components/sections/services";
import { OpenSource } from "@/components/sections/open-source";
import { TechStack } from "@/components/sections/tech-stack";
import { Certifications } from "@/components/sections/certifications";
import { CurrentlyLearning } from "@/components/sections/currently-learning";
import { Testimonials } from "@/components/sections/testimonials";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Education />
      <Skills />
      <Projects />
      <Experience />
      <Services />
      <TechStack />
      <BlogPreview />
      <OpenSource />
      <Certifications />
      <CurrentlyLearning />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  );
}
