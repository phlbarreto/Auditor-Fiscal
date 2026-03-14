/**
 * composables/useXml.ts
 * Composable Vue 3 / Nuxt 3 para leitura e parsing de XML com estado reativo.
 */

import type { BaseProdutoNcm } from "~/interface/produto";
import {
  parseXml,
  readXmlFile,
  readXmlFiles,
  fetchXml,
  toArray,
  getPath,
  getTextContent,
  type XmlParserOptions,
  type XmlParseResult,
  type XmlFileResult,
  type XmlBatchResult,
} from "~/utils/xmlParser";

export function useXml<T = Record<string, unknown>>(
  options: XmlParserOptions = {},
) {
  // ─── Estado — arquivo único ──────────────────────────────────────────────
  const data = ref<T | null>(null);
  const error = ref<string | null>(null);
  const loading = ref(false);
  const raw = ref("");

  // ─── Estado — múltiplos arquivos ─────────────────────────────────────────
  const batch = ref<XmlBatchResult<T>>({
    succeeded: [],
    failed: [],
    total: 0,
    produtos: [],
  });

  const produtos = ref<Array<BaseProdutoNcm>>([]);

  // ─── Helpers internos ────────────────────────────────────────────────────
  function applyResult(result: XmlParseResult<T>) {
    data.value = result.data;
    error.value = result.error;
    raw.value = result.raw;
  }

  // ─── Métodos públicos ────────────────────────────────────────────────────

  /** Faz parse de uma string XML diretamente */
  function fromString(xmlString: string) {
    loading.value = true;
    try {
      applyResult(parseXml<T>(xmlString, options));
    } finally {
      loading.value = false;
    }
  }

  /** Lê um objeto File (input[type=file]) */
  async function fromFile(file: File) {
    loading.value = true;
    try {
      applyResult(await readXmlFile<T>(file, options));
    } finally {
      loading.value = false;
    }
  }

  /**
   * Lê múltiplos arquivos XML em paralelo.
   * Arquivos com erro são ignorados e reportados em `batch.failed`.
   * Os resultados ficam disponíveis em `batch.succeeded` e `batch.failed`.
   */
  async function fromFiles(files: File[] | FileList) {
    loading.value = true;
    try {
      const result = await readXmlFiles<T>(files, options);
      batch.value = result;
      produtos.value = result.produtos;
    } finally {
      loading.value = false;
    }
  }

  /** Busca XML de uma URL */
  async function fromUrl(url: string) {
    loading.value = true;
    try {
      applyResult(await fetchXml<T>(url, options));
    } finally {
      loading.value = false;
    }
  }

  /** Limpa todo o estado */
  function reset() {
    data.value = null;
    error.value = null;
    raw.value = "";
    loading.value = false;
    batch.value = { succeeded: [], failed: [], total: 0, produtos: [] };
  }

  return {
    // Estado arquivo único (readonly)
    data: readonly(data),
    error: readonly(error),
    loading: readonly(loading),
    raw: readonly(raw),

    // Estado múltiplos arquivos (readonly)
    batch: readonly(batch),
    produtos,

    // Métodos
    fromString,
    fromFile,
    fromFiles,
    fromUrl,
    reset,

    // Utilitários re-exportados para uso inline
    toArray,
    getPath,
    getTextContent,
  };
}
