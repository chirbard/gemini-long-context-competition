<template>
  <div class="code-entry-container">
    <h1>Enter Access Code</h1>
    <form @submit.prevent="validateCode">
      <input v-model="accessCode" type="text" placeholder="Enter code" class="input" />
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

<style>
.code-entry-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  font-family: Arial, sans-serif;
}

.input {
  width: calc(100% - 20px);
  padding: 10px;
  margin-bottom: 10px;
}

.button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

.button:hover {
  background-color: #0056b3;
}

.error {
  color: red;
}
</style>