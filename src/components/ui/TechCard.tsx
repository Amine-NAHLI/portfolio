"use client";

export default function TechCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-border-strong bg-surface-subtle/85 backdrop-blur-xl transition-all duration-300 hover:border-accent/40 hover:shadow-xl ${className}`}
    >
      {/* Content */}
      <div className="relative h-full w-full p-6">
        {children}
      </div>
    </div>
  );
}
