export const useApiFDB = () => {
  const { $toast } = useNuxtApp();

  const mainStore = useMainStore();
  const {
    loading,
    infoApiFdbDialog,
    baseExcelFile,
    colunasBanco,
    payloadFDB,
    apiFdbOnline,
  } = storeToRefs(mainStore);

  const apiTest = async (exibeToastSucesso = true) => {
    try {
      loading.value = true;
      const response = await $fetch<{
        status: boolean;
        message: string;
        version: string;
      }>(ROUTES.apiFDB.status);

      if (!response.status) {
        $toast.error(response.message);
        return false;
      }

      if (!response.version || response.version !== apiFdbCurrentVersion) {
        $toast.warning(
          "API Firebird desatualizada.\nEntre em contato com o administrador do sistema.",
        );
        return false;
      }

      exibeToastSucesso ? $toast.success(response.message) : "";
      apiFdbOnline.value = true;
      return true;
    } catch (error: any) {
      if (error.name === "FetchError") {
        $toast.error("Sem comunicação com a API");
        infoApiFdbDialog.value = true;
        apiFdbOnline.value = false;
        return false;
      }
      console.log("Erro desconhecido: ", error);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const updateRecurso = async (
    payload: any[],
    colunas: string[],
    recurso: string,
    alvo: string,
  ) => {
    loading.value = true;

    const blocos = chunkArray(payload, 200);
    try {
      let totalAtualizado = 0;
      let chamadaApi = 1;
      for (const bloco of blocos) {
        const response = await $fetch<{ sucesso: string; total: number }>(
          `${ROUTES.apiFDB.atualizarRecurso}/${recurso}`,
          {
            method: "PATCH",
            body: {
              payload: bloco.filter((b) => b),
              colunas,
              call: chamadaApi,
            },
          },
        );
        totalAtualizado += response.total;
        chamadaApi++;
      }
      $toast.success(`Total de ${totalAtualizado} ${alvo} atualizados!`);
      clearData();
    } catch (error: any) {
      $toast.error(error.data.message);
    } finally {
      loading.value = false;
    }
  };

  const createRecurso = async (
    payload: any[],
    colunas: string[],
    deletar: boolean,
    recurso: string,
    alvo: string,
  ) => {
    try {
      loading.value = true;
      const blocos = chunkArray(payload, 200);

      let totalAtualizado = 0;
      let chamadaApi = 1;
      let deletarRecurso = deletar;
      for (const bloco of blocos) {
        const response = await $fetch<{ sucesso: string; total: number }>(
          `${ROUTES.apiFDB.inserirRecurso}/${recurso}`,
          {
            method: "POST",
            body: {
              payload: bloco.filter((b) => b),
              colunas,
              deletar: deletarRecurso,
              call: chamadaApi,
            },
          },
        );
        totalAtualizado += response.total;
        chamadaApi++;
        if (deletar) deletarRecurso = false;
      }
      $toast.success(`Total de ${totalAtualizado} ${alvo} cadastrados!`);
      clearData();
    } catch (error: any) {
      $toast.error(error.data.message);
      console.error("Contexto: ", error.data.context)
    } finally {
      loading.value = false;
    }
  };

  function clearData() {
    baseExcelFile.value = undefined;
    colunasBanco.value = [];
    payloadFDB.value = [];
  }

  return { apiTest, updateRecurso, createRecurso };
};
