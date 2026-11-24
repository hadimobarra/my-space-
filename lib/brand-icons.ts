import type { IconType } from "react-icons";
import {
  SiAntdesign, SiApachesuperset, SiCss, SiDocker, SiGit, SiGithubactions, SiHtml5, SiI18Next, SiJavascript, SiJest, SiLinux, SiMui,
  SiNextdotjs, SiNginx, SiReact, SiReactquery, SiRedux, SiReduxsaga, SiSass, SiTailwindcss, SiTypescript, SiVite, SiWebpack,
} from "react-icons/si";

/** Skill name (as written in the dictionaries) → icon and brand colour. Server only. */
export const brandIcons: Record<string, { id: string; icon: IconType; color: string }> = {
  TypeScript: { id: "typescript", icon: SiTypescript, color: "#3178C6" },
  "JavaScript (ES2024)": { id: "javascript", icon: SiJavascript, color: "#CA9F00" },
  HTML5: { id: "html5", icon: SiHtml5, color: "#E34F26" },
  CSS3: { id: "css", icon: SiCss, color: "#8A5CC7" },
  React: { id: "react", icon: SiReact, color: "#149ECA" },
  "Next.js": { id: "nextjs", icon: SiNextdotjs, color: "currentColor" },
  Redux: { id: "redux", icon: SiRedux, color: "#764ABC" },
  "Redux Saga": { id: "redux-saga", icon: SiReduxsaga, color: "#86A93B" },
  "React Query": { id: "react-query", icon: SiReactquery, color: "#FF4154" },
  "Ant Design": { id: "ant-design", icon: SiAntdesign, color: "#0170FE" },
  "Tailwind CSS": { id: "tailwind", icon: SiTailwindcss, color: "#06B6D4" },
  "Material UI": { id: "mui", icon: SiMui, color: "#007FFF" },
  Sass: { id: "sass", icon: SiSass, color: "#CC6699" },
  i18next: { id: "i18next", icon: SiI18Next, color: "#26A69A" },
  "Apache Superset": { id: "superset", icon: SiApachesuperset, color: "#20A6C9" },
  Vite: { id: "vite", icon: SiVite, color: "#646CFF" },
  Webpack: { id: "webpack", icon: SiWebpack, color: "#5299C8" },
  Jest: { id: "jest", icon: SiJest, color: "#C21325" },
  Git: { id: "git", icon: SiGit, color: "#F05032" },
  "GitHub Actions CI": { id: "github-actions", icon: SiGithubactions, color: "#2088FF" },
  Docker: { id: "docker", icon: SiDocker, color: "#2496ED" },
  Nginx: { id: "nginx", icon: SiNginx, color: "#009639" },
  Linux: { id: "linux", icon: SiLinux, color: "currentColor" },
};
