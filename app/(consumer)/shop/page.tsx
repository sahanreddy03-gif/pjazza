import Link from "next/link";

export default function ShopPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-base font-extrabold text-ink">Shop</h1>
      <p className="text-sm text-ink-muted">Browse products from Malta businesses. Live shopping coming soon.</p>
      <Link
        href="/pjazza/live-shop"
        className="inline-flex items-center gap-2 px-5 py-3 rounded-apple bg-live text-white font-semibold text-sm hover:opacity-95"
      >
        Browse Live Shop
      </Link>
    </div>
  );
}
