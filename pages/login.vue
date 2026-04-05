<template>
  <v-container fluid class="h-screen">
    <v-form validate-on="input lazy" ref="form" @submit.prevent>
      <div class="w-50 mx-auto">
        <v-card class="pa-4">
          <v-card-title class="text-center my-4">Login</v-card-title>
          <v-card-item>
            <TextInput
              :rules="[rules.email, rules.required]"
              class="mt-2"
              label="Email"
              hint="Digite seu email"
              v-model="email" />

            <TextInput
              :rules="[rules.required]"
              class="mt-2"
              :icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              hint=""
              label="Senha"
              counter
              @click:append="showPassword = !showPassword"
              @keyup.enter="acessar" />
          </v-card-item>
          <v-card-item>
            <v-btn :loading="loading" @click="acessar" block color="primary"
              >entrar</v-btn
            >
          </v-card-item>
        </v-card>
      </div>
    </v-form>
  </v-container>
</template>
<script setup lang="ts">
  definePageMeta({
    layout: "public",
  });

  const { $toast } = useNuxtApp();
  const { login } = useLogin();
  const mainStore = useMainStore();
  const { loading } = storeToRefs(mainStore);
  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);

  const showPassword = ref(false);
  const password = ref("");
  const email = ref("");
  const form = ref<any>();

  const rules = {
    required: (v: string) => !!v || "Campo obrigatório!",
    email: (v: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ||
      "Digite um e-mail válido (ex: seu-nome@email.com)",
  };

  const acessar = async () => {
    const { valid, errors } = await form.value.validate();
    if (!valid) {
      for (const erro of errors) {
        $toast.error(erro.errorMessages[0]);
      }
      return;
    }
    await login(email.value, password.value);
  };

  onMounted(() => {
    if (user.value) {
      useRouter().push("/");
    }
  });
</script>
