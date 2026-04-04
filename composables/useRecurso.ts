import type { Tabela } from "~/interface/recurso";

export const useRecurso = () => {
  const { $toast } = useNuxtApp();
  const tabelaSelecionada = ref<Tabela>();

  const getContexto = () => {
    const tabela = computed(() => {
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
    return tabela;
  };

  const invalidColumns = (colunas: string[], contexto: ComputedRef) => {
    let error = false;
    colunas.forEach((col) => {
      if (!isNaN(Number(col))) {
        $toast.error(
          "Colunas do banco de dados deve ser informada na primeira linha do excel",
        );
        error = true;
      }

      if (!contexto.value.colunas.includes(col.toUpperCase())) {
        $toast.error(
          `Coluna '${col}' inexistente para a tabela ${tabelaSelecionada.value}, Verifique e importe novamente!`,
        );
        error = true;
      }
    });

    return error;
  };

  return { getContexto, invalidColumns, tabelaSelecionada };
};
