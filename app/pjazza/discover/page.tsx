import { getStreams, getLiveBusinessCount } from "@/src/lib/data";
import DiscoverClient from "./DiscoverClient";

export default async function DiscoverPage() {
  const [streams, liveCount] = await Promise.all([getStreams(), getLiveBusinessCount()]);
  return <DiscoverClient initialStreams={streams} liveCount={liveCount} />;
}
