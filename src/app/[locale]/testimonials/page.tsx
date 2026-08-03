import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageIntro from "@/components/ui/PageIntro";
import PortfolioEmptyState from "@/components/ui/PortfolioEmptyState";
import TestimonialForm from "@/components/testimonials/TestimonialForm";
import { getPublicTestimonials } from "@/features/portfolio/data";
import { isLocale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { Quote } from "lucide-react";

type TestimonialsPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: TestimonialsPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const title = locale === "fr" ? "Avis" : "Reviews";
  const description = locale === "fr" ? "Avis et recommandations de professionnels." : "Professional reviews and recommendations.";
  return createPageMetadata({ locale, title, description, path: "/testimonials" });
}

export default async function TestimonialsPage({ params }: TestimonialsPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  
  const testimonials = await getPublicTestimonials(locale);

  return (
    <>
      <PageIntro 
        eyebrow={locale === "fr" ? "Témoignages" : "Testimonials"} 
        title={locale === "fr" ? "Retours Professionnels" : "Professional Feedback"} 
        description={locale === "fr" ? "Voici ce que les gens disent de mon travail et de notre collaboration." : "Here is what people have to say about my work and our collaboration."} 
      />
      
      <Container className="py-12 sm:py-16 lg:py-20">
        <div className="editorial-shell py-1">
          {testimonials.length > 0 ? (
            <div className="grid gap-12 lg:grid-cols-2">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] bg-surface-subtle/30 backdrop-blur-xl border border-border/40 p-8 sm:p-12 transition-all duration-500 hover:bg-surface-subtle/60 hover:border-accent/40 hover:shadow-2xl hover:-translate-y-1 lg:col-span-1">
                  <div className="absolute top-0 right-0 -m-8 size-64 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors duration-500" />
                  
                  <div className="relative z-10 flex-1">
                    <Quote className="size-10 sm:size-12 text-accent/30 mb-8 group-hover:text-accent/50 transition-colors" />
                    <blockquote className="text-xl sm:text-2xl font-display font-medium leading-relaxed text-text-primary text-pretty">
                      &quot;{testimonial.message}&quot;
                    </blockquote>
                  </div>
                  
                  <div className="relative z-10 mt-12 flex items-center gap-5 border-t border-border/40 pt-8">
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-accent/10 border border-accent/20 text-xl font-bold text-accent shadow-[0_0_15px_rgba(var(--color-accent-rgb),0.1)] group-hover:shadow-[0_0_20px_rgba(var(--color-accent-rgb),0.3)] group-hover:scale-105 transition-all duration-500">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-display text-lg font-semibold text-text-primary">
                        {testimonial.name}
                      </p>
                      {(testimonial.role || testimonial.organization) && (
                        <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-text-muted">
                          {[testimonial.role, testimonial.organization].filter(Boolean).join(" — ")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <PortfolioEmptyState collection="testimonials" locale={locale} />
          )}
        </div>
      </Container>
      
      {/* Floating Action Button and Form */}
      <TestimonialForm locale={locale} />
    </>
  );
}
