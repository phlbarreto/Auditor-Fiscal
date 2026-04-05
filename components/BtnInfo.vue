<template>
  <DialogOneBtn
    v-model="infoApiFdbDialog"
    title="Informações"
    btn-name="testar"
    btn-icon="mdi-rocket-launch-outline"
    @on-click="apiTest"
    @on-fechar="infoApiFdbDialog = !infoApiFdbDialog">
    <p>
      Para que o arquivo excel atualize o banco de dados do Siafw, é necessario
      instalar a API de conexão com o firebird.
    </p>
    <p>
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
  const { infoApiFdbDialog } = storeToRefs(mainStore);
</script>
