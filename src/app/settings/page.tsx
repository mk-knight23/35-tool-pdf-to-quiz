import type { Metadata } from "next";
import { SettingsView } from "./SettingsView";

export const metadata: Metadata = {
  title: "Settings",
  description:
    "Export, import or clear your local data, control history and analytics consent, and set your theme. Everything stays on this device.",
  alternates: { canonical: "/settings" },
};

export default function SettingsPage() {
  return <SettingsView />;
}
