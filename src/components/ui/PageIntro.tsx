import Container from "@/components/ui/Container";

type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
};

export default function PageIntro({ eyebrow, title, description, children }: PageIntroProps) {
  return (
    <section className="relative overflow-hidden bg-bg-page border-b border-border py-12 sm:py-16 lg:py-20 text-text-primary">
      {/* Subtle Ambient Accent Spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/2 -z-10 h-[28rem] w-[36rem] -translate-y-1/2 translate-x-1/3 rounded-full bg-accent/10 blur-[140px]"
      />
      
      <Container>
        <span className="text-xs font-semibold uppercase tracking-wider text-accent block mb-3">
          {eyebrow}
        </span>
        <h1 className="max-w-4xl font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary leading-tight">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-text-secondary leading-relaxed font-normal">
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
