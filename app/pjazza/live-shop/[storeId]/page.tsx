import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getStoreBySlug } from "@/src/lib/data";
import LiveShopSessionClient from "./LiveShopSessionClient";

export async function generateMetadata({ params }: { params: Promise<{ storeId: string }> }): Promise<Metadata> {
  const { storeId } = await params;
  const store = await getStoreBySlug(storeId || "");
  if (!store) return { title: "Store | PJAZZA" };
  return {
    title: `${store.name} — Live Shop`,
    description: `Video call ${store.name} in ${store.location}. Live shopping Malta. See products, buy with escrow.`,
  };
}

export default async function LiveShopStorePage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;
  const store = await getStoreBySlug(storeId || "techhub-malta");
  if (!store) redirect("/pjazza/live-shop");
  return <LiveShopSessionClient store={store} />;
}
