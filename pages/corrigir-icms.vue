<template>
  <v-container>
    <Switch
      class="ml-4"
      title="Regime"
      trueValue="Simples Nacional"
      falseValue="Normal (Real/Presumido)" />
    <v-card class="mx-4 my-6">
      <v-card-title> Correção do ICMS</v-card-title>
      <v-card-item class="my-2">
        <p>
          Anexo 1 de Substituição Tributária é o arquivo que contém as regras de
          substituição tributária e os detalhes necessários para comparar a
          tributação.
        </p>
        <br />
        <p>
          A base de produtos deve conter as colunas obrigatórias: Código, NCM e
          {{ codTibutacao }} nessa ordem.
        </p>
        <span class="text-gray-500"
          >ambos arquivos no formato Excel (.xlsx).</span
        >
      </v-card-item>

      <div class="mx-4">
        <FileInput
          v-model="excelFileAnexo"
          label="Anexo 1 substituição tributária"
          @change="uploadAnexoSefaz"
          accept=".xlsx, .xls" />

        <FileInput
          v-model="excelFileProduto"
          :label="`Arquivo de produtos (Codigo | NCM | ${codTibutacao})`"
          @change="uploadProdutos"
          accept=".xlsx, .xls" />

        <div class="flex justify-center align-center">
          <div v-if="quantidadeNcmsAnexo > 0" class="mr-10">
            Quantidade de NCMs no anexo: {{ quantidadeNcmsAnexo }}
          </div>
          <div v-if="produtosParaAuditar.length > 0">
            Numero de Produtos: {{ produtosParaAuditar.length }}
          </div>
        </div>

        <div
          v-if="quantidadeNcmsAnexo > 0 && produtosParaAuditar.length > 0"
          class="my-4">
          <v-btn color="primary" @click="auditar" block>Auditar</v-btn>
        </div>
      </div>
    </v-card>
    <div v-if="produtosCorrigidos.length > 0" class="mx-4 my-6">
      <v-card>
        <v-card-title primary-title> Resultado </v-card-title>
        <div class="flex justify-center align-center">
          <div class="mb-4">
            <v-chip color="green" size="large" elevation="5" class="mr-4">{{
              resTributacaoDiferente
            }}</v-chip>
            Produtos corrigidos
          </div>
        </div>
        <v-container>
          <v-row class="d-flex align-center justify-center">
            <v-col cols="4">
              <v-textarea
                variant="outlined"
                v-model="resCodigosProdutosIncorretos"
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
                    Produtos incorretos
                    <v-btn
                      @click="detalhesModal = false"
                      class="position-absolute right-2"
                      icon="mdi-close-thick"
                      size="x-small"></v-btn>
                  </v-card-title>
                  <v-card-text>
                    <v-card-item>
                      Codigo - NCM - {{ codTibutacao }}
                    </v-card-item>
                    <v-card-item
                      v-for="produto in resProdutosIncorretos"
                      :key="produto.codigo">
                      {{ produto.codigo }} - {{ produto.ncm }} -
                      <span class="font-weight-bold text-green">
                        {{
                          regimeTributario === "simples"
                            ? produto.cso
                            : produto.cst
                        }}
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
  </v-container>
</template>

<script setup lang="ts">
  import type { Produto, ProdutoCorrigido } from "~/interface/produto";

  const { currentTime } = useCurrentTime();
  const mainStore = useMainStore();
  const { switchState } = storeToRefs(mainStore);

  const codTibutacao = computed(() => {
    if (switchState.value) {
      return "CSO";
    }
    return "CST";
  });

  const regimeTributario = computed(() => {
    return switchState.value ? "simples" : "normal";
  });

  const { $toast } = useNuxtApp();
  const excelFileAnexo = ref([]);
  const excelFileProduto = ref([]);
  const quantidadeNcmsAnexo = ref(0);
  const produtosParaAuditar = ref<Produto[]>([]);
  const produtosCorrigidos = ref<ProdutoCorrigido>([]);
  const resTributacaoDiferente = ref(0);
  const resCodigosProdutosIncorretos = ref<Array<number>>([]);
  const resProdutosCorretos = ref<Produto[]>([]);
  const resProdutosIncorretos = ref<Produto[]>([]);
  const detalhesModal = ref(false);

  const ncmsTratadosAnexoSefaz = ref<Set<string>>();

  const detalhes = () => {
    TODO: "Melhorar modal";

    detalhesModal.value = true;
  };

  const copiarCodigos = async () => {
    try {
      await navigator.clipboard.writeText(
        resCodigosProdutosIncorretos.value.toString(),
      );
      $toast.success("Codigos copiados!");
    } catch (err) {
      $toast.error("Erro ao copiar os codigos :(");
    }
  };

  const uploadAnexoSefaz = async () => {
    const columns = [
      "id",
      "cest",
      "ncm",
      "descricao",
      "acordos",
      "mva_ajustada",
      "mva_original",
    ];

    const { ncmsTratados, totalNcms } = await readAnexoSefaz(
      excelFileAnexo.value,
      columns,
    );
    quantidadeNcmsAnexo.value = totalNcms;
    ncmsTratadosAnexoSefaz.value = ncmsTratados;
  };

  const uploadProdutos = async () => {
    const tributacao = regimeTributario.value === "simples" ? "cso" : "cst";
    const columns = ["codigo", "ncm", tributacao];
    const excelProdutos = await readExcel(excelFileProduto.value, columns);
    produtosParaAuditar.value = excelProdutos;
  };

  const delay = () => new Promise((resolve) => setTimeout(resolve, 0));

  const auditar = async () => {
    await delay();

    const resultadoComparacao = compararNcm(
      ncmsTratadosAnexoSefaz.value,
      produtosParaAuditar.value,
      regimeTributario.value,
    );

    produtosCorrigidos.value = resultadoComparacao;

    await delay();

    const {
      codigosProdutosIncorretos,
      produtosCorretos,
      produtosIncorretos,
      qtdTributacaoDiferente,
    } = compararProdutos(
      produtosParaAuditar.value,
      resultadoComparacao,
      regimeTributario.value,
    );

    resTributacaoDiferente.value = qtdTributacaoDiferente;
    resCodigosProdutosIncorretos.value = codigosProdutosIncorretos;
    resProdutosCorretos.value = produtosCorretos;
    resProdutosIncorretos.value = produtosIncorretos;
  };

  const gerarExcel = async () => {
    const nomeArquivo = `ProdutosAuditados-${currentTime.value}.xlsx`;
    const header = [
      { value: "Codigo", fontWeight: "bold" },
      { value: "NCM", fontWeight: "bold" },
      { value: "CST", fontWeight: "bold" },
      { value: "CFOP", fontWeight: "bold" },
    ];

    regimeTributario.value === "normal"
      ? header.push({ value: "ICMS", fontWeight: "bold" })
      : header.push({ value: "CSO", fontWeight: "bold" });
    const itens = (item: any) => {
      const row = [
        { type: String, value: String(item.codigo) },
        { type: String, value: String(item.ncm) },
        { type: String, value: String(item.cst) },
        { type: String, value: String(item.cfop) },
      ];

      regimeTributario.value === "simples"
        ? row.push({ type: String, value: String(item.cso) })
        : row.push({ type: String, value: String(item.icms) });

      return row;
    };

    try {
      await writeExcel(produtosCorrigidos.value, header, nomeArquivo, itens);

      $toast.success("Arquivo gerado com sucesso!");
    } catch (error) {
      $toast.error(
        "Erro ao gerar arquivo excel. por favor, verifique seu arquivo de produtos e tente novamente",
      );
    }
  };
</script>
