<template>
  <v-btn
    @click="onClick"
    size="small"
    flat
    icon="mdi-close-thick"
    class="position-absolute right-2 top-1"
    v-tooltip:top="'Fechar'" />
</template>
<script setup lang="ts">
  const emit = defineEmits(["onClick"]);
  const onClick = () => emit("onClick");
</script>
