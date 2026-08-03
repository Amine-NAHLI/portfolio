"use client";



type Testimonial = {

  id: string;

  name: string;

  role: string | null;

  organization: string | null;

  message: string;

  featured: boolean;

};



export default function TestimonialMarquee({ testimonials }: { testimonials: Testimonial[] }) {

  // If we have few testimonials, just show them centered without marquee animation

  if (testimonials.length < 3) {

    return (

      <div className="relative flex w-full justify-center bg-bg-page/50 py-10">

        <div className="flex flex-wrap items-center justify-center gap-8 px-4">

          {testimonials.map((t, index) => (

            <TestimonialCard key={t.id} t={t} />

          ))}

        </div>

      </div>

    );

  }



  // Duplicate for seamless looping if we have enough

  const repeated = [...testimonials, ...testimonials];



  return (

    <div className="relative flex w-full overflow-hidden bg-bg-page/50 py-10" style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>

      <div className="flex w-max animate-marquee items-center gap-8 px-4 hover:[animation-play-state:paused]">

        {repeated.map((t, index) => (

          <TestimonialCard key={`${t.id}-${index}`} t={t} />

        ))}

      </div>

    </div>

  );

}



function TestimonialCard({ t }: { t: Testimonial }) {

  return (

    <div className="w-[350px] sm:w-[450px] shrink-0 p-8 rounded-3xl bg-surface-subtle/40 backdrop-blur-md border border-border/50 hover:border-accent/40 hover:bg-surface-subtle/80 transition-all duration-300">

      <div className="mb-6 flex gap-2">

        <span className="text-4xl text-accent/40 font-serif leading-none">&quot;</span>

        <p className="text-base sm:text-lg leading-relaxed text-text-primary italic mt-2">

          {t.message.length > 250 ? t.message.substring(0, 250) + '...' : t.message}

        </p>

      </div>

      

      <div className="mt-8 flex items-center gap-4 border-t border-border/50 pt-6">

        <div className="size-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-lg border border-accent/20">

          {t.name.charAt(0)}

        </div>

        <div>

          <p className="text-sm font-semibold text-text-primary">{t.name}</p>

          {(t.role || t.organization) && (

            <p className="mt-1 text-xs text-text-muted">

              {t.role}{t.role && t.organization ? ' — ' : ''}{t.organization}

            </p>

          )}

        </div>

      </div>

    </div>

  );

}
