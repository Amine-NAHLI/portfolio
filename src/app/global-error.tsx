"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#030712] text-white flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-[#06b6d4] text-black rounded-lg font-bold"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
