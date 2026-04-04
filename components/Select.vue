<template>
  <v-select
    density="compact"
    :clearable="clearable"
    :label="label"
    :items="items"
    variant="outlined" />
</template>
<script setup lang="ts">
  defineProps({
    items: {
      type: Array,
      default: ["opcao 1", "opcao 2"],
    },
    label: {
      type: String,
      default: "Label aqui",
    },
    clearable: {
      type: Boolean,
      default: true,
    },
  });
</script>
