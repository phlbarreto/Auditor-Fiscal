<template>
  <v-dialog
    persistent
    :overlay="false"
    max-width="500px"
    transition="dialog-bottom-transition">
    <v-card class="pa-4 text-center">
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        <slot />
      </v-card-text>
      <v-card-item>
        <div class="flex justify-between mx-12">
          <v-btn @click="confirm" size="small" color="primary">{{
            textConfirm
          }}</v-btn>
          <v-btn @click="cancel" size="small" variant="tonal" color="error">{{
            textCancel
          }}</v-btn>
        </div>
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
    textConfirm: {
      type: String,
      default: "textConfirm",
    },
    textCancel: {
      type: String,
      default: "textCancel",
    },
  });

  const emit = defineEmits(["confirm", "cancel"]);

  const confirm = () => emit("confirm");
  const cancel = () => emit("cancel");
</script>
