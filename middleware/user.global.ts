export default defineNuxtRouteMiddleware(async (to, from) => {
  const nuxtapp = useNuxtApp();
 
  if (import.meta.server || nuxtapp.isHydrating) {
    return;
  }

  try {
    const { fetchUserData } = useUser();
    await fetchUserData();
  } catch (error) {}
});
