<template>
  <header class="bg-gray-800 text-white border-t border-gray-700 w-full h-12 elevation-2 flex justify-between">
    <v-btn @click="goTo('/')" class="text-capitalize" variant="plain" :ripple="false">
      <span class="mx-2 font-bold">Auditor Fiscal</span>
    </v-btn>

    <div class="mr-4 flex">
      <SpinnerDot class="mr-4" v-if="loading" />
      <div v-if="user">
        <v-menu open-on-hover>
          <template #activator="{ props }">
            <v-btn size="x-small" class="mt-2 text-capitalize text-subtitle-1" variant="plain" v-bind="props">{{
              user.name }}</v-btn>
          </template>
          <v-list>
            <v-list-item @click="item.action" v-for="(item, index) in userMenu" :key="index" :append-icon="item.icon"
              link>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <div v-else>
        <v-btn @click="goTo('/login')" variant="plain">Login</v-btn>
      </div>
    </div>
  </header>
</template>
<script setup lang="ts">
  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);
  const { logout } = useLogin();
  const mainStore = useMainStore();
  const { loading } = storeToRefs(mainStore);

  const router = useRouter();
  const goTo = (link: string) => {
    router.push(link);
  };

  const { fetchUserData } = useUser();

  onMounted(async () => {
    await fetchUserData();
  });

  const userMenu = [
    // { title: "Perfil", icon: "mdi-", action: goToProfile },
    { title: "Sair", icon: "mdi-logout", action: logout },
  ];

  // function goToProfile() {
  //   goTo("/perfil");
  // }
</script>
