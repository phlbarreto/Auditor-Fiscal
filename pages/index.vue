<template>
  <v-container fluid grid-list-xs class="bg-neutral-300 pa-16">
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
          class="mx-4"
          href="/auditor"
          color="primary"
          appendIcon="mdi-arrow-top-right-thick"
          >Auditor - ICMS</v-btn
        >
        <v-btn
          href="/corrigir-ncm"
          color="primary"
          appendIcon="mdi-arrow-top-right-thick"
          >Corrigir NCM</v-btn
        >
      </div>
    </v-card>
  </v-container>
</template>
<script setup></script>
