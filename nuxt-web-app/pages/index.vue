<template>
    <div class="chat-container">
        <h1>Chat with Google Generative AI</h1>
        <div class="messages">
            <div v-for="(msg, index) in messages" :key="index" class="message">
                <strong>{{ msg.role }}:</strong> {{ msg.parts[0].text }}
            </div>
        </div>
        <form @submit.prevent="sendMessage">
            <input v-model="userInput" type="text" placeholder="Type your message..." class="input" />
            <button type="submit" class="button">Send</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useFetch } from "#app";

// const messages = ref([
//     { role: "AI", text: "Hello! How can I assist you today?" },
// ]);
const messages = ref([
    // {
    //     role: "user",
    //     parts: [{ text: "Hello, i have 2 dogs" }],
    // },
    {
        role: "model",
        parts: [
            { text: "Tere! Kuidas saan ma sind aidata?" },
        ],
    },
],);
const userInput = ref("");

const sendMessage = async () => {
    if (!userInput.value.trim()) return;

    const messageHistory = messages.value;
    const prompt = userInput.value;

    // Add the user's message to the chat
    messages.value.push({ role: "user", parts: [{ text: userInput.value }] });

    // Send the prompt to the API
    const { data, error } = await useFetch("/api/chat", {
        method: "POST",
        body: { messageHistory: messageHistory, prompt: prompt },
    });

    if (error.value) {
        // messages.value.push({ role: "AI", text: "Sorry, something went wrong." });
        messages.value.push({ role: "model", parts: [{ text: "Sorry, something went wrong." }] });
        console.error(error.value);
    } else {
        // messages.value.push({ role: "AI", text: data.value.response });
        messages.value.push({ role: "model", parts: [{ text: data.value.response }] });
    }

    userInput.value = ""; // Clear the input field
};
</script>

<style>
.chat-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
}

.messages {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
    height: 300px;
    overflow-y: auto;
    background: #f9f9f9;
}

.message {
    margin-bottom: 10px;
}

.input {
    width: calc(100% - 90px);
    padding: 10px;
    margin-right: 10px;
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
</style>