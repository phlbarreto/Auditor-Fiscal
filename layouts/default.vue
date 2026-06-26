<template>
  <div class="flex flex-col min-h-screen">
    <SpinnerCircle />
    <Header />
    <div class="flex-grow container mx-auto px-4 py-6">
      <slot />
    </div>
    <Footer />
  </div>
</template>
