export interface Produto {
  codigo?: number;
  descricao?: string;
  ncm: string;
  cso?: number;
  cst?: string;
}
export interface ProdutoCorrigidoTributacao extends Produto {
  cfop: string;
  icms?: string;
}

export interface BaseProdutoNcm {
  ref: string;
  barra: string;
  cfop: string;
  ncm: string;
  descricao: string;
}

export interface BaseNcm {
  descricao: string;
  ncm: string;
}

export interface ProdutoCorrigidoNcm extends BaseNcm {
  codigo?: number;
  origemNcm?: string;
  rating?: number;
}

export type ProdutoCorrigido = ReturnType<typeof compararNcm>