<template>
  <div class="w-75 mx-auto mt-3">
    <DialogConfirmCancel
      v-model="dialogDeletarProdutos"
      title="Atenção!"
      text-confirm="continuar"
      text-cancel="cancelar"
      @confirm="confirmDeletar"
      @cancel="dialogDeletarProdutos = false">
      Todos os produtos existentes no banco de dados do Siafw serão deletados,
      essa ação não tem volta. Deseja continuar?
    </DialogConfirmCancel>
    <v-card class="text-center position-relative">
      <BtnInfo />
      <v-card-title>Cadastro de produtos</v-card-title>
      <v-card-item>
        <p>
          Suba uma base de produtos em excel e informe as colunas para cadastro.
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

          <div
            v-if="colunasBanco.includes('PRO_COD')"
            class="my-4 text-gray-600">
            <p>
              Certifique que os codigos enviados não existam no banco de dados
              ou então marque o checkbox para deletar os produtos existentes.
            </p>
          </div>

          <div>
            <v-checkbox
              v-model="checkboxDeletar"
              :label="`Deletar produtos existentes? ${checkboxDeletar ? 'Sim' : 'Não'}`"></v-checkbox>
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

  const { apiTest, createProdutos } = useApiFDB();

  const { $toast } = useNuxtApp();
  const baseExcelFile = ref<File>();
  const colunasBanco = ref<string[]>([]);
  const baseProdutos = ref<any[]>([]);
  const loading = ref(false);
  const checkboxDeletar = ref(false);

  const dialogDeletarProdutos = ref(false);

  const plural = computed(() => (colunasBanco.value.length > 1 ? "s" : ""));

  const onClick = async () => {
    if (checkboxDeletar.value) {
      dialogDeletarProdutos.value = true;
    } else {
      await processarCadastro();
    }
  };

  const confirmDeletar = async () => {
    await processarCadastro();
    dialogDeletarProdutos.value = false;
  };

  const processarCadastro = async () => {
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
      await createProdutos(produtos, colunas, checkboxDeletar.value);
    } catch (error: any) {
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
