<template>
  <div class="container">
    <div class="chat-container">
      <div class="intro">
        <img src="/images/logo.svg" alt="juurikas" />
        <h1>juur.ai</h1>
        <div class="icon-container">
          <a href="https://github.com/chirbard/gemini-long-context-competition" target="_blank" rel="noopener">
            <img src="/images/github-mark.svg" alt="github-mark"/>
          </a>
        </div>
      </div>
      <div class="messages">
        <div v-for="(msg, index) in messages" :key="index" class="message"
          :class="{ left: msg.role === 'model', right: msg.role !== 'model' }">
          <p class="message-text">{{ msg.parts[0].text }}</p>
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
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useFetch } from "#app";

const messages = ref([
  {
    role: "model",
    parts: [
      { text: "Tere, Ma olen Juurikas. Sinu isiklik juriidiline nõustaja." },
    ],
    timestamp: new Date().toISOString()
  },
]);
const userInput = ref("");
const isThinking = ref(false);

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

  // Show "thinking" placeholder
  isThinking.value = true;
  messages.value.push({
    role: "model",
    parts: [{ text: "thinking..." }],
    timestamp: new Date().toISOString(),
    thinkingPlaceholder: true,
  });

  // Send the prompt to the API
  const { data, error } = await useFetch("/api/chat", {
    method: "POST",
    body: { messageHistory: messageHistory, prompt: prompt },
  });

  // Remove the "thinking" placeholder
  const idx = messages.value.findIndex(m => m.thinkingPlaceholder);
  if (idx !== -1) messages.value.splice(idx, 1);
  isThinking.value = false;

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
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  position: fixed;
  overscroll-behavior-y: none;
  overscroll-behavior-x: none;
}

.container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  overflow-y: scroll;
  -ms-scroll-chaining: none;
  overscroll-behavior: contain;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.chat-container {
  height: calc(100% - 20px);
  width: calc(100% - 20px);
  max-width: 600px;
  padding: 0px;
  margin: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.intro {
  margin-bottom: 20px;
  height: 50px;
  display: none;
  align-items: center;
}

.intro .icon-container {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.intro .icon-container a {
  margin: 0 0.5em;
}

.intro .icon-container img {
  width: 20px;
  height: auto;
}

@media only screen and (min-height: 400px) {
  .intro {
    display: flex;
  }
}

.intro img {
  width: 40px;
  margin-right: 10px;
}

.intro h1 {
  font-size: 2em;
  margin: 0;
  color: #16568B
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
  padding: 0.5em 0.8em;
}

.message.left {
  max-width: 80%;
  width: fit-content;

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
  color: rgb(226, 226, 233);
  font-weight: 400;
  background-color: #16568B;
  text-align: left;
  border-radius: 16px;
  display: flex;
  flex-direction: row;

}

.message-text {
  font-size: 1em;
  margin: 0;
  padding: 0;
}

.time {
  font-size: 0.7em;
  width: max-content;
  padding-left: 8px;
  color: #a6a6a6;
  text-align: right;
  margin: 4px 0 0 0;
  display: flex;
  flex-direction: column;
  justify-content: end;
  white-space: nowrap;
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

  .message {
    padding: 0.8em 1em;
  }


  .button {
    display: inline-block;
  }

  .input {
    width: calc(100% - 36px);
  }
}
</style>