<template>
  <FileInput v-model="baseExcelFile" @change="onChange" class="mb-4" :prepend-icon="null" label="Base em excel" />

  <div class="h-10 mb-4 border rounded-lg position-relative">
    <span class="position-absolute -top-6 left-0">Colunas do banco de dados informadas no arquivo</span>
    <p v-if="colunasBanco.length" class="text-left mt-2 ml-6">
      <span :class="{
        'text-body-2': colunasBanco.length > 9,
        'text-xs': colunasBanco.length > 12,
      }">
        {{ colunasBanco.join(", ") }}
      </span>
    </p>
  </div>
  <slot />
  <div>
    <v-btn :loading="loading" @click="onClick" block color="primary" size="small" class="mb-4">Processar</v-btn>
  </div>
</template>
<script setup lang="ts">
  const { $toast } = useNuxtApp();
  const { invalidColumns } = useRecurso();

  const mainStore = useMainStore();
  const { baseExcelFile, colunasBanco, payloadFDB, loading, contexto } =
    storeToRefs(mainStore);

  const emit = defineEmits(["onClick"]);
  const onClick = () => emit("onClick");

  const onChange = async () => {
    const dadosArquivo = await readExcel(baseExcelFile.value);
    const colunas = Object.keys(dadosArquivo[0]).map((col) =>
      col.toUpperCase(),
    );

    if (invalidColumns(colunas, contexto)) {
      baseExcelFile.value = undefined;
      return;
    }

    colunasBanco.value = colunas;
    dadosArquivo.splice(0, 1);

    payloadFDB.value = dadosArquivo;
    $toast.success(`Arquivo '${baseExcelFile.value?.name}' carregado!`);
  };
</script>
