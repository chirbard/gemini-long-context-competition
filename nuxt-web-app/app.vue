<template>

  <div class="app">
    
    <nuxt-page />
  </div>
</template>

<script>
import "@fontsource/poppins";

export default {
  head() {
    return {
      title: 'juur.ai'
    };
  },
  methods: {
    goToHome() {
      this.$router.push('/');
    }
  }
}
</script>



<style>
.app {
  font-family: 'Poppins';
}
</style>