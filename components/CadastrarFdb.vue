<template>
  <div class="mx-8 my-4">
    <Select v-model="tabelaSelecionada" :items="tabelasFdb" label="Selecione o recurso" />
  </div>

  <div class="mx-8 my-4" v-if="tabelaSelecionada">
    <FileInputExcelFdb @on-click="onClick">
      <div>
        <v-checkbox v-model="checkboxDeletar"
          :label="`Deletar ${tabelaSelecionada} existentes? ${checkboxDeletar ? 'Sim' : 'Não'}`"></v-checkbox>
      </div>
    </FileInputExcelFdb>

    <div v-if="colunasBanco.includes(contexto.key)" class="my-4 text-gray-300">
      <p>
        Certifique que os codigos enviados não existam no banco de dados.
        Códigos duplicados não serão aceitos. Para resolver isso, marque o
        checkbox para deletar os
        {{ tabelaSelecionada }} existentes.
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
  const { validColumnsFDB } = useRecurso();
  const mainStore = useMainStore();
  const {
    contexto,
    colunasBanco,
    tabelaSelecionada,
    dialogDeletarRecurso,
    checkboxDeletar,
  } = storeToRefs(mainStore);

  const emit = defineEmits(["processarCadastro"]);

  const onClick = () => {
    if (checkboxDeletar.value) {
      if (!validColumnsFDB()) return;
      dialogDeletarRecurso.value = true;
    } else {
      emit("processarCadastro");
    }
  };
</script>
