<template>
  <v-container class="bg-neutral-300">
    <Switch title="Regime" trueValue="Simples" falseValue="Normal" />
    <v-card class="mx-4 my-6">
      <v-card-title> Auditor Fiscal </v-card-title>
      <v-card-item class="my-2">
        <p>
          Anexo 1 de Substituição Tributária é o arquivo que contém as regras de
          substituição tributária e os detalhes necessários para comparar a
          tributação.
        </p>
        <br />
        <p>
          A base de produtos deve conter as colunas obrigatórias: Código, NCM e
          CSO nessa ordem.
        </p>
        <br />
        <p>Ambos no formato Excel (.xlsx).</p>
      </v-card-item>
    </v-card>
    <v-file-input
      v-model="excelFileAnexo"
      label="Anexo 1 substituição tributária"
      @change="uploadAnexo1"
      accept=".xlsx, .xls" />
    <v-file-input
      v-model="excelFileProduto"
      :label="`Arquivo de produtos (Codigo | NCM | ${codTibutacao})`"
      @change="uploadProdutos"
      accept=".xlsx, .xls" />
    <div class="flex justify-center align-center">
      <div v-if="itemsAnexo1.length > 0" class="mr-10">
        Numero de NCMs no anexo: {{ numeroNcmAnexo }}
      </div>
      <div v-if="itemsProdutos.length > 0">
        Numero de Produtos: {{ itemsProdutos.length }}
      </div>
    </div>
    <div v-if="itemsAnexo1.length > 0 && itemsProdutos.length > 0" class="ma-4">
      <v-btn color="primary" @click="auditar" block>Auditar</v-btn>
    </div>
    <div v-if="produtosCorrigidos.length > 0" class="mx-4 my-6">
      <v-card>
        <v-card-title primary-title> Resultado </v-card-title>
        <div class="flex justify-center align-center">
          <div class="mb-4">
            <v-chip color="green" size="large" elevation="5" class="mr-4">{{
              tributacaoDiferente
            }}</v-chip>
            Produtos corrigidos
          </div>
        </div>
        <v-container>
          <v-row class="d-flex align-center justify-center">
            <v-col cols="4">
              <v-textarea
                variant="outlined"
                v-model="codProdutosDiferentes"
                label="Codigos corrigidos"
                readonly></v-textarea>
            </v-col>
            <v-col cols="4">
              <v-btn
                @click="copiarCodigos"
                color="primary"
                append-icon="mdi-content-copy">
                Copiar
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4">
              <v-dialog
                maxWidth="500"
                v-model="detalhesModal"
                scrollable
                transition="dialog-bottom-transition"
                class="text-center">
                <v-card>
                  <v-card-title>
                    Produtos Corrigidos
                    <v-btn
                      @click="detalhesModal = false"
                      class="position-absolute right-2"
                      icon="mdi-close-thick"
                      size="x-small"></v-btn>
                  </v-card-title>
                  <v-card-text>
                    <v-card-item> Codigo - NCM - CST </v-card-item>
                    <v-card-item
                      v-for="produto in produtosCorrigidos"
                      :key="produto.id">
                      {{ produto.cod }} - {{ produto.ncm }} -
                      <span class="font-weight-bold text-green">
                        {{ produto.cst }}
                      </span>
                    </v-card-item>
                  </v-card-text>
                </v-card>
              </v-dialog>
            </v-col>
            <v-col cols="3" class="mx-8">
              <v-btn
                color="primary"
                @click="gerarExcel"
                appendIcon="mdi-cloud-download-outline"
                >Gerar Excel</v-btn
              >
            </v-col>
            <v-col cols="3">
              <v-btn @click="detalhes" append-icon="mdi-arrow-top-right-thick">
                Mais detalhes
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </div>
    <pre></pre>
  </v-container>
