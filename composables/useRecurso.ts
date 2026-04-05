export const useRecurso = () => {
  const { $toast } = useNuxtApp();

  const mainStore = useMainStore();
  const { colunasBanco, payloadFDB, tabelaSelecionada, contexto } =
    storeToRefs(mainStore);

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

  const validColumnsFDB = () => {
    if (!colunasBanco.value.length || !payloadFDB.value.length) {
      $toast.error("É necessário informar uma base em excel");
      return false;
    }

    if (!tabelaSelecionada.value) {
      $toast.error("É necessário informar a tabela alvo!");
      return false;
    }

    if (!colunasBanco.value.length) {
      $toast.error("Informe as colunas na primeira linha do Excel!");
      return false;
    }

    return true;
  };

  return { invalidColumns, validColumnsFDB };
};
