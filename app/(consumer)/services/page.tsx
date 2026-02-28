import Link from "next/link";

export default function ServicesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-base font-extrabold text-ink">Services</h1>
      <p className="text-sm text-ink-muted">Find plumbers, electricians, tutors and more. Browse by category.</p>
      <Link
        href="/discover/services"
        className="inline-flex items-center gap-2 px-5 py-3 rounded-apple bg-live text-white font-semibold text-sm hover:opacity-95"
      >
        Browse Services
      </Link>
    </div>
  );
}
