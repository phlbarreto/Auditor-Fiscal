<template>
  <v-text-field
    :append-icon="icon"
    :type="inputType"
    class="input-group--focused"
    :hint="hint"
    :label="label"
    :name="label"
    variant="outlined"
    density="compact" />
</template>
<script setup lang="ts">
  defineProps({
    icon: {
      type: String,
      default: "mdi-account",
    },
    inputType: {
      type: String,
      default: "text",
    },
    hint: {
      type: String,
      default: "Mensagem de ajuda (hint)",
    },
    label: {
      type: String,
      default: "Label do input",
    },
  });
</script>
