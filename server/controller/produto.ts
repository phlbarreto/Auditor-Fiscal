import { H3Event } from "h3";
import { ValidationError } from "~/infra/errors";
import { chunkArray } from "~/utils/chunkArray";
import { ROUTES } from "~/utils/constants";

export const update = async (event: H3Event) => {
  const body = await readBody(event);
  try {
    const validationErrorObject = new ValidationError({
      message: "Campos obrigatorios faltantes",
      action: "Verifique se produtos e colunas foram enviados corretamente",
    });
    if (!body) {
      throw validationErrorObject;
    }

    const { produtos, colunas } = body;

    if (!produtos || !colunas) {
      throw validationErrorObject;
    }

    const blocos = chunkArray(produtos, 200);

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
    return `Total de ${produtosAtualizados} produtos atualizados!`;
  } catch (error) {
    return error;
  }
};

export const create = async (event: H3Event) => {
  const body = await readBody(event);
  try {
    const validationErrorObject = new ValidationError({
      message: "Campos obrigatorios faltantes",
      action: "Verifique se produtos e colunas foram enviados corretamente",
    });
    if (!body) {
      throw validationErrorObject;
    }

    const { produtos, colunas, deletar } = body;

    if (!produtos || !colunas) {
      throw validationErrorObject;
    }

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
    return `Total de ${produtosAtualizados} produtos cadastrados!`;
  } catch (error) {
    return error;
  }
};

export const apiStatus = async (event: H3Event) => {
  try {
    const status = await $fetch(ROUTES.apiFDB.status);
    return status;
  } catch (error: any) {
    if (error.name === "FetchError") {
      return { message: "Sem comunicação com a API", status: false };
    }
    return error;
  }
};
