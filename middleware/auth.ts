export default defineNuxtRouteMiddleware((to, from) => {
  const router = useRouter();
  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);
  if (protectedRoutes.includes(to.fullPath)) {
    if (!user.value) {
      router.push("/login");
    }
  }
});
