import type {
  Produto,
  ProdutoCorrigido,
  ProdutoCorrigidoNcm,
} from "~/interface/produto";
import { findBestMatch } from "string-similarity";

export const compararNcm = (
  ncmsAnexo: Set<string> | undefined,
  produtosDb: Produto[],
  regime: string,
) => {
  const ncmCorespondente = (ncmProduto: string | number) => {
    if (!ncmProduto) return false;

    const tamanhosNcmAnexo = [4, 5, 6, 7, 8];
    const ncmProdutoString = String(ncmProduto);
    const ncmExistente = tamanhosNcmAnexo.some((tamanho) => {
      const digitosNcm = ncmProdutoString.substring(0, tamanho);
      if (!ncmsAnexo) {
        return false;
      }
      return ncmsAnexo.has(digitosNcm);
    });

    return ncmExistente;
  };

  const produtosCorrigidos = produtosDb.map((item, index) => {
    if (index === 0) {
      return;
    }

    const ncmProduto = item.ncm;
    const correspondencia = ncmCorespondente(ncmProduto);

    let cst = "000";
    let cso = "102";
    let cfop = "5.102";
    let icms = "20.5";
    if (correspondencia) {
      cst = "060";
      cso = "500";
      cfop = "5.405";
      icms = "0";
    }

    const simples = {
      ...item,
      cst,
      cso,
      cfop,
    };

    const normal = {
      ...item,
      cst,
      cfop,
      icms,
    };

    return regime === "simples" ? simples : normal;
  });

  if (
    isNaN(Number(produtosCorrigidos[0]?.codigo)) ||
    !produtosCorrigidos[0]?.codigo
  )
    delete produtosCorrigidos[0];
  return produtosCorrigidos;
};

export const compararProdutos = (
  produtosDb: Produto[],
  produtosCorrigidos: ProdutoCorrigido,
  regime: string,
) => {
  let qtdTributacaoIgual = 0;
  let qtdTributacaoDiferente = 0;
  const produtosCorretos: Produto[] = [];
  const produtosIncorretos: Produto[] = [];
  const codigosProdutosIncorretos: number[] = [];

  const mapaProdutos = new Map(
    produtosCorrigidos
      .filter((p) => p && p.codigo !== undefined)
      .map((p) => [p?.codigo, p]),
  );

  for (const produtoDb of produtosDb) {
    if (produtoDb.codigo && isNaN(produtoDb.codigo)) continue;

    const tributacaoOriginal =
      regime === "simples"
        ? produtoDb.cso?.toString()
        : produtoDb.cst?.toString();

    const produtoAuditado = mapaProdutos.get(produtoDb.codigo);

    const tributacaoAuditada =
      regime === "simples"
        ? produtoAuditado?.cso?.toString()
        : produtoAuditado?.cst?.toString();

    if (tributacaoAuditada === tributacaoOriginal) {
      qtdTributacaoIgual++;
      produtosCorretos.push(produtoDb);
      continue;
    }

    qtdTributacaoDiferente++;
    produtosIncorretos.push(produtoDb);
    codigosProdutosIncorretos.push(produtoDb.codigo || 0);
  }

  return {
    qtdTributacaoIgual,
    qtdTributacaoDiferente,
    produtosCorretos,
    produtosIncorretos,
    codigosProdutosIncorretos,
  };
};

export const corrigirProduto = (
  produto: Produto,
  bancoDeDados: ProdutoCorrigidoNcm[],
) => {
  const produtoComparado: any = {
    ...produto,
  };

  const descricao = String(produto.descricao || "sem descricao")
    .toLowerCase()
    .trim();

  const ncmAtual = produto.ncm?.toString().trim();

  const candidatos = bancoDeDados.filter(
    (p) => p.ncm && String(p.descricao).toLowerCase().trim(),
  );

  let corrigido = false;

  if (candidatos.length === 0) {
    produtoComparado.origemNcm = "NCM não encontrado no banco de dados";
    return { produtoComparado, corrigido };
  }

  const descricoes = candidatos.map((p) =>
    String(p.descricao).toLowerCase().trim(),
  );

  const resultado = findBestMatch(descricao, descricoes);

  if (resultado.bestMatch.rating < 0.4) {
    produtoComparado.origemNcm = "Sem correspondência com confiança mínima";
    produtoComparado.semMatch = true;
    return { produtoComparado, corrigido };
  }

  const melhorIndice = resultado.bestMatchIndex;
  const produtoSimilar = candidatos[melhorIndice];
  const ncmSugerido = produtoSimilar.ncm;

  if (ncmAtual) {
    if (ncmAtual === ncmSugerido.toString()) {
      produtoComparado.ncm = ncmAtual;
      produtoComparado.origemNcm = `NCM Correto! (NCM: ${ncmAtual})`;
      return { produtoComparado, corrigido };
    }

    if (resultado.bestMatch.rating > 0.45) {
      produtoComparado.ncm = ncmSugerido.toString();
      produtoComparado.origemNcm = `Corrigido: NCM anterior ${ncmAtual} => NCM: ${ncmSugerido} com base em ${produtoSimilar.descricao}`;
      produtoComparado.rating = resultado.bestMatch.rating;
      corrigido = true;
      return { produtoComparado, corrigido };
    }

    produtoComparado.origemNcm = `Não alterado (NCM: ${ncmAtual})`;
    return { produtoComparado, corrigido };
  }

  produtoComparado.ncm = ncmSugerido.toString();
  produtoComparado.origemNcm = `Sugerido (NCM: ${ncmSugerido}) com base em ${produtoSimilar.descricao}`;
  produtoComparado.rating = resultado.bestMatch.rating;
  corrigido = true;
  return { produtoComparado, corrigido };
};
