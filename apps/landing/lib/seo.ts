export const siteConfig = {
  name: "Hadi Mobarra",
  title: "Hadi Mobarra | Front-End Developer & Computer Engineer",
  description:
    "Front-End Developer with a Master's Degree in Computer Engineering. Specializing in React, Next.js, and building high-performance web applications.",
  url: "https://hadimobarra.github.io",
  ogImage: "https://hadimobarra.github.io/og.jpg",
  author: "Hadi Mobarra",
  links: {
    github: "https://github.com/hadimobarra",
    linkedin: "https://linkedin.com/in/hadimobarra",
    email: "hadimobarra@gmail.com",
    phone: "+09123456789",
  },
};

export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Hadi Mobarra",
  givenName: "Hadi",
  familyName: "Mobarra",
  jobTitle: "Front-End Developer",
  description:
    "Front-End Developer with a Master's Degree in Computer Engineering. Expert in React, Next.js, TypeScript, and building scalable web applications.",
  url: siteConfig.url,
  email: siteConfig.links.email,
  telephone: siteConfig.links.phone,
  sameAs: [siteConfig.links.github, siteConfig.links.linkedin],
  knowsAbout: [
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Front-End Development",
    "Web Development",
    "Computer Engineering",
  ],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Master's Degree in Computer Engineering",
  },
  image: `${siteConfig.url}/images/profile.jpg`,
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  author: {
    "@type": "Person",
    name: "Hadi Mobarra",
  },
  description: siteConfig.description,
};
