import { XMLParser as FastXMLParser } from "fast-xml-parser";
import type { BaseProdutoNcm } from "~/interface/produto";

export interface XmlParserOptions {
  /** Incluir atributos dos elementos (ex: <tag id="1">) */
  includeAttributes?: boolean;
  /** Prefixo para atributos no objeto resultante (padrão: "@_") */
  attributeNamePrefix?: string;
  /** Converter valores numéricos automaticamente */
  parseNumbers?: boolean;
  /** Converter valores booleanos automaticamente */
  parseBooleans?: boolean;
  /** Ignorar declaração <?xml ... ?> */
  ignoreDeclaration?: boolean;
  /** Remover namespaces dos nomes de tags (ex: "ns:tag" → "tag") */
  removeNamespaces?: boolean;
}

export interface XmlParseResult<T = Record<string, unknown>> {
  data: T | null;
  error: string | null;
  raw: string;
}

export interface XmlFileResult<
  T = Record<string, unknown>,
> extends XmlParseResult<T> {
  /** Nome original do arquivo */
  fileName: string;
  /** true quando o parse foi bem-sucedido */
  success: boolean;
}

export interface XmlBatchResult<T = Record<string, unknown>> {
  /** Resultados dos arquivos que foram parseados com sucesso */
  succeeded: XmlFileResult<T>[];
  /** Resultados dos arquivos que falharam (com motivo do erro) */
  failed: XmlFileResult<T>[];
  /** Total de arquivos processados */
  total: number;
  /** Total de produtos processados */
  produtos: BaseProdutoNcm[];
}

// ─── Parser principal ─────────────────────────────────────────────────────────

/**
 * Faz parse de uma string XML e retorna um objeto JavaScript tipado.
 */
export function parseXml<T = Record<string, unknown>>(
  xmlString: string,
  options: XmlParserOptions = {},
): XmlParseResult<T> {
  const {
    includeAttributes = true,
    attributeNamePrefix = "@_",
    parseNumbers = true,
    parseBooleans = true,
    ignoreDeclaration = true,
    removeNamespaces = false,
  } = options;

  try {
    const parser = new FastXMLParser({
      ignoreAttributes: !includeAttributes,
      attributeNamePrefix,
      parseAttributeValue: parseNumbers || parseBooleans,
      parseTagValue: parseNumbers || parseBooleans,
      ignorePiTags: ignoreDeclaration,
      removeNSPrefix: removeNamespaces,
      trimValues: true,
    });

    const data = parser.parse(xmlString) as T;

    return { data, error: null, raw: xmlString };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erro desconhecido ao parsear XML";
    return { data: null, error: message, raw: xmlString };
  }
}

// ─── Leitura de arquivo (client-side) ────────────────────────────────────────

/**
 * Lê um objeto File XML no browser e retorna o conteúdo parseado.
 */
export async function readXmlFile<T = Record<string, unknown>>(
  file: File,
  options: XmlParserOptions = {},
): Promise<XmlParseResult<T>> {
  return new Promise((resolve) => {
    if (!file.name.match(/\.xml$/i)) {
      resolve({
        data: null,
        error: "O arquivo não possui extensão .xml",
        raw: "",
      });
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result as string;
      resolve(parseXml<T>(content, options));
    };

    reader.onerror = () => {
      resolve({ data: null, error: "Falha ao ler o arquivo", raw: "" });
    };

    reader.readAsText(file, "UTF-8");
  });
}

// ─── Leitura de múltiplos arquivos (client-side) ─────────────────────────────

/**
 * Lê múltiplos arquivos XML em paralelo.
 * Arquivos com erro são reportados em `failed` sem interromper os demais.
 */
export async function readXmlFiles<T = Record<string, unknown>>(
  files: File[] | FileList,
  options: XmlParserOptions = {},
): Promise<XmlBatchResult<T>> {
  const fileArray = Array.from(files);

  const produtosParaProcessar: Array<any> = [];

  const results = await Promise.all(
    fileArray.map(async (file): Promise<XmlFileResult<T>> => {
      const result = await readXmlFile<any>(file, options);

      const produtosRaw = result.data?.nfeProc.NFe.infNFe.det;
      produtosParaProcessar.push(toArray(produtosRaw));

      return {
        ...result,
        fileName: file.name,
        success: result.error === null,
      };
    }),
  );

  const produtosProcessados = processarProdutos(produtosParaProcessar);

  return {
    succeeded: results.filter((r) => r.success),
    failed: results.filter((r) => !r.success),
    total: results.length,
    produtos: produtosProcessados,
  };
}

/**
 * Faz fetch de uma URL que retorna XML e devolve o conteúdo parseado.
 */
export async function fetchXml<T = Record<string, unknown>>(
  url: string,
  options: XmlParserOptions = {},
): Promise<XmlParseResult<T>> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      return {
        data: null,
        error: `Erro HTTP ${response.status}: ${response.statusText}`,
        raw: "",
      };
    }

    const text = await response.text();
    return parseXml<T>(text, options);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao buscar XML";
    return { data: null, error: message, raw: "" };
  }
}

// ─── Helpers de navegação ────────────────────────────────────────────────────

/**
 * Acessa um caminho aninhado em um objeto com segurança.
 * Ex: getPath(obj, 'root.items.item')
 */
export function getPath<T = unknown>(
  obj: Record<string, unknown>,
  path: string,
): T | undefined {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as object)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj) as T | undefined;
}

/**
 * Garante que um valor seja sempre um array (útil para elementos XML únicos vs. múltiplos).
 * Ex: toArray(xml.root.item) → sempre retorna Item[]
 */
export function toArray<T>(value: T | T[] | undefined | null): T[] {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

/**
 * Extrai todos os valores de texto de um nó XML (lida com #text de fast-xml-parser).
 */
export function getTextContent(node: unknown): string {
  if (typeof node === "string") return node;
  if (typeof node === "number" || typeof node === "boolean")
    return String(node);
  if (node && typeof node === "object") {
    const obj = node as Record<string, unknown>;
    if ("#text" in obj) return String(obj["#text"]);
  }
  return "";
}

function getIcmsXml(object: any) {
  const key = Object.keys(object)[0];
  return getCamposImposto(object[key]);

  function getCamposImposto(item: any) {
    const imposto = {
      cst: item.CST,
      aliqIcms: item.pICMS,
    };
    return imposto;
  }
}

function processarProdutos(arrayProdutosRaw: Array<any>) {
  const produtosProcessados: Array<any> = [];

  for (const produtosRaw of arrayProdutosRaw) {
    const produtos = produtosRaw.map((item: any) => {
      return {
        descricao: item.prod.xProd,
        ncm: item.prod.NCM,
        ref: item.prod.cProd,
        barra: item.prod.cEAN,
        cfop: item.prod.CFOP,
      };
    });
    produtosProcessados.push(...produtos);
  }
  return produtosProcessados;
}
