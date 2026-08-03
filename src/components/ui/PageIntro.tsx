import Container from "@/components/ui/Container";

type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
};

export default function PageIntro({ eyebrow, title, description, children }: PageIntroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border py-10 sm:py-14 lg:py-16">
      {/* Spotlight Effect (Option A) */}
      <div aria-hidden="true" className="pointer-events-none absolute right-0 top-1/2 -z-10 h-[30rem] w-[40rem] -translate-y-1/2 translate-x-1/3 rounded-[100%] bg-accent/15 blur-[100px]" />
      
      <Container>
        <p className="system-label">{"// "}{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-balance font-display text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-pretty text-base leading-7 text-text-secondary sm:text-lg">
          {description}
        </p>
        {children && (
          <div className="mt-8">
            {children}
          </div>
        )}
      </Container>
    </section>
  );
}
