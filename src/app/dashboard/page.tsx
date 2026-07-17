import type { Metadata } from "next";
import { DashboardView } from "./DashboardView";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Your study activity — quizzes created, questions answered, accuracy and time studied — calculated from local data only.",
  alternates: { canonical: "/dashboard" },
};

export default function DashboardPage() {
  return <DashboardView />;
}
