export const useApiFDB = () => {
  const { $toast } = useNuxtApp();

  const apiTest = async (exibeToastSucesso = true) => {
    try {
      const response = await $fetch<{ status: boolean; message: string }>(
        ROUTES.apiFDB.status,
      );

      if (!response.status) {
        $toast.error(response.message);
        return false;
      }
      exibeToastSucesso ? $toast.success(response.message) : "";
      return true;
    } catch (error: any) {
      if (error.name === "FetchError") {
        $toast.error("Sem comunicação com a API");
        return false;
      }
      console.log("Erro desconhecido: ", error);
      return false;
    }
  };

  const updateRecurso = async (
    payload: any[],
    colunas: string[],
    recurso: string,
    alvo: string,
  ) => {
    const blocos = chunkArray(payload, 200);
    try {
      let totalAtualizado = 0;
      for (const bloco of blocos) {
        const response = await $fetch<{ sucesso: string; total: number }>(
          `${ROUTES.apiFDB.atualizarRecurso}/${recurso}`,
          {
            method: "PATCH",
            body: { payload: bloco.filter((b) => b), colunas },
          },
        );
        totalAtualizado += response.total;
      }
      $toast.success(`Total de ${totalAtualizado} ${alvo} atualizados!`);
    } catch (error: any) {
      $toast.error(error.data.message);
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
      const blocos = chunkArray(payload, 200);

      let totalAtualizado = 0;
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
            },
          },
        );
        totalAtualizado += response.total;
        if (deletar) {
          deletarRecurso = false;
        }
      }
      $toast.success(`Total de ${totalAtualizado} ${alvo} cadastrados!`);
    } catch (error: any) {
      $toast.error(error.data.message);
    }
  };

  return { apiTest, updateRecurso, createRecurso };
};
