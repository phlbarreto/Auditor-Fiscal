<template>
  <div class="w-75 mx-auto mt-3">
    <v-card class="text-center position-relative">
      <BtnInfo />
      <v-card-title>Atualização em lote</v-card-title>
      <v-card-item>
        <p>
          Suba uma base em excel e informe na primeira linha a(s) coluna(s) que
          será(ão) atualizada(s).
        </p>

        <div class="mx-8 my-4">
          <Select
            v-model="tabelaSelecionada"
            :items="tabelasFdb"
            label="Selecione a tabela alvo" />
        </div>

        <div class="mx-8 my-4" v-if="tabelaSelecionada">
          <FileInput
            v-model="baseExcelFile"
            @change="onChange"
            class="mb-4"
            :prepend-icon="null"
            label="Base em excel" />

          <div class="h-10 mb-4 border rounded-lg position-relative">
            <span class="position-absolute -top-6 left-0 text-black"
              >Colunas do banco de dados informadas no arquivo</span
            >
            <p v-if="colunasBanco.length" class="text-left mt-2 ml-6">
              <span
                :class="{
                  'text-body-2': colunasBanco.length > 9,
                  'text-xs': colunasBanco.length > 12,
                }">
                {{ colunasBanco.join(", ") }}
              </span>
            </p>
          </div>

          <v-btn
            :loading="loading"
            @click="onClick()"
            block
            color="primary"
            size="small"
            class="mb-4"
            >Processar</v-btn
          >
        </div>
      </v-card-item>
      <v-card-item v-if="payload.length">
        <h3 class="text-h5">Informações</h3>
        <p>
          <span class="text-h6">{{ payload.length }} </span> linhas processadas
          do excel
        </p>
        <p>{{ colunasBanco.length }} coluna{{ plural }} do banco de dados</p>
      </v-card-item>
    </v-card>
  </div>
</template>
<script setup lang="ts">
  definePageMeta({
    middleware: "auth",
  });

  const { $toast } = useNuxtApp();
  const { apiTest, updateRecurso } = useApiFDB();
  const { getContexto, invalidColumns, tabelaSelecionada } = useRecurso();

  const baseExcelFile = ref<File>();
  const colunasBanco = ref<string[]>([]);
  const payload = ref<any[]>([]);
  const loading = ref(false);

  const plural = computed(() => (colunasBanco.value.length > 1 ? "s" : ""));

  const contexto = getContexto();

  const onClick = async () => {
    if (!validarCampos()) return;

    const dados = payload.value;
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

    payload.value = dadosArquivo;
    $toast.success(`Base ${baseExcelFile.value?.name} carregada!`);
  };

  const validarCampos = () => {
    if (!colunasBanco.value.length || !payload.value.length) {
      $toast.error("É necessário informar uma base em excel");
      return false;
    }

    if (!tabelaSelecionada.value) {
      $toast.error("É necessário informar a tabela alvo!");
      return false;
    }

    if (!colunasBanco.value.length) {
      $toast.error("Informe as colunas na primeira linha do Excel!");
      return false;
    }

    return true;
  };
</script>
