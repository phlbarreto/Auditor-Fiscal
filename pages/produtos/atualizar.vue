<template>
  <div class="w-75 mx-auto mt-3">
    <v-card class="text-center position-relative">
      <BtnInfo />
      <v-card-title>Atualização de produtos</v-card-title>
      <v-card-item>
        <p>
          Suba uma base de produtos em excel e informe as colunas para
          atualização.
        </p>
        <p>
          A primeira linha do excel deve ter o mesmo nome das colunas no banco
          de dados (PRO_COD, PRO_CF...)
        </p>

        <div class="mx-8 my-4">
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
              {{ colunasBanco.join(", ") }}
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
      <v-card-item v-if="baseProdutos.length">
        <h3 class="text-h5">Informações</h3>
        <p>
          <span class="text-h6">{{ baseProdutos.length }} </span> linhas
          processadas do excel
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

  const { apiTest } = useApiFDB();

  const { $toast } = useNuxtApp();
  const baseExcelFile = ref<File>();
  const colunasBanco = ref<string[]>([]);
  const baseProdutos = ref<any[]>([]);
  const loading = ref(false);

  const plural = computed(() => (colunasBanco.value.length > 1 ? "s" : ""));

  const onClick = async () => {
    if (!colunasBanco.value.length || !baseProdutos.value.length) {
      return $toast.error("É necessário informar uma base em excel");
    }
    const produtos = baseProdutos.value;
    const colunas = colunasBanco.value;

    if (!colunasBanco.value.length) {
      $toast.error("Informe as colunas na primeira linha do Excel!");
      return;
    }

    if (!(await apiTest(false))) return;

    loading.value = true;
    try {
      const response = await $fetch(ROUTES.api.produtos, {
        method: "PATCH",
        body: {
          produtos,
          colunas,
        },
      });
      $toast.success(response);
    } catch (error: any) {
      const cause = error.data.data.message;

      $toast.error(`Erro ao atualizar produtos: ${cause}`);
    } finally {
      loading.value = false;
    }
  };

  const onChange = async () => {
    $toast.success(`Base ${baseExcelFile.value?.name} carregada!`);
    const produtos = await readExcel(baseExcelFile.value);
    colunasBanco.value = Object.keys(produtos[0]);
    colunasBanco.value.forEach((col) => {
      if (!isNaN(Number(col))) {
        $toast.error(
          "Colunas do banco de dados deve ser informada na primeira linha do excel",
        );
      }
    });
    produtos.splice(0, 1);

    baseProdutos.value = produtos;
  };
</script>
