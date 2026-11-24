// Plain configuration: safe to import from client components.

export const siteConfig = {
  name: "Hadi Mobarra",
  url: "https://hadimobarra.github.io",
  ogImage: "/og.jpg",
  author: "Hadi Mobarra",
  links: {
    github: "https://github.com/hadimobarra",
    linkedin: "https://www.linkedin.com/in/hadi-mobarra/",
    email: "hadimobarra@gmail.com",
    source: "https://github.com/hadimobarra/my-space-",
    /** Calendar link (Cal.com, Calendly…). Without it, the CTA falls back to a pre-filled email. */
    booking: process.env.NEXT_PUBLIC_BOOKING_URL || "",
  },
  /** Working hours in local time. Iran has no daylight saving, so the offset is constant. */
  workingHours: { startHour: 9, endHour: 18, utcOffsetMinutes: 210 },
};
