import "./assets/main.css";
import { createApp } from "vue";
import App from "./App.vue";
import { Buffer } from "buffer/";
import process from "process";
import vue3GoogleLogin from "vue3-google-login";
import router from "./router";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

window.global = window;
window.Buffer = Buffer;
window.process = process;

const app = createApp(App);

app.use(router);
app.use(vue3GoogleLogin, {
  clientId: GOOGLE_CLIENT_ID,
});

app.mount("#app");
