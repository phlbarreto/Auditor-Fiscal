<template>
  <v-overlay :model-value="loadingSpinner" class="align-center justify-center">
    <v-progress-circular
      color="info"
      size="64"
      indeterminate></v-progress-circular>
  </v-overlay>
</template>
<script setup lang="ts">
  const mainStore = useMainStore();
  const { loadingSpinner } = storeToRefs(mainStore);
</script>