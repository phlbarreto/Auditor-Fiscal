export const useApiFDB = () => {
  const { $toast } = useNuxtApp();

  const apiTest = async (exibeToastSucesso = true) => {
    const response = await $fetch<{ status: boolean; message: string }>(
      ROUTES.api.apiFDBStatus,
    );

    if (!response.status) {
      $toast.error(response.message);
      return false;
    }

    exibeToastSucesso ? $toast.success(response.message) : "";
    return true;
  };

  return { apiTest };
};
