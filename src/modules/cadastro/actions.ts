"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSessao } from "@/lib/sessao";
import { ROTAS } from "@/constants/rotas";

// ---------------------------------------------------------------------------
// Tipos locais do módulo de cadastro
// ---------------------------------------------------------------------------

export type DadosEmpresa = {
  cnpj: string;
  razao_social: string;
  email: string;
  telefone: string;
  endereco_linha: string;
  endereco_numero?: string;
  endereco_complemento?: string;
  bairro?: string;
  cidade: string;
  estado: string;
  cep?: string;
};

export type DadosResponsavel = {
  nome_completo: string;
  cpf: string;
  telefone: string;
  email: string;
  cargo_funcao: string;
  vinculo_empresa: string;
};

export type ResultadoAcao =
  | { ok: true }
  | { ok: false; erro: string };

// ---------------------------------------------------------------------------
// criar_empresa_e_submissao
// Fase 5 — Matriz Operacional, seção 6 (Cadastro)
// Regras:
//   - cria a empresa com status em_analise
//   - cria o usuário na tabela usuarios vinculado à conta Auth
//   - registra a submissão cadastral número 1
//   - toda escrita acontece no servidor (Fase 5, 3.2)
// ---------------------------------------------------------------------------
export async function criarEmpresaESubmissao(
  _estado: ResultadoAcao | undefined,
  formData: FormData,
): Promise<ResultadoAcao> {
  const supabase = await getSupabaseServerClient();

  const empresa: DadosEmpresa = {
    cnpj: String(formData.get("cnpj") ?? "").replace(/\D/g, ""),
    razao_social: String(formData.get("razao_social") ?? ""),
    email: String(formData.get("email_empresa") ?? ""),
    telefone: String(formData.get("telefone_empresa") ?? ""),
    endereco_linha: String(formData.get("endereco_linha") ?? ""),
    endereco_numero: String(formData.get("endereco_numero") ?? "") || undefined,
    endereco_complemento:
      String(formData.get("endereco_complemento") ?? "") || undefined,
    bairro: String(formData.get("bairro") ?? "") || undefined,
    cidade: String(formData.get("cidade") ?? ""),
    estado: String(formData.get("estado") ?? ""),
    cep: String(formData.get("cep") ?? "") || undefined,
  };

  const responsavel: DadosResponsavel = {
    nome_completo: String(formData.get("nome_completo") ?? ""),
    cpf: String(formData.get("cpf") ?? "").replace(/\D/g, ""),
    telefone: String(formData.get("telefone_responsavel") ?? ""),
    email: String(formData.get("email_responsavel") ?? ""),
    cargo_funcao: String(formData.get("cargo_funcao") ?? ""),
    vinculo_empresa: String(formData.get("vinculo_empresa") ?? ""),
  };

  const senha = String(formData.get("senha") ?? "");

  let {
    data: { user },
  } = await supabase.auth.getUser();

  // Verifica CNPJ duplicado
  const { data: cnpjExistente } = await supabase
    .from("empresas")
    .select("id")
    .eq("cnpj", empresa.cnpj)
    .maybeSingle();

  if (cnpjExistente) {
    return { ok: false, erro: "CNPJ já cadastrado na plataforma." };
  }

  if (!user) {
    if (!senha) {
      return { ok: false, erro: "Senha de acesso é obrigatória para concluir o cadastro." };
    }

    const { data: cadastroAuth, error: erroAuth } = await supabase.auth.signUp({
      email: responsavel.email,
      password: senha,
    });

    if (erroAuth) {
      if (erroAuth.message.toLowerCase().includes("already registered")) {
        return { ok: false, erro: "Já existe uma conta com este e-mail. Faça login para continuar." };
      }

      return { ok: false, erro: "Erro ao criar conta de acesso. Tente novamente." };
    }

    user = cadastroAuth.user;

    if (!user) {
      return { ok: false, erro: "Conta criada sem sessão ativa. Faça login para concluir o cadastro." };
    }
  }

  // Cria empresa
  const { data: novaEmpresa, error: erroEmpresa } = await supabase
    .from("empresas")
    .insert({ ...empresa, status: "em_analise" })
    .select("id")
    .single();

  if (erroEmpresa || !novaEmpresa) {
    return { ok: false, erro: "Erro ao criar empresa. Tente novamente." };
  }

  // Cria usuário vinculado
  const { error: erroUsuario } = await supabase.from("usuarios").insert({
    id_usuario_autenticacao: user.id,
    papel: "usuario_empresa",
    empresa_id: novaEmpresa.id,
    nome_completo: responsavel.nome_completo,
    cpf: responsavel.cpf,
    email: responsavel.email,
    telefone: responsavel.telefone,
    cargo_funcao: responsavel.cargo_funcao,
    vinculo_empresa: responsavel.vinculo_empresa,
    ativo: true,
  });

  if (erroUsuario) {
    return { ok: false, erro: "Erro ao vincular usuário. Tente novamente." };
  }

  // Registra submissão cadastral nº 1
  const { error: erroSubmissao } = await supabase
    .from("submissoes_cadastrais")
    .insert({
      empresa_id: novaEmpresa.id,
      numero_submissao: 1,
      status: "em_analise",
      dados_submetidos: { empresa, responsavel },
    });

  if (erroSubmissao) {
    return {
      ok: false,
      erro: "Erro ao registrar submissão. Tente novamente.",
    };
  }

  revalidatePath("/", "layout");
  redirect(ROTAS.STATUS_CADASTRAL);
}

