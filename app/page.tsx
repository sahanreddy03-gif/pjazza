import { redirect } from "next/navigation";

/** Root / redirects straight to main PJAZZA app */
export default function RootPage() {
  redirect("/pjazza");
}
