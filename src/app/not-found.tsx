export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-[#06b6d4] to-[#6366f1] bg-clip-text text-transparent">
          404
        </h1>
        <p className="text-[#cbd5e1] mb-8 font-mono">Page not found.</p>
        <a
          href="/"
          className="px-6 py-3 bg-[#06b6d4] text-black rounded-lg font-bold hover:scale-105 transition-transform"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
