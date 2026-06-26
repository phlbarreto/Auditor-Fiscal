<template>
  <footer class="w-full bg-gray-800 text-white border-t border-gray-700 mt-auto">
    <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
      <p class="text-sm text-gray-400 select-none">
        &copy; {{ ano }} · Auditor Fiscal · Todos os direitos reservados.
      </p>

      <nav aria-label="Links externos" class="flex items-center gap-2">
        <NuxtLink to="https://github.com/phlbarreto/Auditor-Fiscal" external target="_blank" rel="noopener noreferrer"
          class="text-gray-400 hover:text-white transition-colors duration-200" aria-label="Repositório no GitHub">
          <v-icon size="24">mdi-github</v-icon>
        </NuxtLink>
      </nav>
    </div>
  </footer>
</template>

<script setup lang="ts">
  const ano = computed(() => new Date().getFullYear())
</script>