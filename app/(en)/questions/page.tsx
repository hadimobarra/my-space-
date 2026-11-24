import { QuestionsPage, questionsMetadata } from "@/components/pages/garden-pages";

export const metadata = questionsMetadata("en");

export default function Page() {
  return <QuestionsPage locale="en" />;
}
