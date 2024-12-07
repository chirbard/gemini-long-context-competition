<template>

  <div>
    <SpeedInsights />
    <nuxt-page v-if="accessGranted" />
    <div v-else>
      <router-view />
    </div>
  </div>
</template>

<script setup>
import "@fontsource/poppins";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { SpeedInsights } from '@vercel/speed-insights/vue';

const accessGranted = ref(false);
const router = useRouter();

onMounted(() => {
  if (localStorage.getItem("accessGranted") === "true") {
    accessGranted.value = true;
  } else {
    router.push("/code-entry");
  }
});
</script>
<style>
* {
  font-family: 'Poppins', Arial, sans-serif;
}
</style>