export const useUser = () => {
  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);
  const mainStore = useMainStore();
  const { loadingSpinner } = storeToRefs(mainStore);

  const fetchUserData = async () => {
    try {
      loadingSpinner.value = true;
      const userResponse = await $fetch<any>(ROUTES.api.fetchUser);
      if (userResponse) {
        user.value = userResponse;
      }
    } catch (error) {
      user.value = undefined;
    } finally {
      loadingSpinner.value = false;
    }
  };

  return { fetchUserData };
};
