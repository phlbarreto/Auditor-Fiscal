<template>
  <div class="bg-sky-300 w-full h-10 elevation-2">
    <v-btn
      @click="goHome"
      class="text-capitalize"
      variant="plain"
      :ripple="false">
      <span class="mx-2 font-bold">Auditor Fiscal</span>
    </v-btn>
  </div>
</template>
<script setup lang="ts">
  const router = useRouter();
  const goHome = () => {
    router.push("/");
  };
</script>
