<template>
  <v-container fluid grid-list-xs class="pa-16 h-screen">
    <v-card color="">
      <v-card-title primary-title>
        Auditor Fiscal - Sistema de Correção de Tributação
      </v-card-title>
      <v-card-item>
        <p>
          Bem-vindo ao Auditor Fiscal, uma ferramenta desenvolvida para ajudar
          empresas a corrigir a tributação dos produtos de maneira fácil e
          eficiente. Este sistema realiza uma comparação inteligente entre dois
          arquivos Excel fornecidos e gera um terceiro arquivo atualizado,
          destacando as correções necessárias de tributação.
        </p>
      </v-card-item>
      <div class="pa-4 text-center">
        <v-btn
          v-for="button in routes"
          :key="button.name"
          class="mx-4"
          @click="goTo(button.link)"
          :color="button.color"
          :appendIcon="button.icon"
          >{{ button.name }}</v-btn
        >
      </div>
    </v-card>
  </v-container>
</template>
<script setup lang="ts">
  const router = useRouter();
  const goTo = (link: string) => {
    router.push(link);
  };

  const routes = [
    {
      name: "Corrigir ICMS",
      link: "/corrigir-icms",
      color: "primary",
      icon: "mdi-arrow-top-right-thick",
    },
    {
      name: "Corrigir NCM",
      link: "/corrigir-ncm",
      color: "primary",
      icon: "mdi-arrow-top-right-thick",
    },
    {
      name: "Importar XML",
      link: "/xml",
      color: "primary",
      icon: "mdi-arrow-top-right-thick",
    },
  ];
</script>
