<template>
  <v-dialog
    :overlay="false"
    max-width="500px"
    transition="dialog-top-transition">
    <v-card class="pa-4 text-center">
      <BtnClose @on-click="fechar" />
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        <slot />
      </v-card-text>
      <v-card-item>
        <v-btn
          @click="onClick()"
          color="primary"
          size="small"
          :append-icon="btnIcon"
          block
          >{{ btnName }}</v-btn
        >
      </v-card-item>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
  defineProps({
    title: {
      type: String,
      default: "title",
    },
    btnName: {
      type: String,
      default: "btnName",
    },
    btnIcon: { type: String, default: "mdi-plus" },
  });

  const emit = defineEmits(["onClick", "onFechar"]);

  const onClick = () => emit("onClick");
  const fechar = () => emit("onFechar");
</script>
