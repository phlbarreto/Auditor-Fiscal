export const useLogin = () => {
  const mainStore = useMainStore();
  const { loading } = storeToRefs(mainStore);
  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);
  const { $toast } = useNuxtApp();

  const login = async (email: string, password: string) => {
    loading.value = true;
    const router = useRouter();
    try {
      await $fetch(ROUTES.api.login, {
        method: "POST",
        body: {
          email,
          password,
        },
      });
      router.push("/");
    } catch (error: any) {
      if ([401, 403].includes(error.status)) {
        $toast.error("Erro ao realizar o login, credencias inválidas!");
      }
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    try {
      await $fetch(ROUTES.api.logout, {
        method: "DELETE",
      });
      user.value = undefined;
    } catch (error) {
      $toast("Ocorreu um erro ao tentar sair, tente novamente mais tarde.");
    }
  };

  return { login, logout };
};
