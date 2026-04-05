<template>
  <v-card-item v-if="payloadFDB.length">
    <h3 class="text-h5">Informações</h3>
    <p>
      <span class="text-h6">{{ payloadFDB.length }} </span> linhas processadas
      do excel
    </p>
    <p>{{ colunasBanco.length }} coluna{{ plural }} do banco de dados</p>
  </v-card-item>
</template>
<script setup lang="ts">
  const mainStore = useMainStore();
  const { colunasBanco, payloadFDB } = storeToRefs(mainStore);

  const plural = computed(() => (colunasBanco.value.length > 1 ? "s" : ""));
</script>
