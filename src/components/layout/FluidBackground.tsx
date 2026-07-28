export default function FluidBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <div className="absolute inset-0 bg-bg-page transition-colors duration-1000" />

      {/* Blobs d'ambiance - Couleurs définies par le thème (claire / sombre) */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] min-w-[400px] min-h-[400px] rounded-full bg-ambient-cyan blur-[120px] animate-fluid-blob" 
        style={{ animationDuration: '18s' }} 
      />
      <div 
        className="absolute top-[20%] right-[-10%] w-[45vw] h-[45vw] min-w-[350px] min-h-[350px] rounded-full bg-accent/20 blur-[130px] animate-fluid-blob" 
        style={{ animationDelay: '-5s', animationDuration: '22s' }} 
      />
      <div 
        className="absolute bottom-[-20%] left-[10%] w-[60vw] h-[60vw] min-w-[500px] min-h-[500px] rounded-full bg-info/20 blur-[140px] animate-fluid-blob" 
        style={{ animationDelay: '-12s', animationDuration: '25s' }} 
      />

      {/* Motif Grille (Grid) */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] text-text-primary pointer-events-none" 
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem',
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)',
        }}
      />

      {/* Texture de grain (cloud/noise overlay) pour le style premium */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.35] mix-blend-overlay pointer-events-none">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
}
