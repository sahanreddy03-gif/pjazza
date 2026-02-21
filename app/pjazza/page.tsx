import { getStreams, getLiveBusinessCount, getBusinessCount } from "@/src/lib/data";
import LandingClient from "./LandingClient";

export default async function PJazzLandingPage() {
  const [streams, liveCount, businessCount] = await Promise.all([
    getStreams(),
    getLiveBusinessCount(),
    getBusinessCount(),
  ]);
  return <LandingClient initialStreams={streams} liveCount={liveCount} businessCount={businessCount} />;
}
