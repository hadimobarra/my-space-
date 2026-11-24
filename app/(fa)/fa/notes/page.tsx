import { NotesPage, notesMetadata } from "@/components/pages/garden-pages";

export const metadata = notesMetadata("fa");

export default function Page() {
  return <NotesPage locale="fa" />;
}
