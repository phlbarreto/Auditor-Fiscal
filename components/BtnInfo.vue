<template>
  <DialogOneBtn
    v-model="infoDialog"
    title="Informações"
    btn-name="testar"
    btn-icon="mdi-rocket-launch-outline"
    @on-click="apiTest"
    @on-fechar="infoDialog = !infoDialog">
    <p>
      Para que o arquivo excel atualize o banco de dados do Siafw, é necessario
      instalar a API de conexão com o firebird.
    </p>
    <p>
      Faça o teste para verificar se a API está instalada no seu computador!
    </p>
  </DialogOneBtn>
  <v-btn
    @click="infoDialog = !infoDialog"
    v-tooltip="'Informações importantes!'"
    icon="mdi-information-outline"
    size="small"
    flat
    class="position-absolute right-2" />
</template>
<script setup lang="ts">
  const infoDialog = ref(false);
  const { apiTest } = useApiFDB();
</script>
