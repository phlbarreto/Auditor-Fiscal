<template>
  <div class="mx-8 my-4">
    <Select v-model="tabelaSelecionada" :items="tabelasFdb" label="Selecione o recurso" />
  </div>

  <div class="mx-8 my-4" v-if="tabelaSelecionada">
    <FileInputExcelFdb @on-click="onClick" />
  </div>
</template>
<script setup lang="ts">
  const mainStore = useMainStore();
  const { tabelaSelecionada, payloadFDB, colunasBanco, loading, contexto } =
    storeToRefs(mainStore);
  const { validColumnsFDB } = useRecurso();
  const { apiTest, updateRecurso } = useApiFDB();

  const onClick = async () => {
    if (!validColumnsFDB()) return;

    const dados = payloadFDB.value;
    const colunas = colunasBanco.value;

    if (!(await apiTest(false))) return;

    loading.value = true;
    try {
      await updateRecurso(
        dados,
        colunas,
        contexto.value.tabela,
        tabelaSelecionada.value as string,
      );
    } catch (e) {
    } finally {
      loading.value = false;
    }
  };
</script>
