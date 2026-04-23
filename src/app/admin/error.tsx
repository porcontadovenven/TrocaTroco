"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-6">
      <div className="flex max-w-md flex-col items-center gap-5 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-red-200 bg-red-50 text-2xl">
          ⚠
        </div>
        <div>
          <h2 className="text-lg font-semibold text-stone-900">Ocorreu um erro</h2>
          <p className="mt-1 text-sm text-stone-500">
            {error.message || "Algo deu errado. Tente novamente."}
          </p>
        </div>
        <button
          onClick={reset}
          className="rounded-2xl bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-stone-700"
        >
          Tentar novamente
        </button>
      </div>
    </main>
  );
}
