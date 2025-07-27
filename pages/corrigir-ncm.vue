<template>
  <v-overlay
    :model-value="loading"
    class="align-center justify-center"
    persistent>
    <v-card class="pa-6" elevation="10" max-width="400">
      <div class="text-center mb-4">
        <v-progress-circular
          indeterminate
          color="primary"
          size="60"
          width="6"
          class="mb-4" />
        <h3 class="text-h6 font-weight-bold">Analisando produtos...</h3>
        <p class="text-caption">Por favor, aguarde.</p>
      </div>
      <v-progress-linear
        :value="progresso"
        height="18"
        color="blue"
        striped
        rounded>
        <template #default>
          <strong>{{ Math.round(progresso) }}%</strong>
        </template>
      </v-progress-linear>
    </v-card>
  </v-overlay>

  <v-container class="bg-neutral-300">
    <v-card class="mx-4 my-6">
      <v-card-title> Correção de NCM </v-card-title>
      <v-card-item class="my-2">
        <p>Correção de NCM baseado em um banco de dados fornecido</p>
      </v-card-item>
    </v-card>
    <v-file-input
      v-model="excelBd"
      label="Banco de dados com NCMs preenchidos (Descrição | NCM)"
      @change="uploadBd"
      accept=".xlsx, .xls" />
    <v-file-input
      v-model="excelCorrecao"
      label="Arquivo de produtos para correção (Codigo | Descrição | NCM)"
      @change="uploadProdutos"
      accept=".xlsx, .xls" />
    <div v-if="itemsBd.length > 0 && itemsCorrecao.length > 0" class="my-2">
      <v-btn @click="analisar" block color="primary" dark>analisar</v-btn>
    </div>

    <v-divider class="my-2"></v-divider>
    <v-row>
      <v-col v-if="itemsBd.length > 0 && itemsCorrecao.length > 0">
        <v-card class="my-4">
          <v-card-title> Informações </v-card-title>
          <v-card-item>
            Total de itens no banco de dados: {{ itemsBd.length }}
          </v-card-item>
          <v-card-item>
            Total de itens para correção: {{ itemsCorrecao.length }}
          </v-card-item>
        </v-card>
      </v-col>
      <v-col v-if="itensCorrigidos.length > 0 || itensNaoCorrigidos.length > 0">
        <v-card class="my-4">
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
    </v-row>
    <v-btn
      block
      v-if="baseCorrigida.length > 0"
      color="success"
      @click="gerarExcel"
      >Gerar excel</v-btn
    >
  </v-container>
</template>

