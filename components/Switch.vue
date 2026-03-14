<template>
  <v-switch
    v-model="switchState"
    :label="`${title}: ${switchState ? trueValue : falseValue}`"
    hide-details></v-switch>
</template>
<script setup>
  defineProps({
    title: {
      type: String,
      default: "titulo on",
    },
    trueValue: {
      type: String,
      default: "titulo on",
    },
    falseValue: {
      type: String,
      default: "titulo off",
    },
  });
  const mainStore = useMainStore();
  const { switchState } = storeToRefs(mainStore);
</script>
