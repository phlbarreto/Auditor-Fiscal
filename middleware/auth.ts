export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);
  const { fetchUserData } = useUser();
  if (!user.value) {
    await fetchUserData();
  }

  if (protectedRoutes.includes(to.fullPath)) {
    if (!user.value) {
      useRouter().push("/login");
    }
  }
});