<script setup>
  import readXlsxFile from "read-excel-file";
  import writeXlsxFile from "write-excel-file";
  import { findBestMatch } from "string-similarity";
  const excelBd = ref([]);
  const excelCorrecao = ref([]);
  const itemsBd = ref([]);
  const itemsCorrecao = ref([]);
  const { currentTime } = useCurrentTime();
  const { $toast } = useNuxtApp();
  const rows = [];
  const loading = ref(false);
  const progresso = ref(0);
  const totalItens = ref(0);
  const itensCorrigidos = ref([]);
  const itensNaoCorrigidos = ref([]);
  const baseCorrigida = ref([]);
  const itensNaoEncontrados = ref([]);
  const header = [
    { value: "cod", fontWeight: "bold" },
    { value: "descricao", fontWeight: "bold" },
    { value: "ncm", fontWeight: "bold" },
    { value: "ncm origem", fontWeight: "bold" },
    { value: "rating", fontWeight: "bold" },
  ];

  const uploadBd = async () => {
    itemsBd.value = [];
    readXlsxFile(excelBd.value).then((rows) => {
      rows.forEach((row, index) => {
        if (index > 0) {
          itemsBd.value.push({
            descricao: row[0],
            ncm: row[1],
          });
        }
      });
    });
  };

  const uploadProdutos = async () => {
    itemsCorrecao.value = [];
    readXlsxFile(excelCorrecao.value).then((rows) => {
      rows.forEach((row, index) => {
        if (index > 0) {
          itemsCorrecao.value.push({
            codigo: row[0],
            descricao: row[1],
            ncm: row[2],
          });
        }
      });
    });
  };

  const analisar = async () => {
    loading.value = true;
    progresso.value = 0;

    const total = itemsCorrecao.value.length;
    totalItens.value = total;

    const resultado = [];

    for (let i = 0; i < total; i++) {
      const produto = itemsCorrecao.value[i];
      const corrigido = corrigirProduto(produto, itemsBd.value);
      resultado.push(corrigido);

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

  TODO: "separar essa função em outro arquivo";
  const corrigirProduto = (
    produto,
    bancoDeDados,
    descricaoKey = "descricao",
    ncmKey = "ncm"
  ) => {
    const descricao = String(produto[descricaoKey] || "sem descricao")
      .toLowerCase()
      .trim();
    const ncmAtual = produto[ncmKey]?.toString().trim();

    const candidatos = bancoDeDados.filter(
      (p) =>
        p[ncmKey] &&
        String(p[descricaoKey] || "")
          .toLowerCase()
          .trim()
    );

    if (candidatos.length === 0) {
      produto.origemNcm = "NCM não encontrado no banco de dados";
      return produto;
    }

    const descricoes = candidatos.map((p) =>
      String(p[descricaoKey] || "")
        .toLowerCase()
        .trim()
    );

    const resultado = findBestMatch(descricao, descricoes);

    if (resultado.bestMatch.rating < 0.52) {
      if (!produto.ncm) {
        produto.origemNcm = "Sem correspondência com confiança mínima";
      }
      produto.origemNcm = "Sem correspondência com confiança mínima";
      return produto;
    }

    const melhorIndice = resultado.bestMatchIndex;
    const produtoSimilar = candidatos[melhorIndice];
    const ncmSugerido = produtoSimilar[ncmKey];

    if (ncmAtual) {
      if (ncmAtual === ncmSugerido.toString()) {
        produto[ncmKey] = ncmAtual;
        produto.origemNcm = `NCM Correto! (NCM: ${ncmAtual})`;
        itensNaoCorrigidos.value.push(produto);
        return produto;
      }

      if (resultado.bestMatch.rating > 0.65) {
        produto[ncmKey] = ncmSugerido.toString();
        produto.origemNcm = `Corrigido (NCM: ${ncmSugerido}) com base em ${produtoSimilar[descricaoKey]}, ncm anterior ${ncmAtual}`;
        produto.rating = resultado.bestMatch.rating;
        itensCorrigidos.value.push(produto);
        return produto;
      }

      produto.origemNcm = `Não alterado (NCM: ${ncmAtual})`;
      return produto;
    }

    produto[ncmKey] = ncmSugerido.toString();
    produto.origemNcm = `Sugerido (NCM: ${ncmSugerido}) com base em ${produtoSimilar[descricaoKey]}`;
    produto.rating = resultado.bestMatch.rating;
    itensCorrigidos.value.push(produto);
    return produto;
  };

  const gerarExcel = async () => {
    rows.length = 0;
    const fileName = currentTime.value;
    rows.push(header);
    itemsCorrecao.value.forEach((item) => {
      const row = [
        { type: Number, value: Number(item.codigo) },
        { type: String, value: String(item.descricao || "") },
        { type: String, value: String(item.ncm || "") },
        { type: String, value: String(item.origemNcm || "") },
        { type: Number, value: Number(item.rating || 0) },
      ];
      rows.push(row);
    });
    try {
      await writeXlsxFile(rows, { fileName: `${fileName}.xlsx` });
      $toast.success("Arquivo gerado com sucesso!");
    } catch (error) {
      $toast.error(
        "Erro ao gerar arquivo excel. por favor, verifique seu arquivo de produtos e tente novamente"
      );
      console.log(error);
    }
  };
</script>
