<template>
    <div class="chat-container">
        <div class="intro">
            <img src="/images/logo.svg" alt="juurikas" />
            <h1>juur.ai</h1>
        </div>
        <div class="messages">
            <div v-for="(msg, index) in messages" :key="index" class="message"
                :class="{ left: msg.role === 'model', right: msg.role !== 'model' }">
                {{ msg.parts[0].text }}
                <p class="time">{{ formatTime(msg.timestamp) }}</p>
            </div>
        </div>

        <div class="userInput">
            <form @submit.prevent="sendMessage">
                <input v-model="userInput" type="text" placeholder="Ask Juurikas" class="input" />
                <button type="submit" class="button"></button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useFetch } from "#app";

const messages = ref([
    {
        role: "model",
        parts: [
            { text: "Tere, Ma olen Juurikas. Sinu abiline, et paremini seaduseid leida." },
        ],
        timestamp: new Date().toISOString()
    },
]);
const userInput = ref("");

const sendMessage = async () => {
    if (!userInput.value.trim()) return;

    let messageHistory = JSON.parse(JSON.stringify(messages.value)); // deep copy of messages
    const prompt = userInput.value;

    // remove timestamps from message history
    messageHistory = messageHistory.map((msg) => {
        delete msg.timestamp;
        return msg;
    });

    // message history to json string
    messageHistory = JSON.stringify(messageHistory);
    console.log(messageHistory);

    userInput.value = "";

    // Add the user's message to the chat
    messages.value.push({ role: "user", parts: [{ text: prompt }], timestamp: new Date().toISOString() });

    // Send the prompt to the API
    const { data, error } = await useFetch("/api/chat", {
        method: "POST",
        body: { messageHistory: messageHistory, prompt: prompt },
    });

    if (error.value) {
        messages.value.push({ role: "model", parts: [{ text: "Sorry, something went wrong." }], timestamp: new Date().toISOString() });
        console.error(error.value);
    } else {
        messages.value.push({ role: "model", parts: [{ text: data.value.response }], timestamp: new Date().toISOString() });
    }
};
const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

</script>

<style scoped>
.chat-container {
    max-width: 600px;
    /* height: calc(100vh - 16px); */
    margin: 0 auto;
    padding: 0px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: calc(100vh - env(safe-area-inset-bottom) - env(safe-area-inset-top));
}

.intro {
    margin-bottom: 20px;
    height: 50px;
    display: flex;
    align-items: center;
}

.intro img {
    width: 40px;
    margin-right: 10px;
}

.messages {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
    height: 100%;
    overflow-y: auto;
    background: transparent;
    border: none;
}

.message {
    margin-bottom: 10px;
}

.message.left {
    max-width: 80%;
    width: fit-content;
    padding: 8px;
    text-align: left;
    border: #ccc 1px solid;
    border-radius: 16px;
    display: flex;
    flex-direction: row;

}

.message.right {
    margin-left: auto;
    max-width: 80%;
    width: fit-content;
    padding: 8px;
    color: white;
    background-color: #16568B;
    text-align: left;
    border-radius: 16px;
    display: flex;
    flex-direction: row;

}

.time {
    font-size: 11px;

    padding-left: 8px;
    color: #a6a6a6;
    text-align: right;
    margin: 4px 0 0 0;
    display: flex;
    flex-direction: column;
    justify-content: end;
}

.userInput {
    border: #ccc 1px solid;
    border-radius: 16px;
    padding: 10px;
}

.input {
    width: calc(100% - 42px);
    color: grey;
    padding: 8px 4px;
    background-color: transparent;
    border: none;
}

.input:focus {
    outline: none;
}

.button {
    padding: 10px;
    width: 28px;
    height: 28px;
    border: none;
    cursor: pointer;
    display: none;
    background-image: url('/images/send.svg');
    background-color: transparent;
}

.button:hover {
    filter: invert(31%) sepia(100%) saturate(748%) hue-rotate(176deg) brightness(95%) contrast(101%);
}

@media only screen and (min-width: 768px) {
    .chat-container {
        height: calc(100vh - 48px);
        padding: 16px;
    }

    .message.left {
        padding: 12px;
    }

    .message.right {
        padding: 12px;
    }

    .button {
        display: inline-block;
    }

    .input {
        width: calc(100% - 36px);
    }
}
</style>