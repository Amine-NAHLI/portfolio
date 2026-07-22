export default function Loading() {
  return (
    <main className="mx-auto min-h-[60vh] w-full max-w-[76rem] px-5 py-20 sm:px-8 lg:px-10" aria-busy="true" aria-label="Chargement">
      <div className="animate-pulse space-y-5 motion-reduce:animate-none">
        <div className="h-3 w-40 rounded-full bg-surface-raised" />
        <div className="h-14 max-w-3xl rounded-xl bg-surface-raised sm:h-20" />
        <div className="h-6 max-w-2xl rounded-lg bg-surface" />
        <div className="h-6 max-w-xl rounded-lg bg-surface" />
      </div>
      <span className="sr-only">Chargement en cours</span>
    </main>
  );
}
