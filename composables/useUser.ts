export const useUser = () => {
  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);

  const fetchUserData = async () => {
    try {
      const userResponse = await $fetch<any>(ROUTES.api.fetchUser);
      if (userResponse) {
        user.value = userResponse;
      }
    } catch (error) {
      user.value = undefined;
    }
  };

  return { fetchUserData };
};