// ---------------------------------------------------------------------------
// reenviar_submissao
// Fase 5 — Matriz Operacional, seção 6 (Cadastro)
// Regras:
//   - só empresa reprovada pode reenviar
//   - cria nova submissão com numero_submissao incrementado
//   - atualiza status da empresa para em_analise
// ---------------------------------------------------------------------------
export async function reenviarSubmissao(
  _estado: ResultadoAcao | undefined,
  formData: FormData,
): Promise<ResultadoAcao> {
  const supabase = await getSupabaseServerClient();
  const sessao = await getSessao();

  if (!sessao?.empresa_id) return { ok: false, erro: "Sessão inválida." };
  if (sessao.status_empresa !== "reprovada") {
    return { ok: false, erro: "Apenas empresas reprovadas podem reenviar." };
  }

  const empresa: DadosEmpresa = {
    cnpj: String(formData.get("cnpj") ?? "").replace(/\D/g, ""),
    razao_social: String(formData.get("razao_social") ?? ""),
    email: String(formData.get("email_empresa") ?? ""),
    telefone: String(formData.get("telefone_empresa") ?? ""),
    endereco_linha: String(formData.get("endereco_linha") ?? ""),
    endereco_numero: String(formData.get("endereco_numero") ?? "") || undefined,
    endereco_complemento:
      String(formData.get("endereco_complemento") ?? "") || undefined,
    bairro: String(formData.get("bairro") ?? "") || undefined,
    cidade: String(formData.get("cidade") ?? ""),
    estado: String(formData.get("estado") ?? ""),
    cep: String(formData.get("cep") ?? "") || undefined,
  };

  const responsavel: DadosResponsavel = {
    nome_completo: String(formData.get("nome_completo") ?? ""),
    cpf: String(formData.get("cpf") ?? "").replace(/\D/g, ""),
    telefone: String(formData.get("telefone_responsavel") ?? ""),
    email: String(formData.get("email_responsavel") ?? ""),
    cargo_funcao: String(formData.get("cargo_funcao") ?? ""),
    vinculo_empresa: String(formData.get("vinculo_empresa") ?? ""),
  };

  // Conta submissões anteriores para incrementar numero_submissao
  const { count } = await supabase
    .from("submissoes_cadastrais")
    .select("id", { count: "exact", head: true })
    .eq("empresa_id", sessao.empresa_id);

  const proximoNumero = (count ?? 0) + 1;

  // Atualiza empresa para em_analise e dados corrigidos
  const { error: erroEmpresa } = await supabase
    .from("empresas")
    .update({
      ...empresa,
      status: "em_analise",
      reprovada_em: null,
      atualizada_em: new Date().toISOString(),
    })
    .eq("id", sessao.empresa_id);

  if (erroEmpresa) {
    return { ok: false, erro: "Erro ao atualizar empresa. Tente novamente." };
  }

  // Nova submissão
  const { error: erroSubmissao } = await supabase
    .from("submissoes_cadastrais")
    .insert({
      empresa_id: sessao.empresa_id,
      numero_submissao: proximoNumero,
      status: "em_analise",
      dados_submetidos: { empresa, responsavel },
    });

  if (erroSubmissao) {
    return { ok: false, erro: "Erro ao registrar reenvio. Tente novamente." };
  }

  revalidatePath(ROTAS.STATUS_CADASTRAL);
  return { ok: true };
}

