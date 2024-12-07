<template>
  <div>
    <nuxt-page v-if="accessGranted" />
    <div v-else>
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

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