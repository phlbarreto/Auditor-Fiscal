<template>
  <v-overlay class="align-center justify-center" persistent>
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
</template>
<script setup lang="ts">
  defineProps({
    progresso: {
      type: Number,
      default: 0,
    },
  });
</script>
