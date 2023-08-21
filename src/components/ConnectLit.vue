<template>
  <div>
    <button @click="connectToLitNetwork">Connect to Lit Network</button>
  </div>
</template>

<script>
import Lit from "../utils/lit";

export default {
  methods: {
    onLitReady(e) {
      console.log("LIT network is ready");
    },
    async connectToLitNetwork() {
      await Lit.connect();
      console.log("Connected to Lit Network");
    },
  },
  mounted() {
    document.addEventListener("lit-ready", this.onLitReady, false);
  },
  beforeUnmount() {
    document.removeEventListener("lit-ready", this.onLitReady, false);
  },
};
</script>
