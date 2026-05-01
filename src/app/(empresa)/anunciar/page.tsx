import { FormAnunciar } from "@/modules/anuncios/FormAnunciar";

export default function PaginaAnunciar() {
  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <FormAnunciar modo="criar" />
      </div>
    </main>
  );
}
