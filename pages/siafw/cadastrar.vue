<template>
  <div class="w-75 mx-auto mt-3">
    <DialogConfirmCancel
      v-model="dialogDeletarRecurso"
      title="Atenção!"
      text-confirm="continuar"
      text-cancel="cancelar"
      @confirm="confirmDeletar"
      @cancel="dialogDeletarRecurso = false">
      Todos os {{ tabelaSelecionada }} existentes no banco de dados do Siafw
      serão deletados, não será possível desfazer esta ação. Deseja continuar?
    </DialogConfirmCancel>
    <v-card class="text-center position-relative">
      <BtnInfo />
      <v-card-title>Cadastro em lote</v-card-title>
      <v-card-item>
        <p>
          Suba uma base em excel e informe na primeira linha a(s) coluna(s) que
          será(ão) cadastrada(s).
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

          <div
            v-if="colunasBanco.includes(contexto.key)"
            class="my-4 text-gray-600">
            <p>
              Certifique que os codigos enviados não existam no banco de dados
              ou então marque o checkbox para deletar os
              {{ tabelaSelecionada }} existentes.
            </p>
          </div>

          <div>
            <v-checkbox
              v-model="checkboxDeletar"
              :label="`Deletar ${tabelaSelecionada} existentes? ${checkboxDeletar ? 'Sim' : 'Não'}`"></v-checkbox>
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
  const { apiTest, createRecurso } = useApiFDB();
  const { getContexto, invalidColumns, tabelaSelecionada } = useRecurso();

  const baseExcelFile = ref<File>();
  const colunasBanco = ref<string[]>([]);
  const payload = ref<any[]>([]);
  const loading = ref(false);
  const checkboxDeletar = ref(false);

  const dialogDeletarRecurso = ref(false);

  const plural = computed(() => (colunasBanco.value.length > 1 ? "s" : ""));

  const contexto = getContexto();

  const onClick = async () => {
    if (checkboxDeletar.value) {
      if (!validarCampos()) return;
      dialogDeletarRecurso.value = true;
    } else {
      await processarCadastro();
    }
  };

  const confirmDeletar = async () => {
    await processarCadastro();
    dialogDeletarRecurso.value = false;
  };

  const processarCadastro = async () => {
    if (!validarCampos()) return;

    const dados = payload.value;
    const colunas = colunasBanco.value;

    if (!(await apiTest(false))) return;

    loading.value = true;
    try {
      await createRecurso(
        dados,
        colunas,
        checkboxDeletar.value,
        contexto.value.tabela,
        tabelaSelecionada.value as string,
      );
    } catch (error: any) {
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
