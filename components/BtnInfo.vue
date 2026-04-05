<template>
  <DialogOneBtn
    :disabled="apiFdbOnline"
    v-model="infoApiFdbDialog"
    title="Informações"
    btn-name="testar"
    :btn-loading="loading"
    btn-icon="mdi-rocket-launch-outline"
    @on-click="apiTest"
    @on-fechar="infoApiFdbDialog = !infoApiFdbDialog">
    <p>
      Para que o arquivo excel atualize o banco de dados do Siafw, é necessario
      instalar a API de conexão com o firebird.
    </p>
    <p class="mt-2 text-lime-600" v-if="apiFdbOnline">
      API conectada e pronta para operar.
      <span class="text-h5">✓</span>
    </p>
    <p v-else>
      Faça o teste para verificar se a API está instalada no seu computador!
    </p>
  </DialogOneBtn>
  <v-btn
    @click="infoApiFdbDialog = !infoApiFdbDialog"
    v-tooltip="'Informações importantes!'"
    icon="mdi-information-outline"
    size="small"
    flat
    class="position-absolute right-2" />
</template>
<script setup lang="ts">
  const { apiTest } = useApiFDB();
  const mainStore = useMainStore();
  const { infoApiFdbDialog, apiFdbOnline, loading } = storeToRefs(mainStore);
</script>
