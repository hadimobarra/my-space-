import { NotesPage, notesMetadata } from "@/components/pages/garden-pages";

export const metadata = notesMetadata("en");

export default function Page() {
  return <NotesPage locale="en" />;
}
