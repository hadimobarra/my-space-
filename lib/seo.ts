export const siteConfig = {
  name: "Hadi Mobarra",
  title: "Hadi Mobarra | Front-End Engineer · React & TypeScript for Data Platforms",
  description:
    "Front-End Engineer with 4+ years building data-intensive React and TypeScript apps: data catalogs, ETL interfaces and dashboards. Apache Superset contributor. Open to remote roles.",
  url: "https://hadimobarra.github.io",
  ogImage: "https://hadimobarra.github.io/og.jpg",
  author: "Hadi Mobarra",
  links: {
    github: "https://github.com/hadimobarra",
    linkedin: "https://www.linkedin.com/in/hadi-mobarra/",
    email: "hadimobarra@gmail.com",
  },
};

export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Hadi Mobarra",
  givenName: "Hadi",
  familyName: "Mobarra",
  jobTitle: "Front-End Engineer",
  description:
    "Front-End Engineer specializing in React and TypeScript for data platforms. Apache Superset contributor.",
  url: siteConfig.url,
  email: siteConfig.links.email,
  sameAs: [siteConfig.links.github, siteConfig.links.linkedin],
  knowsAbout: [
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Front-End Development",
    "Web Development",
    "Apache Superset",
    "OpenMetadata",
    "Data Visualization",
  ],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Iran University of Science and Technology",
  },
  image: `${siteConfig.url}/images/profile.jpeg`,
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
