<template>
  <div class="p-6 space-y-6 h-screen">
    <h2 class="text-xl font-semibold ml-10">Leitor de XML</h2>

    <!-- Upload múltiplo -->
    <div>
      <FileInput
        label="Selecione o(s) arquivo(s) xmls"
        type="file"
        accept=".xml"
        :multiple="true"
        class="w-50"
        @change="onFilesChange" />
    </div>

    <!-- Loading -->
    <p v-if="xml.loading.value" class="text-gray-500 text-sm animate-pulse">
      Processando arquivos...
    </p>

    <!-- Resumo do batch -->
    <div v-if="xml.batch.value.total > 0" class="space-y-4">
      <div class="text-sm text-gray-600">
        <strong>{{ xml.batch.value.total }}</strong> arquivo{{
          getPlural()
        }}
        processado{{ getPlural() }} —
        <span class="text-green-600 font-medium"
          >{{ xml.batch.value.succeeded.length }} ok</span
        >
        <br />
        <div>
          <span
            >Total de
            <strong>{{ xml.batch.value.produtos.length }}</strong> produtos
            processados</span
          >
          <v-btn size="x-small" @click="gerarExcel()" class="ml-4"
            >gerar excel</v-btn
          >
        </div>
        <span v-if="xml.batch.value.failed.length > 0">
          ,
          <span class="text-red-600 font-medium"
            >{{ xml.batch.value.failed.length }} com erro</span
          >
        </span>
      </div>

      <!-- Arquivos com erro -->
      <div v-if="xml.batch.value.failed.length > 0" class="space-y-2">
        <h3 class="text-sm font-medium text-red-700">Arquivos com erro</h3>
        <div
          v-for="f in xml.batch.value.failed"
          :key="f.fileName"
          class="flex items-start gap-2 bg-red-50 border border-red-200 rounded p-3 text-sm">
          <span class="text-red-500 mt-0.5">✕</span>
          <div>
            <p class="font-medium text-red-800">{{ f.fileName }}</p>
            <p class="text-red-600 text-xs mt-0.5">{{ f.error }}</p>
          </div>
        </div>
      </div>

      <!-- Arquivos com sucesso -->
      <div v-if="xml.batch.value.succeeded.length > 0" class="space-y-3">
        <h3 class="text-sm font-medium text-green-700">Arquivos carregados</h3>
        <div
          v-for="f in xml.batch.value.succeeded"
          :key="f.fileName"
          class="border border-green-200 rounded overflow-hidden">
          <button
            class="w-full flex items-center justify-between px-3 py-2 bg-green-50 hover:bg-green-100 text-sm text-left"
            @click="toggle(f.fileName)">
            <span class="flex items-center gap-2">
              <span class="text-green-600">✓</span>
              <span class="font-medium">{{ f.fileName }}</span>
            </span>
            <span class="text-gray-400 text-xs">{{
              expanded === f.fileName ? "▲" : "▼"
            }}</span>
          </button>
          <div v-if="expanded === f.fileName" class="p-3 bg-white">
            <pre
              class="text-xs overflow-auto max-h-64 bg-gray-50 rounded p-2"
              >{{ JSON.stringify(f.data, null, 2) }}</pre
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { BaseProdutoNcm } from "~/interface/produto";
  const { currentTime } = useCurrentTime();
  const xml = useXml({ includeAttributes: true, parseNumbers: true });
  const expanded = ref<string | null>(null);

  function toggle(fileName: string) {
    expanded.value = expanded.value === fileName ? null : fileName;
  }

  async function onFilesChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      expanded.value = null;
      await xml.fromFiles(files);
    }
  }

  const getPlural = () => {
    return xml.batch.value.total > 1 ? "s" : "";
  };

  const gerarExcel = async () => {
    const nomeArquivo = `BaseNcm-${currentTime.value}`;
    const header = [
      { value: "descricao", fontWeight: "bold" },
      { value: "ncm", fontWeight: "bold" },
      { value: "ref", fontWeight: "bold" },
      { value: "barra", fontWeight: "bold" },
      { value: "cfop", fontWeight: "bold" },
    ];
    const itens = (item: BaseProdutoNcm) => {
      const row = [
        { type: String, value: String(item.descricao) },
        { type: String, value: String(item.ncm) },
        { type: String, value: String(item.ref) },
        { type: String, value: String(item.barra) },
        { type: String, value: String(item.cfop) },
      ];
      return row;
    };

    await writeExcel(xml.produtos.value, header, nomeArquivo, itens);
  };
</script>
