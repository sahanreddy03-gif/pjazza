import { getStreams, getLiveBusinessCount, getReplays } from "@/src/lib/data";
import DiscoverClient from "./DiscoverClient";

export default async function DiscoverPage() {
  const [streams, liveCount, replays] = await Promise.all([getStreams(), getLiveBusinessCount(), getReplays()]);
  return <DiscoverClient initialStreams={streams} liveCount={liveCount} replays={replays} />;
}
