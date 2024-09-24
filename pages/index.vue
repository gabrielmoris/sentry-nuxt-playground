<template>
  <div class="btns-wrapper">
    <button @click="breaktheapp">Break the app</button>
    <button ref="btn" @click="unhandledErr">Handled Error</button>
    <button ref="btn2" @click="apiErr">API Error</button>
    <button ref="btn3" @click="captureErr">Sentry Capture Error</button>
    <button ref="btn4" @click="captureMsg">Sentry Capture Message</button>
  </div>
</template>

<script setup lang="ts">
import * as Sentry from "@sentry/nuxt";

const btnRef = useTemplateRef<HTMLButtonElement | null>("btn");
const btn2Ref = useTemplateRef<HTMLButtonElement | null>("btn2");
const btn3Ref = useTemplateRef<HTMLButtonElement | null>("btn3");
const btn4Ref = useTemplateRef<HTMLButtonElement | null>("btn4");

const breaktheapp = () => {
  throw new Error("Sentry, it is your turn!"); // this sill be handled:false
};

const unhandledErr = () => {
  if (btnRef.value) {
    btnRef.value.classList.add("error");
  }

  try {
    Math.max(IdontExist);
  } catch (e) {
    console.error(e); // this sill be handled:false
    setTimeout(() => {
      btnRef.value.classList.remove("error");
    }, 5000);
  }
};

const apiErr = () => {
  if (btn2Ref.value) {
    btn2Ref.value.classList.add("error");
  }

  try {
    fetch("https://www.google.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "error, of course" }),
    });
  } catch (e) {
    console.error(e); // this sill be handled:false
    setTimeout(() => {
      btn2Ref.value.classList.remove("error");
    }, 5000);
  }
};

const captureErr = () => {
  if (btn3Ref.value) {
    btn3Ref.value.classList.add("error");
  }

  try {
    throw new Error("This is for you, Sentry!");
  } catch (e) {
    console.log(e);
    Sentry.captureException(e); // this sill be handled:true
  }
  setTimeout(() => {
    btn3Ref.value.classList.remove("error");
  }, 5000);
};

const captureMsg = () => {
  if (btn4Ref.value) {
    btn4Ref.value.classList.add("error");
  }
  Sentry.captureMessage("It's all right, dont freak out."); // this sill be handled:true and not as an error
  setTimeout(() => {
    btn4Ref.value.classList.remove("error");
  }, 5000);
};
</script>

<style>
button {
  padding: 1rem 1.5rem;
  border-radius: 5px;
}

.btns-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.error {
  animation: fatalerror 1s infinite;
}

@keyframes fatalerror {
  0% {
    background-color: red;
  }
  50% {
    background-color: white;
  }
  100% {
    background-color: red;
  }
}
</style>
