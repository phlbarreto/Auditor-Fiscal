import { defineStore } from "pinia";
import type { AuthenticatedUser } from "~/interface/user";

export const useUserStore = defineStore("user", () => {
  const user = ref<AuthenticatedUser>();
  return { user };
});
