import "./assets/main.css";
// import process from "process/browser";
// window.process = process;
// window.global = window;
import { createApp } from "vue";
import App from "./App.vue";
import { Buffer } from "buffer/";
import process from "process";
import vue3GoogleLogin from "vue3-google-login";
import router from "./router";
// import "./assets/public/global.css";
// import "./assets/public/output.css";

window.global = window;
window.Buffer = Buffer;
window.process = process;
// import GAuth from "vue-google-oauth2";

// const gauthOption = {
//   clientId: "CLIENT_ID.apps.googleusercontent.com",
//   scope: "profile email",
//   prompt: "select_account",
// };

// Vue.use(GAuth, gauthOption);

const app = createApp(App);

app.use(router);
app.use(vue3GoogleLogin, {
  clientId:
    "892123420680-8t8180hqkc37qin4n3f4pf40k40e9nfr.apps.googleusercontent.com",
});

app.mount("#app");
