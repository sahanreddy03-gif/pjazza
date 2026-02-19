/**
 * Splash screen — the fork. First screen anyone sees.
 * @see docs/REFERENCE.md section 3 (Screen Flow Map)
 */
import { Badge, Button } from "@/src/components/ui";

export default function SplashPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-8 py-16">
      <div className="w-full max-w-sm flex flex-col items-center text-center animate-fade-in">
        <h1 className="text-4xl font-semibold tracking-tight text-ink">
          PJAZZA
        </h1>
        <p className="text-base text-ink-secondary mt-3 font-medium">
          Trust-as-a-Service
        </p>

        <div className="flex flex-wrap justify-center gap-2 mt-10">
          <Badge bg="bg-white" color="text-ink" className="shadow-card border-0">
            3.8M Tourists
          </Badge>
          <Badge bg="bg-white" color="text-ink" className="shadow-card border-0">
            540K Locals
          </Badge>
          <Badge bg="bg-white" color="text-ink" className="shadow-card border-0">
            8 Industries
          </Badge>
          <Badge bg="bg-trust" color="text-white" className="border-0">
            €0 to Start
          </Badge>
        </div>

        <div className="w-full flex flex-col gap-3 mt-12">
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
