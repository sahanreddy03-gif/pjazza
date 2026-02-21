import type { Metadata } from "next";
import { getStores } from "@/src/lib/data";
import LiveShopClient from "./LiveShopClient";

export const metadata: Metadata = {
  title: "Live Shop — Video Call Stores in Malta",
  description: "Shop any store in Malta live. Video call sales staff, watch streams, browse products in real time. Property, yachts, retail, dining & more.",
};

export default async function LiveShopPage() {
  const stores = await getStores();
  return <LiveShopClient initialStores={stores} />;
}