// ---------------------------------------------------------------------------
// aprovar_submissao
// Fase 5 — Matriz Operacional, seção 6 (Cadastro)
// Regras:
//   - apenas admin/moderador pode aprovar
//   - atualiza empresa para aprovada
//   - atualiza submissão vigente para aprovada
//   - registra quem aprovou e quando
// ---------------------------------------------------------------------------
export async function aprovarSubmissao(
  empresaId: string,
  submissaoId: string,
): Promise<ResultadoAcao> {
  const supabase = await getSupabaseServerClient();
  const sessao = await getSessao();

  if (!sessao) return { ok: false, erro: "Sessão inválida." };

  const agora = new Date().toISOString();

  const { error: erroEmpresa } = await supabase
    .from("empresas")
    .update({ status: "aprovada", aprovada_em: agora, atualizada_em: agora })
    .eq("id", empresaId);

  if (erroEmpresa) {
    return { ok: false, erro: "Erro ao aprovar empresa." };
  }

  await supabase
    .from("submissoes_cadastrais")
    .update({
      status: "aprovada",
      revisada_por_usuario_id: sessao.id,
      revisada_em: agora,
    })
    .eq("id", submissaoId);

  revalidatePath(ROTAS.ADMIN_ANALISE_CADASTRAL);
  return { ok: true };
}

// ---------------------------------------------------------------------------
// reprovar_submissao
// Fase 5 — Matriz Operacional, seção 6 (Cadastro)
// Regras:
//   - reprovação exige motivo
//   - atualiza empresa para reprovada
//   - registra código e texto do motivo na submissão
// ---------------------------------------------------------------------------
export async function reprovarSubmissao(
  _estado: ResultadoAcao | undefined,
  formData: FormData,
): Promise<ResultadoAcao> {
  const supabase = await getSupabaseServerClient();
  const sessao = await getSessao();

  if (!sessao) return { ok: false, erro: "Sessão inválida." };

  const empresaId = String(formData.get("empresa_id") ?? "");
  const submissaoId = String(formData.get("submissao_id") ?? "");
  const motivoCodigo = String(formData.get("motivo_codigo") ?? "");
  const motivoTexto = String(formData.get("motivo_texto") ?? "");

  if (!motivoTexto.trim()) {
    return { ok: false, erro: "O motivo da reprovação é obrigatório." };
  }

  const agora = new Date().toISOString();

  const { error: erroEmpresa } = await supabase
    .from("empresas")
    .update({
      status: "reprovada",
      reprovada_em: agora,
      atualizada_em: agora,
    })
    .eq("id", empresaId);

  if (erroEmpresa) {
    return { ok: false, erro: "Erro ao reprovar empresa." };
  }

  await supabase
    .from("submissoes_cadastrais")
    .update({
      status: "reprovada",
      motivo_reprovacao_codigo: motivoCodigo || null,
      motivo_reprovacao_texto: motivoTexto,
      revisada_por_usuario_id: sessao.id,
      revisada_em: agora,
    })
    .eq("id", submissaoId);

  revalidatePath(ROTAS.ADMIN_ANALISE_CADASTRAL);
  return { ok: true };
}
