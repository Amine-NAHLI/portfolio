import Container from "@/components/ui/Container";

type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function PageIntro({ eyebrow, title, description }: PageIntroProps) {
  return (
    <section className="page-intro relative overflow-hidden border-b border-border py-16 sm:py-20 lg:py-28">
      <Container>
        <p className="system-label">{"// "}{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-balance font-display text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-pretty text-base leading-7 text-text-secondary sm:text-lg">
          {description}
        </p>
      </Container>
    </section>
  );
}
