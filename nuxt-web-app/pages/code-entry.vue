<template>
  <div class="code-entry-container">
    <img src="/images/logo.svg" alt="juurikas" />
    <!-- <h2>Enter access code to continue</h2> -->
    <form @submit.prevent="validateCode" class="input-group">
      <label class="input-group__label">Enter access code to continue</label>
      <input v-model="accessCode" type="text" placeholder="Enter code" class="input input-group__input" />
      <button type="submit" class="button">Submit</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useFetch } from "#app";

const accessCode = ref("");
const errorMessage = ref("");
const router = useRouter();
const route = useRoute();

const validateCode = async () => {
  const { data, error } = await useFetch("/api/validate-code", {
    method: "POST",
    body: { code: accessCode.value },
  });

  if (error.value || !data.value.valid) {
    errorMessage.value = data.value.message || "Invalid code. Please try again.";
  } else {
    localStorage.setItem("accessGranted", "true");
    router.push("/");
  }
};

onMounted(() => {
  const codeParam = route.query.code;
  if (codeParam) {
    accessCode.value = codeParam;
    validateCode();
  }
});
</script>

<style scoped>
.code-entry-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 1em;
}

p {
  color: red;
  font-size: 0.8em;
  margin: 0;
  padding: 0;
  text-align: center;
}

img {
  width: 60px;
  height: 60px;
}

button {
  background-color: #16568B;
  border-radius: 8px;
  border-style: none;
  box-sizing: border-box;
  color: #FFFFFF;
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  font-weight: 500;
  height: 40px;
  line-height: 20px;
  list-style: none;
  margin: 0;
  outline: none;
  padding: 10px 16px;
  position: relative;
  text-align: center;
  text-decoration: none;
  transition: color 100ms;
  vertical-align: baseline;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

button:hover,
button:focus {
  background-color: #1c6daf;
}

.input-group {
  width: 96%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  z-index: 2;
  gap: 1em;
}

@supports (mix-blend-mode: darken) {
  .input-group {
    position: relative;
    mix-blend-mode: lighten;
  }

  .input-group__label {
    position: absolute;
    left: 1.5em;
    top: -0.28em;
    background: #fff;
  }
}

.input-group__label {
  padding: 0 0.5em;
  margin-bottom: 0.5em;
  text-transform: uppercase;
  font-size: 0.6em;
  letter-spacing: 0.1em;
  font-weight: 700;
  color: #444;
  cursor: pointer;
}

.input-group__input {
  color: #000;
  font-size: 1rem;
  line-height: 1;
  border-style: none;
  outline: none;
  padding: 1em;
  border: 2px solid #16568B;
  border-radius: 1em;
}
</style>