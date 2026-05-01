const formatadorMoedaBRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const formatadorDecimalBR = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function formatarMoedaBRL(valor: number) {
  return formatadorMoedaBRL.format(valor);
}

export function formatarDecimalBR(valor: number) {
  return formatadorDecimalBR.format(valor);
}

export function pluralizar(
  quantidade: number,
  singular: string,
  plural = `${singular}s`,
) {
  return `${quantidade} ${quantidade === 1 ? singular : plural}`;
}

export function formatarLocalizacao(
  cidade?: string | null,
  estado?: string | null,
) {
  return [cidade?.trim(), estado?.trim()].filter(Boolean).join(", ");
}