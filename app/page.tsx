/**
 * Splash screen — the fork. First screen anyone sees.
 * @see docs/REFERENCE.md section 3 (Screen Flow Map)
 */

import { Badge, Button } from "@/src/components/ui";

export default function SplashPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm flex flex-col items-center text-center animate-fade-in">
        {/* Logo */}
        <h1 className="text-3xl font-extrabold tracking-tight text-pjazza-gold">
          PJAZZA
        </h1>
        <p className="text-sm text-ink-muted mt-2">Trust-as-a-Service</p>

        {/* Stats badges */}
        <div className="flex flex-wrap justify-center gap-2 mt-8">
          <Badge bg="bg-surface-card" color="text-ink" className="border border-line">
            3.8M Tourists
          </Badge>
          <Badge bg="bg-surface-card" color="text-ink" className="border border-line">
            540K Locals
          </Badge>
          <Badge bg="bg-surface-card" color="text-ink" className="border border-line">
            8 Industries
          </Badge>
          <Badge bg="bg-trust" color="text-white">
            €0 to Start
          </Badge>
        </div>

        {/* Fork buttons */}
        <div className="w-full flex flex-col gap-3 mt-10">
          <Button href="/discover" variant="primary" fullWidth>
            I&apos;m Exploring
          </Button>
          <Button href="/business/onboard" variant="ghost" fullWidth>
            I&apos;m a Business
          </Button>
        </div>
      </div>
    </main>
  );
}
