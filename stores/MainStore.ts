import { defineStore } from "pinia";

export const useMainStore = defineStore("main", () => {
  const switchState = ref(true);

  const loading = ref(false);
  return {
    switchState,
    loading,
  };
});
