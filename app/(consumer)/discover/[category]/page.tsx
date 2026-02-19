/**
 * Category listings — placeholder
 */

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  return (
    <div>
      <h1 className="text-base font-extrabold text-ink capitalize">
        {category.replace(/-/g, " ")}
      </h1>
      <p className="text-xs text-ink-muted mt-1">Coming soon</p>
    </div>
  );
}
