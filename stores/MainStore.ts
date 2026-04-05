import { defineStore } from "pinia";
import type { Tabela } from "~/interface/recurso";

export const useMainStore = defineStore("main", () => {
  const switchState = ref(true);
  const loading = ref(false);
  const loadingSpinner = ref(true);
  const infoApiFdbDialog = ref(false);
  const baseExcelFile = ref<File>();
  const colunasBanco = ref<string[]>([]);
  const payloadFDB = ref<any[]>([]);
  const tabelaSelecionada = ref<Tabela>();
  const dialogDeletarRecurso = ref(false);
  const checkboxDeletar = ref(false);
  const apiFdbOnline = ref(false);

  const contexto = computed(() => {
    const options = {
      produtos: {
        tabela: "DSIAF006",
        colunas: colunasProdutos,
        key: "PRO_COD",
      },
      clientes: {
        tabela: "DSIAF010",
        colunas: colunasClientes,
        key: "CLI_COD",
      },
      fornecedores: {
        tabela: "DSIAF009",
        colunas: colunasFornecedores,
        key: "FOR_COD",
      },
    };

    return options[tabelaSelecionada.value as Tabela];
  });

  return {
    switchState,
    loading,
    loadingSpinner,
    infoApiFdbDialog,
    baseExcelFile,
    colunasBanco,
    payloadFDB,
    tabelaSelecionada,
    contexto,
    dialogDeletarRecurso,
    checkboxDeletar,
    apiFdbOnline,
  };
});
