import Container from "@/components/ui/Container";

type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
};

export default function PageIntro({ eyebrow, title, description, children }: PageIntroProps) {
  return (
    <section className="relative overflow-hidden bg-[#0B0B0C] border-b border-white/[0.08] py-12 sm:py-16 lg:py-20 text-[#FFFFFF]">
      {/* Subtle Ambient Violet Spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/2 -z-10 h-[28rem] w-[36rem] -translate-y-1/2 translate-x-1/3 rounded-full bg-[#C8F122]/10 blur-[140px]"
      />
      
      <Container>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#C8F122] block mb-3">
          {eyebrow}
        </span>
        <h1 className="max-w-4xl font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FFFFFF] leading-tight">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-[#A1A1AA] leading-relaxed font-normal">
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
