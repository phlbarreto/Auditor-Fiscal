<template>
  <v-container fluid grid-list-xs class="pa-16 h-screen">
    <v-card class="text-center pa-4">
      <v-card-title primary-title> Auditor Fiscal </v-card-title>
      <v-card-text>
        <p>
          Simplifique a correção da sua base tributária. Compare arquivos,
          identifique erros e gere resultados prontos para o uso em poucos
          cliques.
        </p>
      </v-card-text>
      <v-card-item class="mb-8">
        <div class="pa-4 text-center" v-if="userId">
          <v-card-text class="mb-4">
            O sistema processa e compara seus arquivos Excel, entregando uma
            exportação consolidada e corrigida.*
            <p class="text-body-2 text-gray-500">
              *O resultado depende da qualidade e padronização dos dados
              fornecidos.
            </p>
          </v-card-text>
          <v-btn
            v-for="button in routesFiscal"
            :key="button.name"
            class="mx-4"
            @click="goTo(button.link)"
            :color="button.color"
            :appendIcon="button.icon"
            size="small"
            >{{ button.name }}</v-btn
          >
        </div>
      </v-card-item>

      <v-card-item>
        <div class="text-h5">Automação para o Siafw</div>
        <v-card-text>
          Cadastros e atualizações do banco de dados em lote</v-card-text
        >
        <div>
          <v-btn
            v-for="button in routesSiaf"
            :key="button.name"
            class="mx-4"
            @click="goTo(button.link)"
            :color="button.color"
            :appendIcon="button.icon"
            size="small"
            >{{ button.name }}</v-btn
          >
        </div>
      </v-card-item>
    </v-card>
  </v-container>
</template>
<script setup lang="ts">
  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);

  const userId = computed(
    () => user.value?.id === "7caa926b-2149-429d-af25-83fc67e947dd",
  );

  const router = useRouter();
  const goTo = (link: string) => {
    router.push(link);
  };

  const routesFiscal = [
    {
      name: "Corrigir ICMS",
      link: ROUTES.app.icms,
      color: "primary",
      icon: "mdi-arrow-top-right-thick",
    },
    {
      name: "Corrigir NCM",
      link: ROUTES.app.ncm,
      color: "primary",
      icon: "mdi-arrow-top-right-thick",
    },
    {
      name: "Importar XML",
      link: ROUTES.app.xml,
      color: "primary",
      icon: "mdi-arrow-top-right-thick",
    },
  ];

  const routesSiaf = [
    {
      name: "atualizar",
      link: ROUTES.app.atualizarRecurso,
      color: "primary",
      icon: "mdi-sync",
    },
    {
      name: "cadastrar",
      link: ROUTES.app.inserirRecurso,
      color: "primary",
      icon: "mdi-plus",
    },
  ];
</script>
