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
    } catch (error) {
      console.log(error);
    }
  };

  const updateProdutos = async (produtos: any[], colunas: string[]) => {
    const blocos = chunkArray(produtos, 200);
    try {
      let produtosAtualizados = 0;
      for (const bloco of blocos) {
        const response = await $fetch<{ sucesso: string; total: number }>(
          ROUTES.apiFDB.atualizarProdutos,
          {
            method: "PATCH",
            body: { produtos: bloco.filter((b) => b), colunas },
          },
        );
        produtosAtualizados += response.total;
      }
      $toast.success(`Total de ${produtosAtualizados} produtos atualizados!`);
    } catch (error: any) {
      $toast.error(error.data.message);
    }
  };

  const createProdutos = async (
    produtos: any[],
    colunas: string[],
    deletar: boolean,
  ) => {
    try {
      const blocos = chunkArray(produtos, 200);

      let produtosAtualizados = 0;
      for (const bloco of blocos) {
        const response = await $fetch<{ sucesso: string; total: number }>(
          ROUTES.apiFDB.atualizarProdutos,
          {
            method: "POST",
            body: { produtos: bloco.filter((b) => b), colunas, deletar },
          },
        );
        produtosAtualizados += response.total;
      }
      $toast.success(`Total de ${produtosAtualizados} produtos cadastrados!`);
    } catch (error: any) {
      $toast.error(error.data.message);
    }
  };

  return { apiTest, updateProdutos, createProdutos };
};
