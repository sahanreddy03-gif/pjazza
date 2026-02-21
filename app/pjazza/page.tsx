import { getStreams, getLiveBusinessCount } from "@/src/lib/data";
import LandingClient from "./LandingClient";

export default async function PJazzLandingPage() {
  const [streams, liveCount] = await Promise.all([getStreams(), getLiveBusinessCount()]);
  return <LandingClient initialStreams={streams} liveCount={liveCount} />;
}
