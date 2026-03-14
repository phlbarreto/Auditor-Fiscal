import { defineStore } from "pinia";

export const useMainStore = defineStore("main", () => {
  const switchState = ref(true);

  return {
    switchState,
  };
});
