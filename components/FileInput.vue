<template>
  <v-file-input
    :label="label"
    :accept="accept"
    variant="outlined"
    density="compact"
    :multiple="multiple" />
</template>
<script setup lang="ts">
  defineProps({
    label: {
      type: String,
      default: "Label aqui",
    },
    accept: {
      type: String,
      default: ".xlsx, .xls",
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  });
</script>
