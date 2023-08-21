<script setup>
import { ref } from "vue";
</script>

<template>
  <header>
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/google">Google Sign In</router-link></li>
        <li><router-link to="/discord">Discord Sign In</router-link></li>
        <li><router-link to="/webauthn">Webauthn Sign In</router-link></li>
        <li><router-link to="/wallet">Wallet Sign In</router-link></li>
      </ul>
    </nav>
  </header>
  <div>
    <router-view></router-view>
  </div>

  <main></main>
</template>

<style scoped>
header {
  background-color: #333;
  color: white;
  padding: 1rem;
}

/* nav ul {
  list-style-type: none;
  padding: 0;
  display: flex;
}

nav li {
  margin-right: 1rem;
} */
</style>
