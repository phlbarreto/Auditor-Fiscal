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

        <AtualizarFdb />
      </v-card-item>
      <InfoPayloadFdb />
    </v-card>
  </div>
</template>
<script setup lang="ts">
  definePageMeta({
    middleware: "auth",
  });
  const { apiTest } = useApiFDB();

  onMounted(async () => {
    await apiTest();
  });
</script>
