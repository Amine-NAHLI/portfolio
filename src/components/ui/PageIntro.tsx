import Container from "@/components/ui/Container";

type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
};

export default function PageIntro({ eyebrow, title, description, children }: PageIntroProps) {
  return (
    <section className="relative overflow-hidden bg-[#101015] border-b border-white/[0.08] py-12 sm:py-16 lg:py-20 text-[#f3f1f7]">
      {/* Subtle Ambient Violet Spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/2 -z-10 h-[28rem] w-[36rem] -translate-y-1/2 translate-x-1/3 rounded-full bg-[#9A71FF]/10 blur-[140px]"
      />
      
      <Container>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#9A71FF] block mb-3">
          {eyebrow}
        </span>
        <h1 className="max-w-4xl font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#f3f1f7] leading-tight">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-[#797681] leading-relaxed font-normal">
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