</template>
<script setup>
  import readXlsxFile from "read-excel-file";
  import writeXlsxFile from "write-excel-file";
  import { compararNcm, compararProdutos } from "~/utils/comparacao";
  const mainStore = useMainStore();
  const { switchState } = storeToRefs(mainStore);
  const codTibutacao = computed(() => {
    if (switchState.value) {
      return "CSO";
    }
    return "CST";
  });
  const { $toast } = useNuxtApp();
  const { currentTime } = useCurrentTime();
  const excelFileAnexo = ref([]);
  const excelFileProduto = ref([]);
  const itemsAnexo1 = ref([]);
  const itemsProdutos = ref([]);
  const produtosCorrigidos = ref([]);
  const tributacaoDiferente = ref({});
  const codProdutosDiferentes = ref([]);
  const produtosCorretos = ref([]);
  const produtosIncorretos = ref([]);
  const detalhesModal = ref(false);
  const rows = [];
  const header = [
    { value: "cod", fontWeight: "bold" },
    { value: "ncm", fontWeight: "bold" },
    { value: "cst", fontWeight: "bold" },
    { value: "cso", fontWeight: "bold" },
    { value: "cfop", fontWeight: "bold" },
  ];

  const detalhes = () => {
    detalhesModal.value = true;
  };

  const copiarCodigos = async () => {
    try {
      await navigator.clipboard.writeText(codProdutosDiferentes.value);
      $toast.success("Codigos copiados!");
    } catch (err) {
      $toast.error("Erro ao copiar os codigos :(");
    }
  };

  const numeroNcmAnexo = computed(() => {
    let numeroNcm = 0;
    itemsAnexo1.value.forEach((row, index) => {
      if (index > 0) {
        if (row.ncm) {
          numeroNcm += 1;
        }
      }
    });
    return numeroNcm;
  });

  const uploadAnexo1 = async () => {
    readXlsxFile(excelFileAnexo.value).then((rows) => {
      rows.forEach((row, index) => {
        if (index > 0 && row[2]) {
          itemsAnexo1.value.push({
            id: row[0],
            cest: row[1],
            ncm: row[2],
            descricao: row[3],
            acordos: row[4],
            mva_ajustada: row[5],
            mva_original: row[6],
          });
        }
      });
    });
  };
  const uploadProdutos = async () => {
    readXlsxFile(excelFileProduto.value).then((rows) => {
      rows.forEach((row, index) => {
        if (index > 0) {
          itemsProdutos.value.push({
            cod: row[0],
            ncm: row[1],
            cso: row[2],
          });
        }
      });
    });
  };

  TODO: 'função nao funcionando 100%'
  const auditar = async () => {
    const resultadoComparacao = compararNcm(
      itemsAnexo1.value,
      itemsProdutos.value
    );
    produtosCorrigidos.value = resultadoComparacao;

    const produtosComparados = compararProdutos(
      itemsProdutos.value,
      resultadoComparacao
    );

    tributacaoDiferente.value = produtosComparados.tributacaoDiferente;
    codProdutosDiferentes.value = produtosComparados.codProdutoDiferente;
    produtosCorretos.value = produtosComparados.produtosCorretos;
    produtosIncorretos.value = produtosComparados.produtosIncorretos;
  };

  const gerarExcel = async () => {
    const fileName = currentTime.value;
    rows.push(header);
    produtosCorrigidos.value.forEach((item) => {
      let row = [];
      row.push(
        { type: Number, value: Number(item.cod || 0) },
        { type: String, value: String(item.ncm || "") },
        { type: String, value: String(item.cst || "") },
        { type: String, value: String(item.cso || "") },
        { type: String, value: String(item.cfop || "") }
      );
      rows.push(row);
    });
    try {
      await writeXlsxFile(rows, { fileName: `${fileName}.xlsx` });
      itemsProdutos.value = [];
      $toast.success("Arquivo gerado com sucesso!");
    } catch (error) {
      $toast.error(
        "Erro ao gerar arquivo excel. por favor, verifique seu arquivo de produtos e tente novamente"
      );
      console.log(error);
    }
  };
</script>
