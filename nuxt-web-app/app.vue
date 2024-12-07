<template>
  <div>
    <!-- Add the routing button here -->
    <button @click="goToHome">Go to Home</button>
    <nuxt-page />
  </div>
</template>

<script>
export default {
  methods: {
    goToHome() {
      this.$router.push('/');
    }
  }
}
</script>
