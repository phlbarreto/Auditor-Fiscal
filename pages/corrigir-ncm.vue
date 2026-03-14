<template>
  <LoadingCorrecao v-model="loading" :progresso="progresso" />

  <v-container>
    <div class="mx-4 my-6">
      <v-card>
        <v-card-title> Correção de NCM </v-card-title>
        <v-card-item class="my-2">
          <p>
            A correção do NCM é feita pela comparação das descrições dos
            produtos, onde o sistema retorna o NCM de maior correspondencia
            dessa comparação.
          </p>
        </v-card-item>
        <div class="w-[97%] mx-auto">
          <FileInput
            v-model="excelBd"
            label="Banco de dados com NCMs preenchidos (Descrição | NCM)"
            @change="uploadBd"
            accept=".xlsx, .xls" />
          <FileInput
            v-model="excelCorrecao"
            label="Arquivo de produtos para correção (Codigo | Descrição | NCM)"
            @change="uploadProdutos"
            accept=".xlsx, .xls" />

          <v-btn
            v-if="itemsBdNcm.length > 0 && itemsParaCorrecao.length > 0"
            class="my-4"
            @click="analisar"
            block
            color="primary"
            dark
            >analisar</v-btn
          >
        </div>
      </v-card>

      <v-divider class="my-2"></v-divider>
      <v-row class="my-4">
        <v-col v-if="itemsBdNcm.length > 0 && itemsParaCorrecao.length > 0">
          <v-card class="h-100 pa-4">
            <v-card-title> Informações </v-card-title>
            <v-card-item>
              Total de itens na base de dados: {{ itemsBdNcm.length }}
            </v-card-item>
            <v-card-item>
              Total de itens para correção: {{ itemsParaCorrecao.length }}
            </v-card-item>
          </v-card>
        </v-col>

        <v-col v-if="itensCorrigidos.length > 0">
          <v-card class="pa-4">
            <v-card-title> Resultado </v-card-title>
            <v-card-item>
              Total de itens corrigidos: {{ itensCorrigidos.length }}
            </v-card-item>
            <v-card-item>
              Total de itens não corrigidos: {{ itensNaoCorrigidos.length }}
            </v-card-item>
            <v-card-item>
              Total de itens com NCM não encontrados:
              {{ itensNaoEncontrados.length }}
            </v-card-item>
          </v-card>
        </v-col>
        <v-col v-else-if="itensCorrigidos.length === 0 && correcaoRealizada">
          <v-card class="h-100 pa-4">
            <v-card-title>Resultado</v-card-title>
            <v-card-item>
              <p>Nenhum produto corrigido :(</p>
            </v-card-item>
          </v-card>
        </v-col>
      </v-row>
      <v-btn
        v-if="itensCorrigidos.length > 0"
        block
        color="success"
        @click="gerarExcel"
        >Gerar excel</v-btn
      >
    </div>
  </v-container>
</template>

<script setup lang="ts">
  import FileInput from "~/components/FileInput.vue";
  import type { BaseNcm, ProdutoCorrigidoNcm } from "~/interface/produto";
  const { currentTime } = useCurrentTime();
  const { $toast } = useNuxtApp();

  const excelBd = ref<any>([]);
  const excelCorrecao = ref<any>([]);
  const itemsBdNcm = ref<BaseNcm[]>([]);
  const itemsParaCorrecao = ref<ProdutoCorrigidoNcm[]>([]);
  const loading = ref(false);
  const progresso = ref(0);
  const totalItens = ref(0);
  const itensCorrigidos = ref<ProdutoCorrigidoNcm[]>([]);
  const itensNaoCorrigidos = ref<ProdutoCorrigidoNcm[]>([]);
  const baseCorrigida = ref<ProdutoCorrigidoNcm[]>([]);
  const itensNaoEncontrados = ref<ProdutoCorrigidoNcm[]>([]);
  const correcaoRealizada = ref(false);

  const uploadBd = async () => {
    const columns = ["descricao", "ncm"];
    const excelBase = await readExcel(excelBd.value, columns);
    itemsBdNcm.value = excelBase;
  };

  const uploadProdutos = async () => {
    const columns = ["codigo", "descricao", "ncm"];
    const excelProdutos = await readExcel(excelCorrecao.value, columns);
    itemsParaCorrecao.value = excelProdutos;
  };

  const analisar = async () => {
    loading.value = true;
    correcaoRealizada.value = true;
    progresso.value = 0;

    const total = itemsParaCorrecao.value.length;
    totalItens.value = total;

    const resultado = [];

    for (let i = 0; i < total; i++) {
      const produto = itemsParaCorrecao.value[i];
      const { produtoComparado, corrigido } = corrigirProduto(
        produto,
        itemsBdNcm.value,
      );

      resultado.push(produtoComparado);

      corrigido
        ? itensCorrigidos.value.push(produtoComparado)
        : produtoComparado.semMatch
          ? itensNaoEncontrados.value.push(produtoComparado)
          : itensNaoCorrigidos.value.push(produtoComparado);

      progresso.value = ((i + 1) / total) * 100;

      await new Promise((resolve) => setTimeout(resolve, 1));
    }

    baseCorrigida.value = resultado;
    loading.value = false;
    baseCorrigida.value.map((prod) => {
      if (!prod.ncm) {
        itensNaoEncontrados.value.push(prod);
        return prod;
      }
    });
  };

  const gerarExcel = async () => {
    const nomeArquivo = `ProdutosCorrigidos-${currentTime.value}`;
    const header = [
      { value: "cod", fontWeight: "bold" },
      { value: "descricao", fontWeight: "bold" },
      { value: "ncm", fontWeight: "bold" },
      { value: "status correção", fontWeight: "bold" },
      { value: "rating", fontWeight: "bold" },
    ];
    const itens = (item: any) => {
      const row = [
        { type: Number, value: Number(item.codigo) },
        { type: String, value: String(item.descricao) },
        { type: String, value: String(item.ncm) },
        { type: String, value: String(item.origemNcm) },
        { type: Number, value: Number(item.rating || 0) },
      ];
      return row;
    };

    try {
      await writeExcel(itensCorrigidos.value, header, nomeArquivo, itens);
      $toast.success("Arquivo gerado com sucesso!");
    } catch (error) {
      $toast.error(
        "Erro ao gerar arquivo excel. por favor, verifique seu arquivo de produtos e tente novamente",
      );
      console.log(error);
    }
  };
</script>
