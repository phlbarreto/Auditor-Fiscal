<template>
  <DialogConfirmCancel
    v-model="dialogDeletarRecurso"
    title="Atenção!"
    text-confirm="continuar"
    text-cancel="cancelar"
    @confirm="confirmDeletar"
    @cancel="dialogDeletarRecurso = false">
    Todos os {{ tabelaSelecionada }} existentes no banco de dados do Siafw serão
    deletados, não será possível desfazer esta ação. Deseja continuar?
  </DialogConfirmCancel>
  <div class="w-75 mx-auto mt-3">
    <v-card class="text-center position-relative">
      <BtnInfo />
      <v-card-title>Cadastro em lote</v-card-title>
      <v-card-item>
        <p>
          Suba uma base em excel e informe na primeira linha a(s) coluna(s) que
          será(ão) cadastrada(s).
        </p>
        <CadastrarFdb @processar-cadastro="processarCadastro" />
      </v-card-item>
      <InfoPayloadFdb />
    </v-card>
  </div>
</template>
<script setup lang="ts">
  definePageMeta({
    middleware: "auth",
  });
  const { apiTest, createRecurso } = useApiFDB();
  const { validColumnsFDB } = useRecurso();
  const mainStore = useMainStore();
  const {
    loading,
    contexto,
    payloadFDB,
    colunasBanco,
    tabelaSelecionada,
    dialogDeletarRecurso,
    checkboxDeletar,
  } = storeToRefs(mainStore);

  onMounted(async () => {
    await apiTest();
  });

  const confirmDeletar = async () => {
    await processarCadastro();
    dialogDeletarRecurso.value = false;
  };

  const processarCadastro = async () => {
    if (!validColumnsFDB()) return;

    const dados = payloadFDB.value;
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
</script>
