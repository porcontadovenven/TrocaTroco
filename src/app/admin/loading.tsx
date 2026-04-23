export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-200 border-t-emerald-600" />
        <p className="text-sm text-stone-400">Carregando...</p>
      </div>
    </main>
  );
}
